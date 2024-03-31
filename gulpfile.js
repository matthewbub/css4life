const gulp = require('gulp');
const sass = require('sass');

// gulp plugins
const postcssPlugin = require('gulp-postcss');
const renamePlugin = require('gulp-rename');
const sourcemapsPlugin = require('gulp-sourcemaps');
const sassPlugin = require('gulp-sass')(sass);

// postcss plugins
const autoprefixerPlugin = require('autoprefixer');
const cssnanoPlugin = require('cssnano');
const stylelintPlugin = require('stylelint');
const reporterPlugin = require('postcss-reporter');
const cssVariablesPlugin = require('postcss-css-variables');
const cssMixinsPlugin = require('postcss-mixins');
const calcPlugin = require('postcss-calc');
const nestingPlugin = require('postcss-nesting');

function buildStyles() {
	// convert CSS variables to static values for older browsers
	const cssVariablesConfig = cssVariablesPlugin({
		// TODO: accept JSON string as optional CLI arg
		variables: {
			'--primary-color': '#FFD600',
			'--neutrals-dark': '#000000',
			'--neutrals-greydark': '#B9B9B9',
			'--neutrals-grey': '#D9D9D9',
			'--neutrals-greylight': '#F1F1F1',
			'--neutrals-light': '#FFFFFF'
		}
	});
	const cssMixinsConfig = cssMixinsPlugin({});
	const calcConfig = calcPlugin({/* handle pixel fall back for rem values */ });
	const nestingConfig = nestingPlugin({});

	return gulp.src('src/*.css')
		.pipe(sourcemapsPlugin.init())
		.pipe(postcssPlugin([
			autoprefixerPlugin,
			cssVariablesConfig,
			cssMixinsConfig,
			calcConfig,
			nestingConfig
		]))
		.pipe(sourcemapsPlugin.write('./maps'))
		.pipe(gulp.dest('dist'));
}

/**
 * @name minifyCSS - npm run minify
 * 
 * @readme
 * Minifies CSS files and generates source maps.
 * 
 * This function takes CSS files from the 'dist' directory, minifies them,
 * generates source maps for debugging, and saves the output back to the 'dist' directory.
 */
function minifyCSS() {
	return gulp.src('dist/*.css')
		.pipe(sourcemapsPlugin.init({ loadMaps: true }))
		.pipe(postcssPlugin([ cssnanoPlugin ]))
		.pipe(renamePlugin({ suffix: '.min' }))
		.pipe(sourcemapsPlugin.write('/maps'))
		.pipe(gulp.dest('dist'));
}

function watch() {
	const watcher = gulp.watch('src/*.css', build)
	watcher.on('change', function(fileName) {
		console.log('Rebuilding ' + fileName)
	});
}

function lintDevCode() {
	const stylelintRules = {
		"color-no-invalid-hex": 2,
	}

	const stylelintConfig = stylelintPlugin({ rules: stylelintRules })

	const postcssOptions = [
		stylelintConfig,
		reporterPlugin({ clearMessages: true })
	]

	return gulp.src('src/*.css')
		.pipe(postcssPlugin(postcssOptions))
}

/** @deprecated I'm not supporting this, but it should work out of the box */
function buildSass() {
	const sassConfig = sassPlugin({
		outputStyle: 'compressed'
	})
	const sassHandler = sassConfig.on('error', sassPlugin.logError);
	return gulp.src('src/*.scss')
		.pipe(sassHandler)
		.pipe(gulp.dest('src/'))
}

/**
 * @name build - npm run build
 * @readme a series of tasks to build the CSS files 
 * 
 * if you don't like or want a particular task, you can remove it from the series
 * 
 * @note if you want to use scss files, you can use the `buildSass` task at your own risk
 * it would need to be treated as a preprocess step before the `buildStyles` task
 */
const build = gulp.series(/*buildSass,*/ buildStyles, lintDevCode, minifyCSS /*...*/);

gulp.task('build-sass', buildSass);
gulp.task('build-styles', buildStyles);
gulp.task('minify', minifyCSS);
gulp.task('default', build);
gulp.task('lint-dev', lintDevCode);
gulp.task('watch', watch);
