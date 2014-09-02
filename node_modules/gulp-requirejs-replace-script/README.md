# gulp-requirejs-replace-script
[![NPM version][npm-image]][npm-url] [![Dependency Status][depstat-image]][depstat-url]

> Plugin for [gulp](https://github.com/wearefractal/gulp) to replace RequireJS includes with direct `<script>` tags for AlmondJS builds, like the [replaceRequireScript](https://github.com/asciidisco/grunt-requirejs/blob/master/docs/almondIntegration.md) functionality from [grunt-requirejs](https://github.com/asciidisco/grunt-requirejs).

## Usage

First, install `gulp-requirejs-replace-script` as a development dependency:

```shell
npm install --save-dev gulp-requirejs-replace-script
```

Then, add it to your `gulpfile.js`:

```javascript
var rjsReplace = require("gulp-requirejs-replace-script");

gulp.src("./client/src/index.html")
	.pipe(rjsReplace([
		'js/main'
	]))
	.pipe(gulp.dest("./client/dist"));
```

## API

### requirejs-replace-script(modules)

#### modules
Type: `Array`  

An array of module names which should be included directly rather than via RequireJS's `data-main` attribute.

If not provided, all Require tags will be replaced.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-requirejs-replace-script
[npm-image]: https://badge.fury.io/js/gulp-requirejs-replace-script.png

[depstat-url]: https://david-dm.org/jfmatt/gulp-requirejs-replace-script
[depstat-image]: https://david-dm.org/jfmatt/gulp-requirejs-replace-script.png
