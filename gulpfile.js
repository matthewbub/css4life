const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnanoPlugin = require('cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const cssVariables = require('postcss-css-variables');
const sassPlugin = require('gulp-sass')(require('sass'));

function buildStyles() {

	// CSS Vars are stage 1
	// https://drafts.csswg.org/css-variables/
	const cssVariablesConfig = cssVariables({
		variables: {
			'--primary-color': '#FFD600',
			'--neutrals-dark': '#000000',
			'--neutrals-greydark': '#B9B9B9',
			'--neutrals-grey': '#D9D9D9',
			'--neutrals-greylight': '#F1F1F1',
			'--neutrals-light': '#FFFFFF'
		}
	});

	return gulp.src('src/*.css')
		.pipe(sourcemaps.init())
		.pipe(postcss([
			autoprefixer,
			cssVariablesConfig
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
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest('dist'));
}

function watch() {
	const watcher = gulp.watch('src/*.css', build)
	watcher.on('change', function(fileName) {
		console.log('Rebuildig ' + fileName)
	});
}

function lint() {
	const stylelintRules = {
		"color-no-invalid-hex": 2,
	}

	const stylelintConfig = stylelint({ rules: stylelintRules })

	const postcssOptions = [
		stylelintConfig,
		reporter({ clearMessages: true })
	]

	return gulp.src('src/*.css')
		.pipe(postcss(postcssOptions))
}

function buildSass() {
	const sassConfig = sassPlugin({
		outputStyle: 'compressed'
	})
	const sassHandler = sassConfig.on('error', sassPlugin.logError);
	return gulp.src('src/*.scss')
		.pipe(sassHandler)
		.pipe(gulp.dest('src/'))
}

const build = gulp.series(/*buildSass,*/ buildStyles, minify /*...*/);

//gulp.task('build-sass', buildSass);
gulp.task('build-styles', buildStyles);
gulp.task('minify', minify);
gulp.task('default', build);
gulp.task('lint', lint);
gulp.task('watch', watch);
