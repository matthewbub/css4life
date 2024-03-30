const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnanoPlugin = require('cssnano');
const rename = require('gulp-rename');

// Define the 'styles' task
function styles() {
	return gulp.src('src/*.css')
		.pipe(postcss([
			autoprefixer
		]))
		.pipe(gulp.dest('dist'));
}

// Define the 'minify' task with 'styles' as a dependency
function minify() {
	return gulp.src('dist/*.css') // Changed from 'dist/example.css' to 'dist/*.css' to generalize the task
		.pipe(postcss([
			cssnanoPlugin
		]))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
}

// Use 'gulp.series' for running tasks in order. If you need to run tasks in parallel, use 'gulp.parallel'
const build = gulp.series(styles, minify);

// Expose the tasks to Gulp
gulp.task('styles', styles);
gulp.task('minify', minify);
gulp.task('default', build);

