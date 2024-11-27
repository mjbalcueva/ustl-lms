/** @type {import("eslint").Linter.Config} */
const config = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true
	},
	plugins: ['@typescript-eslint', 'boundaries'],
	extends: [
		'next/core-web-vitals',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked'
	],
	rules: {
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports'
			}
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_'
			}
		],
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				checksVoidReturn: {
					attributes: false
				}
			}
		],
		'boundaries/no-unknown': 'error',
		'boundaries/no-unknown-files': 'error',
		'boundaries/element-types': [
			'error',
			{
				default: 'disallow',
				rules: [
					{
						from: ['core'],
						allow: ['core']
					},
					{
						from: ['common', 'app', 'neverImport'],
						allow: ['common', 'core', 'feature']
					},
					{
						from: ['feature'],
						allow: [
							['feature', { featureName: '${from.featureName}' }],
							['feature', { moduleScope: 'shared' }],
							'common',
							'core'
						]
					},
					{
						from: ['app'],
						allow: [['app', { fileName: '*.css' }]]
					}
				]
			}
		]
	},
	settings: {
		'boundaries/include': ['src/**/*'],
		'boundaries/elements': [
			{
				type: 'core',
				pattern: ['src/core/**/*'],
				mode: 'full'
			},
			{
				type: 'common',
				pattern: ['src/server/**/*', 'src/services/**/*'],
				mode: 'full'
			},
			{
				type: 'feature',
				pattern: [
					'src/features/*/(?<moduleScope>instructor|shared|student)/**/*',
					'src/features/*/**/*'
				],
				mode: 'full',
				capture: ['featureName', 'moduleScope']
			},
			{
				type: 'app',
				pattern: ['src/app/**/*'],
				mode: 'full',
				capture: ['_', 'fileName']
			},
			{
				type: 'neverImport',
				pattern: ['src/*'],
				mode: 'full'
			}
		],
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true
			}
		}
	}
}

module.exports = config
