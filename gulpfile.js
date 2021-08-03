const gulp = require("gulp");
const nodeSass = require('node-sass');
const gulpSass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const autoPrefixer = require("gulp-autoprefixer");

const sass = gulpSass(nodeSass);

function scss(){
    return gulp.src('./dev/scss/**.scss')
        .pipe(sass())
        .pipe(autoPrefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'],{
            cascade:false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('public/stylesheets'));
}

function js(){
    return gulp.src('./dev/js/**.js')
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascripts'));
}

gulp.task('scss', scss);
gulp.task('js', js);

gulp.task('default', gulp.series('scss', 'js'), () => {
    gulp.watch('./dev/scss/**.scss', gulp.series(scss));
    gulp.watch('./dev/js/**.js', gulp.series(js));
});