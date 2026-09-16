/**
 * Normaliza la ruta dada:
 *    - Colapsa segmentos innecesarios (ej: `a/./b`)
 *    - Normaliza de backslashes a forward slashes Posix
 *    - Elimina un `./` inicial si está presente
 */
export function normalizePath(input: string): string {
	// Normalizar slashes
	input = input.replace(/\\/g, '/');

	// Colapsar segmentos como ./
	const parts = input.split('/');
	const result: string[] = [];

	for (const part of parts) {
		if (part === '.' || part === '') {
			// Ignorar . y segmentos vacíos (excepto al inicio para rutas absolutas)
			if (result.length === 0 && part === '') {
				result.push(part);
			}
			continue;
		}
		if (part === '..') {
			// Subir un nivel
			if (result.length > 0 && result[result.length - 1] !== '..') {
				result.pop();
			} else {
				result.push(part);
			}
		} else {
			result.push(part);
		}
	}

	let normalized = result.join('/');

	// Eliminar ./ inicial
	if (normalized.startsWith('./')) {
		normalized = normalized.substring(2);
	}

	return normalized;
}
