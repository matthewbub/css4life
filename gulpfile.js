const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnanoPlugin = require('cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

function styles() {
	return gulp.src('src/*.css')
		.pipe(sourcemaps.init())
		.pipe(postcss([
			autoprefixer
		]))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('dist'));
}

function minify() {
	return gulp.src('dist/*.css')
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(postcss([
			cssnanoPlugin
		]))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('dist'));
}

const build = gulp.series(styles, minify);

gulp.task('styles', styles);

gulp.task('minify', minify);
gulp.task('default', build);

