#!/usr/bin/env node
const { program } = require('commander');
const gulp = require("gulp");
const path = require("path");

// gulp plugins
const postcssPlugin = require("gulp-postcss");
const renamePlugin = require("gulp-rename");
const sourcemapsPlugin = require("gulp-sourcemaps");

// postcss plugins
const autoprefixerPlugin = require("autoprefixer");
const cssnanoPlugin = require("cssnano");
const stylelintPlugin = require("stylelint");
const reporterPlugin = require("postcss-reporter");
const cssVariablesPlugin = require("postcss-css-variables");
const cssMixinsPlugin = require("postcss-mixins");
const calcPlugin = require("postcss-calc");
const nestingPlugin = require("postcss-nesting");
const customMediaPlugin = require("postcss-custom-media");
const postcssImportPlugin = require("postcss-import");

/**
 * Represents an error that occurs during JSON parsing.
 * @constructor
 * @extends Error
 * @param {string} message - The error message that explains the reason for the error.
 */
function JsonParsingError(message) {
	/**
	 * The name of the error.
	 * @type {string}
	 */
	this.name = "JsonParsingError";

	/**
	 * Descriptive message associated with the error.
	 * @type {string}
	 */
	this.message = message;

	/**
	 * Stack trace of the error.
	 * @type {string}
	 */
	this.stack = (new Error()).stack;
}

// Setting up the prototype chain to inherit properties and methods from Error
JsonParsingError.prototype = Object.create(Error.prototype);

// Ensuring the constructor is set to JsonParsingError
JsonParsingError.prototype.constructor = JsonParsingError;

function Store() {
	this.srcDir = "src/*.css";
	this.buildDir = "dist/";
	this.outsideCssVariables = {
		variables: {
			"--primary-color": "#FFD600",
			"--neutrals-dark": "#000000",
			"--neutrals-greydark": "#B9B9B9",
			"--neutrals-grey": "#D9D9D9",
			"--neutrals-greylight": "#F1F1F1",
			"--neutrals-light": "#FFFFFF",
		},
	};
}

/**
 * Set the source directory for the CSS files
 * @param {String} dir 
 * @throws {Error} - if the input is not a string
 */
Store.prototype.setSrcDir = function (dir) {
	if (typeof dir !== "string") {
		throw new Error("srcDir must be a string");
	}

	this.srcDir = dir;
}

/**
 * Set the build directory for the CSS files
 * @param {String} dir
 */
Store.prototype.setBuildDir = function (dir) {
	if (typeof dir !== "string") {
		throw new Error("buildDir must be a string");
	}

	this.buildDir = dir;
}

/**
 * Set the CSS variables from an outside source
 * @param {String} cssVariables - JSON string of CSS variables
 * @returns {{[x as String]: String}} - JSON string of CSS variables
 * @throws {Error} - if the input is not a string
 */
Store.prototype.setCssVariables = function (cssVariables = "") {
	if (!cssVariables) {
		return;
	}

	function parseJsonString(jsonString) {
		try {
			return JSON.parse(jsonString);
		} catch (e) {
			throw new JsonParsingError(`Error parsing JSON string: ${e.message}`);
		}
	}

	this.outsideCssVariables = parseJsonString(cssVariables);

	return this.outsideCssVariables;
}

// Create a new instance of the Store class
// This is used to store the configuration settings
const store = new Store();

/**
 * @name buildStyles - npm run build
 * @returns {NodeJS.ReadWriteStream} - a stream of CSS files
 */
function buildStyles() {
	// convert CSS variables to static values for older browsers
	const cssVariablesConfig = cssVariablesPlugin(store.outsideCssVariables);
	const cssMixinsConfig = cssMixinsPlugin({});
	const calcConfig = calcPlugin({
		/* handle pixel fall back for rem values */
	});
	const nestingConfig = nestingPlugin({});
	const customMediaConfig = customMediaPlugin({});

	return gulp
		.src(store.srcDir)
		.pipe(sourcemapsPlugin.init())
		.pipe(
			postcssPlugin([
				postcssImportPlugin,
				autoprefixerPlugin,
				cssVariablesConfig,
				cssMixinsConfig,
				calcConfig,
				nestingConfig,
				customMediaConfig,
			]),
		)
		.pipe(sourcemapsPlugin.write("./maps"))
		.pipe(gulp.dest(store.buildDir));
}

