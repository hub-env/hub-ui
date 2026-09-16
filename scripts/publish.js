#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtener el argumento de la línea de comandos
const libraryName = process.argv[2];

// Lista de bibliotecas válidas
const validLibraries = [
	'utils',
	'action-sheet',
	'paginable',
	'portal',
	'modal',
	'stepper',
	'breadcrumbs',
	'avatar',
	'board',
	'calendar',
	'history',
	'sortable',
	'nav',
	'skeleton',
	'panels',
	'forms',
	'ds',
	'buttons',
	'badges',
	'icons',
	'metrics',
	'toast',
	'milestones',
	'installer',
	'signature',
	'loading'
];

/**
 * Función para mostrar ayuda
 */
function showHelp() {
	console.log(`
📦 Script de Publicación de Bibliotecas ng-hub-ui

Uso: npm run publish <library-name>

Bibliotecas disponibles:
${validLibraries.map((lib) => `  • ${lib}`).join('\n')}

Ejemplos:
  npm run publish paginable
  npm run publish modal
  npm run publish utils

También puedes usar los aliases:
  npm run publish:paginable
  npm run publish:modal
  npm run publish:utils
  npm run publish:buttons
  npm run publish:toast
  npm run publish:installer
`);
}

// NOTE: the former `ngPackagrLibraries` group is gone. Every library has a
// workspace `build` target, and raw `npx ng-packagr -p …` ignored the libs'
// own tsconfig (workspace strictness AND the `paths` overrides) — publishing
// forms/metrics/panels silently failed the day they gained an
// `ng-hub-ui-utils` import (2026-07-28). `ng build <library>` is the single
// build path for every non-direct library now.

/**
 * Libraries that are published directly from their project folder after a custom build step.
 * Key = library name used by this script,
 * Value = { projectDir: relative path inside `projects/`, buildCommand: command run before packaging }
 */
const directPublishLibraries = {
	installer: {
		projectDir: 'installer',
		buildCommand: './node_modules/.bin/tsc -p projects/installer/tsconfig.schematics.json'
	},
	ds: {
		projectDir: 'ds',
		// Full style build: tokens + the three utility sheets + the native reset
		// (kept in sync with the package's own `build:styles`, which also runs on
		// `prepublishOnly` as a safety net).
		buildCommand: 'npm --prefix projects/ds run build:styles'
	}
};

/**
 * Returns true if the project directory for the given library exists.
 * Handles the special-case directories for ng-packagr libraries.
 * @param {string} library - Library short name
 * @returns {boolean}
 */
function checkLibraryExists(library) {
	const meta = directPublishLibraries[library];
	const dirName = meta ? meta.projectDir : library;
	const libraryPath = path.join(process.cwd(), 'projects', dirName);
	return fs.existsSync(libraryPath);
}

/**
 * Función principal de publicación
 */
function publishLibrary(library) {
	try {
		console.log(`🚀 Iniciando publicación de la biblioteca: ${library}`);

		// Verificar si la biblioteca existe
		if (!checkLibraryExists(library)) {
			console.error(`❌ Error: La biblioteca '${library}' no existe en el directorio projects/`);
			process.exit(1);
		}

		// Step 1: Build the library
		console.log(`📦 Construyendo la biblioteca ${library}...`);

		const directPublishMeta = directPublishLibraries[library];

		if (directPublishMeta) {
			execSync(directPublishMeta.buildCommand, {
				stdio: 'inherit',
				cwd: process.cwd()
			});
		} else {
			// Registered in the workspace angular.json — use the Angular CLI
			execSync(`ng build ${library}`, {
				stdio: 'inherit',
				cwd: process.cwd()
			});
		}

		// Paso 2: Cambiar al directorio de distribución
		const distPath = directPublishMeta
			? path.join(process.cwd(), 'projects', directPublishMeta.projectDir)
			: path.join(process.cwd(), 'dist', library);

		if (!fs.existsSync(distPath)) {
			console.error(`❌ Error: El directorio de distribución '${distPath}' no existe`);
			process.exit(1);
		}

		console.log(`📋 Empaquetando la biblioteca...`);

		// Paso 3: Crear el paquete.
		//
		// `--pack-destination` matters more than it looks. `npm pack` writes the tarball into
		// its working directory, and that directory is the one `npm publish` packs on the next
		// line — so every release shipped a compressed copy of itself inside itself, roughly
		// doubling what a consumer downloads and putting an archive where a library's files
		// should be. Keeping the artifact is still useful for inspecting a release, so it goes
		// beside `dist/` rather than inside the package.
		const packDir = path.join(process.cwd(), 'dist', '.packs');
		fs.mkdirSync(packDir, { recursive: true });

		execSync(`npm pack --pack-destination "${packDir}"`, {
			stdio: 'inherit',
			cwd: distPath
		});

		// Paso 4: Publicar
		console.log(`🌐 Publicando la biblioteca...`);
		execSync('npm publish', {
			stdio: 'inherit',
			cwd: distPath
		});

		console.log(`✅ ¡Biblioteca ${library} publicada exitosamente!`);
	} catch (error) {
		console.error(`❌ Error durante la publicación de ${library}:`);
		console.error(error.message);
		process.exit(1);
	}
}

// Validación de argumentos
if (!libraryName) {
	console.error('❌ Error: Debes especificar el nombre de la biblioteca');
	showHelp();
	process.exit(1);
}

// Validar que la biblioteca sea válida
if (!validLibraries.includes(libraryName)) {
	console.error(`❌ Error: '${libraryName}' no es una biblioteca válida`);
	console.error(`Bibliotecas disponibles: ${validLibraries.join(', ')}`);
	showHelp();
	process.exit(1);
}

// Ejecutar la publicación
publishLibrary(libraryName);
