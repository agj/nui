
var gulp           = require('gulp');
var gutil          = require('gulp-util');
var rjs            = require('requirejs');
var replace        = require('gulp-replace');
var clean          = require('gulp-clean');
var rename         = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');


var path = {
	src:   'src/',
	build: 'build/',
	bower: 'src/bower_components/',
};


/////

gulp.task('default', ['clean'], function () {
	return gulp.start('build');
});

gulp.task('bower', function () {
	return gulp.src(mainBowerFiles())
		.pipe(gulp.dest(path.src + 'js/lib'));
});


/////

gulp.task('build', ['copyHTML', 'copyFiles', 'parseAMD']);

gulp.task('clean', function () {
	return gulp.src([path.build + '**/*'], { read: false })
		.pipe(clean());
});

gulp.task('copyHTML', function () {
	return gulp.src(path.src + '*.html')
		.pipe(replace(/data-main="([^"]*)app" src="[^"]*require\.js"/g, 'src="$1script.js"'))
		.pipe(gulp.dest(path.build));
});

gulp.task('copyFiles', function () {
	return gulp.src(['src/+(images|css)/**/*'], { base: 'src/' })
		.pipe(gulp.dest(path.build));
});

gulp.task('parseAMD', function (callback) {
	gutil.log(
		rjs.optimize(
			{
				mainConfigFile: path.src + 'js/app.js',
				baseUrl: path.src + 'js/lib/',
				include: '../app',
				name: '../../../node_modules/almond/almond',
				out: path.build + 'js/script.js',
				wrap: true,
				optimize: 'uglify2',
			},
			function (buildResponse) {
				callback();
			},
			callback
		)
	);
});