/**
 * @name minifyCSS - npm run minify
 *
 * @readme
 * Minifies CSS files and generates source maps.
 *
 * This function takes CSS files from the 'dist' directory, minifies them,
 * generates source maps for debugging, and saves the output back to the 'dist' directory.
 * 
 * @returns {NodeJS.ReadWriteStream} - a stream of CSS files
 */
function minifyCSS() {
	return gulp
		.src(path.join(`${store.buildDir}/*.css`))
		.pipe(sourcemapsPlugin.init({ loadMaps: true }))
		.pipe(postcssPlugin([cssnanoPlugin]))
		.pipe(renamePlugin({ suffix: ".min" }))
		.pipe(sourcemapsPlugin.write("/maps"))
		.pipe(gulp.dest(store.buildDir));
}


/**
 * @name watch - npm run watch
 * @readme
 * Watches for changes in the 'src' directory and rebuilds the CSS files.
 * 
 * @returns {NodeJS.WritableStream} - a stream of CSS files
 */
function watch() {
	const watcher = gulp.watch(store.srcDir, build);
	watcher.on("change", (fileName) => {
		console.log(`Rebuilding ${fileName}`);
	});
}

/**
 * @name lintDevCode - npm run lint-dev
 * @readme
 * Lints the CSS files in the 'src' directory.
 * 
 * @returns {NodeJS.ReadWriteStream} - a stream of CSS files
 */
function lintDevCode() {
	const stylelintRules = {
		"color-no-invalid-hex": true,
	};

	const stylelintConfig = stylelintPlugin({ rules: stylelintRules });

	const postcssOptions = [
		stylelintConfig,
		reporterPlugin({ clearMessages: true }),
	];

	return gulp.src(store.srcDir).pipe(postcssPlugin(postcssOptions));
}

// TODO Remove these tasks
// These tasks aren't really needed; they can be used in the scripts ie `npx gulp build`; 
// but the intent is for this to be just an abstraction of the build. They're going to be removed.
/**
 * @name build - npm run build
 * @readme a series of tasks to build the CSS files
 *
 * if you don't like or want a particular task, you can remove it from the series
 *
 * @note if you want to use scss files, you can use the `buildSass` task at your own risk
 * it would need to be treated as a preprocess step before the `buildStyles` task
 */
const build = gulp.series(
	buildStyles,
	lintDevCode,
	minifyCSS,
);

// gulp.task("build-styles", buildStyles);
gulp.task("minify", minifyCSS);
// gulp.task("default", build);
gulp.task("lint-dev", lintDevCode);
gulp.task("watch", watch);

function buildAction(args) {
	// TODO validate incoming args 
	const { src, build: buildDir, variables } = args;

	// Set the source directory for the CSS files
	store.setSrcDir(src);

	// Set the build directory for the CSS files
	store.setBuildDir(buildDir);

	// Set the CSS variables from an outside source
	store.setCssVariables(variables);

	// Programmatically run the build task
	build((err) => {
		if (err) {
			throw new Error("Build task failed:", err);
		}

		console.log("Build task completed successfully.");
	});
}

program
	.version('0.0.1')
	.description('CLI tool for managing PostCSS plugins');

program
	.command('build')
	.option('-s, --src <src>', 'source directory for CSS files')
	.option('-b, --build <build>', 'build directory for CSS files')
	.option('-v, --variables <variables>', 'CSS variables from an outside source')
	.description('build CSS files')
	.action(buildAction);

program
	.command('minify')
	.option('-s, --src <src>', 'source directory for CSS files')
	.description('minify CSS files')
	.action(() => {
		// Programmatically run the minify task
		minifyCSS((err) => {
			if (err) {
				throw new Error('Minify task failed:', err);
			}

			console.log('Minify task completed successfully.');
		});
	});

program.parse(process.argv);
