import { eslint } from 'rollup-plugin-eslint';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

const plugins = [
  eslint({
    throwOnError: true,
  }),
  typescript(),
  commonjs({ extensions: ['.js', '.ts'] }),
  resolve({
    customResolveOptions: {
      moduleDirectory: './bin',
    },
  }),
  json(),
];

const onwarn = (warning, next) => {
  if (warning.loc && warning.loc.file.includes('/node_modules/')) {
    return;
  }
  next(warning);
};

export default [
  {
    input: 'src/index.ts',
    onwarn,
    output: {
      file: 'bin/parser.js',
      format: 'cjs',
    },
    plugins,
  },
];
