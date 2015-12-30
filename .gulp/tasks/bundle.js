var gulp = require('gulp');
var globby = require('globby').sync;
var runSequence = require('run-sequence');

var createBundler = require('../bundler.js').createBundler;

// Build client.js & vendor.js files
gulp.task('bundle:client', function(callback) {
  // Find every JavaScript and TypeScript sources
	var sources = globby(['src/**/*.js', '!src/server.js', '!src/render.js', '!src/server/**/*']);
	var bundler = createBundler({
		// client.js
		sources: sources,
		target: 'dist/public/scripts/client.js',
		sourceMaps: true,
		// vendor.js
		vendor: true,
		vendorTarget: 'dist/public/scripts/vendor.js'
	});

	bundler.bundle(callback);
});

// Bundle server.js file
gulp.task('bundle:server', function(callback) {
	var sources = globby(['src/**/*.js', '!src/client.js', '!src/render.js']);
	var bundler = createBundler({
		sources: sources,
		target: 'dist/server.js',
		vendor: false,
		external: true
	});

	bundler.bundle(callback);
})

gulp.task('bundle', ['bundle:server', 'bundle:client']);
