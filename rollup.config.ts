import typescript from 'rollup-plugin-typescript';
import tslint from 'rollup-plugin-tslint';

const plugins = [
    typescript(),
    tslint({
        throwOnError: true,
    }),
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
