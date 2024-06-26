import js from '@eslint/js'
import ts from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/'],
	},
	{
		rules: {
			'array-bracket-newline': ['error', 'consistent'],
			'array-element-newline': 'off',
			'arrow-body-style': 'off',
			camelcase: ['error', { properties: 'never' }],
			'capitalized-comments': 'off',
			'comma-dangle': [
				'error',
				{
					arrays: 'always-multiline',
					exports: 'never',
					functions: 'never',
					imports: 'never',
					objects: 'always-multiline',
				},
			],
			complexity: 'off',
			'default-case': 'off',
			'default-last-param': 'off',
			'dot-location': ['error', 'property'],
			'func-names': 'off',
			'function-call-argument-newline': ['error', 'consistent'],
			'id-length': 'off',
			'init-declarations': 'off',
			'linebreak-style': ['error', 'unix'],
			'lines-around-comment': 'off',
			'lines-between-class-members': 'off',
			'max-len': ['error', { code: 140 }],
			'max-lines': 'off',
			'max-lines-per-function': 'off',
			'max-params': 'off',
			'max-statements': 'off',
			'multiline-comment-style': 'off',
			'multiline-ternary': ['error', 'always-multiline'],
			'no-bitwise': 'off',
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'no-continue': 'off',
			'no-extra-parens': 'off',
			'no-magic-numbers': 'off',
			'no-ternary': 'off',
			'no-undefined': 'off',
			'no-undef-init': 'off',
			'object-curly-spacing': ['error', 'always'],
			'object-property-newline': [
				'error',
				{ allowAllPropertiesOnSameLine: true },
			],
			'one-var': ['error', 'never'],
			'padded-blocks': ['error', 'never'],
			'prefer-destructuring': 'off',
			'sort-keys': 'off',
			'sort-imports': 'off',
			'quote-props': ['error', 'consistent-as-needed'],
			quotes: ['error', 'single'],
			semi: ['error', 'never'],

			'unicorn/no-useless-undefined': 'off',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-keyword-prefix': ['error', { checkProperties: false }],
			'unicorn/no-array-for-each': 'off',
			'unicorn/no-null': 'off',
			'unicorn/filename-case': [
				'error',
				{
					cases: {
						camelCase: true,
						pascalCase: true,
					},
				},
			],

			'@typescript-eslint/prefer-for-of': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
]
