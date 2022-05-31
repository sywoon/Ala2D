const gulp = require("gulp");
const ts = require("gulp-typescript");
const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript2');
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")
const glsl = require('rollup-plugin-glsl');




const watchClientSrc = done => {
    gulp.watch('./src/**/*.ts', gulp.series(compleClient))
    done()
}

function compleClient() {
    return rollup.rollup({
        input: './src/Main.ts',
        treeshake: true,//建议忽略
        plugins: [
            typescript({
                check: false,
                clean:true
                // tsconfigOverride: { compilerOptions: { removeComments: true } }
            }),
            glsl({
                include: /.*(.glsl|.vs|.fs)$/,
                sourceMap: true,
                compress: false
            }),
        ]
    }).then(bundle => {
        return bundle.write({
            file: './bin/js/bundle.js',
            format: 'iife',
            name: 'mygame',
            sourcemap: true 
        });
    });
}


gulp.task('default',gulp.series(compleClient, watchClientSrc))