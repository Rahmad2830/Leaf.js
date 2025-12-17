// rollup.config.mjs
import { minify } from 'rollup-plugin-esbuild-minify'
import resolve from '@rollup/plugin-node-resolve'

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/cdn.min.js',
		format: 'iife',
		name: 'Leaf'
	},
	plugins: [resolve(), minify()]
};