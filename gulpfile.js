const gulp = require("gulp");
const ts = require("gulp-typescript");
const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript2');
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")
const glsl = require('rollup-plugin-glsl');
var through = require('through2');
const matched = require('matched');
const path = require('path');


var packsDef = [
    {
        'libName': "Ala",
        'input': [
            './src/Ala/**/*.*'
        ],
        'out': './bin/js/ala.js'
    },
    // {
    //     'libName': "client",
    //     'input': [
    //         './src/main.ts'
    //     ],
    //     'out': './dist/client.js'
    // },
]



var curPackFiles = null;  //当前包的所有的文件
var mentry = 'multientry:entry-point';
function myMultiInput() {
    var include = [];
    var exclude = [];
    function configure(config) {
        if (typeof config === 'string') {
            include = [config];
        } else if (Array.isArray(config)) {
            include = config;
        } else {
            include = config.include || [];
            exclude = config.exclude || [];

            if (config.exports === false) {
                exporter = function exporter(p) {
                    if (p.substr(p.length - 3) == '.ts') {
                        p = p.substr(0, p.length - 3);
                    }
                    return `import ${JSON.stringify(p)};`;
                };
            }
        }
    }

    var exporter = function exporter(p) {
        if (p.substr(p.length - 3) == '.ts') {
            p = p.substr(0, p.length - 3);
        }
        return `export * from ${JSON.stringify(p)};`;
    };

    return (
        {
            options(options) {
                console.log('options', options.input)
                configure(options.input);
                options.input = mentry;
            },

            resolveId(id, importer) {//mentry是个特殊字符串，rollup并不识别，所以假装这里解析一下
                console.log('resolveId', id, importer)
                if (id === mentry) {
                    return mentry;
                }
                if (mentry == importer)
                    return null;

                var importfile = path.join(path.dirname(importer), id);
                var ext = path.extname(importfile);
                if (ext != '.ts' && ext != '.glsl' && ext != '.vs' && ext != '.ps' && ext != '.fs') {
                    importfile += '.ts';
                }
                console.log('import ', importfile);
                if (curPackFiles.indexOf(importfile) < 0) {
                    //其他包里的文件
                    console.log('other pack:',id,'importer=', importer);
                    return 'Ala';
                }
            },
            load(id) {
                console.log("load", id)
                if (id === mentry) {
                    if (!include.length) {
                        return Promise.resolve('');
                    }

                    var patterns = include.concat(exclude.map(function (pattern) {
                        return '!' + pattern;
                    }));

                    console.log("patterns", patterns)
                    return matched.promise(patterns, { realpath: true }).then(function (paths) {
                        console.log("paths", paths)
                        curPackFiles = paths;   // 记录一下所有的文件
                        paths.sort();
                        var str = paths.map(exporter).join('\n');
                        console.log("load return", str);
                        return str;
                    });
                } else {
                    //console.log('load ',id);
                }
                return null;
            }
        }
    );
}


gulp.task('buildJS', async function () {
    for (let i = 0; i < packsDef.length; ++i) {
        const subTask = await rollup.rollup({
            input: packsDef[i].input,
            output: {
                extend: true,
                globals: { 'Ala': 'Ala' }
            },
            external: ['Ala'],
            plugins: [
                myMultiInput(),
                typescript({
                    tsconfig: "./tsconfig.json",
                    check: false,
                    useTsconfigDeclarationDir: true,
                    tsconfigOverride: {
                        compilerOptions: { "rootDir": "./src/Ala", "declaration": true, 
                                "declarationDir": "./lib", removeComments: true }
                    }
                }),
                glsl({
                    include: /.*(.glsl|.vs|.fs)$/,
                    sourceMap: false,
                    compress: false
                }),
            ]
        });

        await subTask.write({
            file: packsDef[i].out,
            format: 'iife',
            name: 'Ala',
            sourcemap: true,
            extend: true,
            globals: { 'Ala': 'Ala' }
        });
    }
});


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
    gulp.watch('./src/Ala/**/*.ts', gulp.series('buildJS', ModifierJs))
    done()
}

gulp.task('ala',gulp.series('buildJS', ModifierJs))
gulp.task('alaw',gulp.series('buildJS', ModifierJs, browerEngineSrc))


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
                clean:true,
                // useTsconfigDeclarationDir: false,
                tsconfigOverride: { compilerOptions: { removeComments: true } }
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