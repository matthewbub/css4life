const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnanoPlugin = require('cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');

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

function watch() {
	const watcher = gulp.watch('src/*.css', build)
	watcher.on('change', function(fileName) {
		console.log('Rebuildig ' + fileName)
	});
}

function lint() {
	const rules = {
		"color-no-invalid-hex": 2,
	}

	const stylelintConfig = stylelint({ rules })
	return gulp.src('src/*.css')
		.pipe(
			postcss([
				stylelintConfig,
				reporter({
					clearMessages: true
				})
			])
		)
}

const build = gulp.series(styles, minify);

gulp.task('styles', styles);
gulp.task('minify', minify);
gulp.task('default', build);
gulp.task('lint', lint);
gulp.task('watch', watch);
