// @ts-check
// Flat ESLint config for the docs application (`src/**` only).
// The libraries under `projects/**` are git submodules with their own
// lifecycles, so they are deliberately left out of this config for now.
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
	{
		// Never descend into build output or the library submodules.
		ignores: ['projects/**', 'dist/**', 'out-tsc/**', 'coverage/**', '.angular/**']
	},
	{
		files: ['src/**/*.ts'],
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
		processor: angular.processInlineTemplates,
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'app',
					style: 'camelCase'
				}
			],
			// warn (not error): the shared docs infrastructure (doc-viewer, example-viewer,
			// code-snippet, header-link, playground…) uses historical unprefixed selectors;
			// renaming them touches templates across the whole app.
			'@angular-eslint/component-selector': [
				'warn',
				{
					type: 'element',
					prefix: 'app',
					style: 'kebab-case'
				}
			],
			// warn (not error): retrofitting OnPush onto ~370 existing docs components is a
			// behavioral change that must be done deliberately, not as a lint sweep.
			'@angular-eslint/prefer-on-push-component-change-detection': 'warn',
			// warn (not error): ~100 pre-existing `any`s in example/demo code; typing them
			// properly is real work, not a mechanical fix.
			'@typescript-eslint/no-explicit-any': 'warn',
			// Allow intentionally unused parameters/variables when underscore-prefixed
			// (interface-shaped callbacks and template-bound handlers).
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		files: ['src/**/*.html'],
		extends: [...angular.configs.templateRecommended],
		rules: {}
	}
);
