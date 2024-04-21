# Css 4 Life

An approachable build abstraction for creating distributable themes using postcss as a css processor. Just pass your postcss files, and it spits out vanilla CSS.

## Benefits over CSS

- future css syntax support
- custom media queries thanks to `postcss-custom-media`
- automated vendor prefixes thanks to `autoprefixer`
- `@mixin` syntax support thanks to `postcss-mixins`
- CSS minification thanks to `cssnano`
- math support thanks to `postcss-calc`
- style linting thanks to `style-lint`
- source map support thanks to `gulp-sourcemaps`

Coming <strike>soon</strike> also
- [Responsive text support](https://github.com/madeleineostoja/postcss-responsive-type)
- [Responsive images](https://github.com/reworkcss/rework-plugin-at2x)

## CLI

It looks something like this, i'ma document this more when its complete 

- `css4life build --srcDir="" --outputDir="" --cssVariables=""`

## Local Setup 

It's gotta be a multi-step process to test the executable aspect of this. The local setup consists of 3 steps. They are outlined as follows:

1. [Clone and install css4life dependencies](#clone-and-install-css4life-dependencies) 
2. [Create a test project](#create-a-test-project)
3. [Link the two local projects together]()

### Clone and install css4life dependencies
First you'd want to clone this repo

```sh
git clone https://github.com/matthewbub/css4life
cd css4life
npm install
```

### Create a test project
Then adjacent of the `css4life` repository, you might create a `css4life-test` directory or something.

After digestion, execute the following set of commands to setup a test new project

```sh
# outside of css4life

mkdir css4life-test
cd css4life-test
touch package.json
```

Inside the `css4life-test/package.json` add the minimum bits 

```json
{
  "name": "css4life-test",
  "version": "0.0.0",  
	"devDependencies": {
		"css4life": "file://../css4life"
	}
}
```

### Link the two local projects together

Now we need to link the projects together. 

**Linking css4life**

In the `css4life` directory; execute `npm link` 

**Linking css4life-test**

Then, in the `css4life-test` directory, execute `npm link css4life`

---

Finally go to the `css4life-test/package.json` and add a build script

```json
{
  "name": "css4life-test",
  "version": "0.0.0",  
	"scripts": {
		"build": "css4life build --src='test.css' --build='dist'"
	},
	"devDependencies": {
		"css4life": "file://../css4life"
	}
}
```

Now we're able to write and compile CSS in the `css4life-test` package, and implement dev changes to the `css4life` build package without having to do anything other than save our changes and run the npm command again. 

[![Travis Scott - MODERN JAM](https://img.youtube.com/vi/g8IvO7OwdaM/0.jpg)](https://www.youtube.com/watch?v=g8IvO7OwdaM)