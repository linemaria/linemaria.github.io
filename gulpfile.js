const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass')); 
const { logError } = sass;

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/js/*.js",
    imagePath: "src/images/*",
    sassPath: "src/sass/*.scss"
};

//HTML-task
function copyHTML() {
 return src(files.htmlPath)
 .pipe(dest('pub'));
}

//JS-task
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'));
}
//Image-task
function imageTask() {
    return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('pub/images'));
}

//SASS-task
function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }).on("error", logError))
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}

//Watch-task
function watchTask() {
    browserSync.init({
        server: "./pub"
    });

    watch([files.htmlPath, files.jsPath, files.imagePath, files.sassPath], parallel(copyHTML, jsTask, imageTask, sassTask)).on('change', browserSync.reload);
}

exports.default = series(parallel(copyHTML, jsTask, imageTask, sassTask), 
watchTask);