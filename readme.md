# Css 4 Life

An approachable build abstraction for creating distributable themes using postcss as a css processor. Just pass your postcss files, and it spits out vanilla CSS.

**Benefits over CSS**

- Future CSS syntax support
- Custom media queries enabled by `postcss-custom-media`
- Cross-browser compatibility thanks to `autoprefixer`
- `@mixin` syntax support thanks to `postcss-mixins`
- CSS minification thanks to `cssnano`
- Math support thanks to `postcss-calc`
- Style linting thanks to `style-lint`
- Source map support thanks to `gulp-sourcemaps`

## Table of contents
- [Setup](#setup)
- [Commands](#commands)
	- [Build](#build)
		- [Build / Flags](#build--flags)
	- [Minify](#minify)
		- [Minify / Flags](#minify--flags)
	- [Lint](#lint)
		- [Lint / Flags](#watch--flags)
	- [Watch](#watch)
		- [Watch / Flags](#watch--flags)
## Setup 
Just clone this repo into your build tools or desired location, and then hit the `./gulpfile.js` in the root directory 

```sh
# example build command
node ./build-tools/css4life/gulpfile.js build --src='public/example/*.css' --build='dist'
```

## Commands

### Build

To build your CSS files, invoke the CLI tool by targeting the root `gulpfile.js` with Node.js, followed by the `build` command, then your additional arguments. 

At a minimum, you should pass the `--src` and `--build` flags. For further extendability you could also pass a JSON string of CSS variables to be used in the build process.

```shell
node ./path/to/this/gulpfile.js build --src=<source-directory> --build=<build-directory> --variables=<json-string-of-css-variables>
```

#### Build / Flags

- `--src`: Specifies the source directory containing your CSS files.
- `--build`: Specifies the output directory for the built CSS files.
- `--variables`: (Optional) Provides a JSON string of CSS variables to be used in the build process.
- `--concat`: (Optional) Concatenates all CSS files within the `--src` directory. Defaults to `false`

### Minify

To minify your CSS files, invoke the CLI tool by targeting the root `gulpfile.js` with Node.js, followed by the `minify` command, then your additional arguments.

At a minimum, you should pass the `--src` and `--build` flags.

```shell
node ./path/to/this/gulpfile.js minify --src=<source-directory> --build=<build-directory>
```

#### Minify / Flags

- `--src`: Specifies the source directory containing your CSS files.
- `--build`: Specifies the output directory for the minified CSS files.

### Lint

To lint your compiled CSS files, invoke the CLI tool by targeting the root `gulpfile.js` with Node.js, followed by the `lint` command, then your additional arguments.

At a minimum, you should pass the `--src` and `--build` flags.

```shell
node ./path/to/this/gulpfile.js lint --src=<source-directory> 
```

#### Lint / Flags

- `--src`: Specifies the source directory containing your CSS files.

### Watch

To watch your PostCSS files, invoke the CLI tool by targeting the root `gulpfile.js` with Node.js, followed by the `watch` command, then your additional arguments. 

At a minimum, you should pass the `--src` and `--build` flags. For further extendability you could also pass a JSON string of CSS variables to be used in the build process.

```shell
node ./path/to/this/gulpfile.js build --src=<source-directory> --build=<build-directory> --variables=<json-string-of-css-variables>
```

#### Watch / Flags
- `--src`: Specifies the source directory containing your CSS files.
- `--build`: Specifies the output directory for the built CSS files.
- `--variables`: (Optional) Provides a JSON string of CSS variables to be used in the build process.