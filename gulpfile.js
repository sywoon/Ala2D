const gulp = require("gulp");
const ts = require("gulp-typescript");
const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript2');
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")
const glsl = require('rollup-plugin-glsl');
var through = require('through2');



//修改引擎库
function ModifierJs() {
    return gulp.src("./bin/js/ala.js")
        .pipe(through.obj(function (file, encode, cb) {
            var srcContents = file.contents.toString();
            var destContents = srcContents.replace(/var Ala /, "window.Ala ");
            destContents = destContents.replace(/\(this.Ala = this.Ala \|\| {}, Ala\)\);/, "(window.Ala = window.Ala || {}, Ala));");
            // 再次转为Buffer对象，并赋值给文件内容
            file.contents = Buffer.from(destContents);
            // 以下是例行公事
            this.push(file)
            cb()
        }))
        .pipe(gulp.dest('./bin/js/'));
}


const browerEngineSrc = done => {
    gulp.watch('./src/Ala/**/*.ts', gulp.series(compleEngine, ModifierJs))
    done()
}

function compleEngine() {
    return rollup.rollup({
        input: './src/Ala/Ala.ts',
        treeshake: true,//建议忽略
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
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
            file: './bin/js/ala.js',
            format: 'iife',
            name: 'Ala',
            sourcemap: true 
        });
    });
}
gulp.task('ala',gulp.series(compleEngine, ModifierJs, browerEngineSrc))


const watchClientSrc = done => {
    gulp.watch('./src/Client/**/*.ts', gulp.series(compleClient))
    done()
}

function compleClient() {
    return rollup.rollup({
        input: './src/Client/Main.ts',
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


// gulp.task('default', function () {
//     return roComple();
// })
gulp.task('default',gulp.series(compleClient, watchClientSrc))