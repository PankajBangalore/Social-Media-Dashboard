//Initialise modules 
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const { notify } = require('browser-sync');
const browsersync = require('browser-sync').create();

// sass.compiler = require('dart-sass');

function scssTask(){
    return src('app/scss/style.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }))
}

function jsTask(){
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', {sourcemaps: '.'}));
}

function browserSyncServe(cb){
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}

function browserSyncReLoad(cb){
    browsersync.reload();
    cb();
}

function wasthTask(){
    watch('*.html', browserSyncReLoad);
    watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browserSyncReLoad));
}

exports.default = series(scssTask, jsTask, browserSyncServe, wasthTask);
