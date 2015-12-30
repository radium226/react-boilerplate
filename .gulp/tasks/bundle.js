// TODO: Add Watchify + Format task + browserSync
//var tsify = require('tsify'); TODO: Make TypeScript works

// Common dependencies
var gulp = require('gulp');
var util = require('gulp-util');
var _ = require('lodash');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');
var through = require('through2');
var globby = require('globby').sync;
var runSequence = require('run-sequence');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');

// Browserify related dependencies
var resolve = require('resolve').sync;
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');
var exorcist = require('exorcist');
var pathmodify  = require('pathmodify');
var minimatch = require('minimatch')
var Promise = require('bluebird');

// Include common stuff
var common = require('../common.js');

//var mkdirp = require('mkdirp');

// Build client.js file
gulp.task('bundle:client', function(callback) {
  // Find every JavaScript and TypeScript sources
	var sourceEntries = globby(['src/**/*.js', '!src/server.js', '!src/render.js']);

	var vendorBundler = browserify({ });
	var clientBundler =  common.createBundler({
		entries: sourceEntries,
		cache: {},
		packageCache: {},
		fullPaths: true,
		debug: true
	}, false)
		.plugin(pathmodify)
		.on('pathmodify:resolved', function(data) {
		//console.log(data);
			var dependency = data.rec.id;
			var filePath = data.file;
			if (minimatch(filePath, '**/node_modules/**')) {
				clientBundler.external(filePath);
				clientBundler.external(dependency); // Watchify breaks without this.
				if (!filePath.startsWith('/node_modules/')) {
					vendorBundler.require(filePath, { expose: dependency });
				}
			}
		});

	function bundleClient() {
		util.log('Bundleing', util.colors.yellow('client.js'));
		var clientDeferred = Promise.pending();
		var clientStream = clientBundler
			.bundle()
			.pipe(exorcist('dist/public/scripts/client.js.map'))
			.pipe(source('client.js'))
			.pipe(buffer())
			.pipe(gulp.dest('dist/public/scripts'))
			.on('end', function() {
				clientDeferred.resolve();
			});
		var clientPromise = clientDeferred.promise;
		return clientPromise;
	}

	function bundleVendor() {
		util.log('Bundleing', util.colors.yellow('vendor.js'));
		var vendorDeferred = Promise.pending();
		var vendorStream = vendorBundler
			.bundle()
			.pipe(source('vendor.js'))
			.pipe(buffer())
			.pipe(gulp.dest('dist/public/scripts'))
			.on('end', function() {
				vendorDeferred.resolve();
			});
		var vendorPromise = vendorDeferred.promise;
		return vendorPromise;
	}

	bundleClient()
		.then(bundleVendor)
		.then(callback);
});

// Bundle the server.js file
gulp.task('bundle:server', function() {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: globby(['src/**/*.js', '!src/client.js', '!src/render.js'])
  })
    //.plugin(tsify, { target: "es6" }) TODO: Make TypeScript works
    .transform(babelify.configure())
		.plugin(pathmodify)
		.on('pathmodify:resolved', function(data) {
		//console.log(data);
			var dependency = data.rec.id;
			var filePath = data.file;
			if (minimatch(filePath, '**/node_modules/**')) {
				bundler.external(filePath);
				bundler.external(dependency); // Watchify breaks without this.
			}
		});

  var stream = bundler
		.bundle()
    .pipe(source('server.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist/'));

  return stream;
})

gulp.task('bundle:render.js', function() {
  var stream = through();
  stream
    .pipe(source('render.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist/'));

  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: globby(['src/**/*.js', '!src/client.js', '!src/server.js', '!src/server/**/*.js'])
  })
    .transform(babelify.configure());

  common.listServerDependencies().forEach(function(dependency) {
    bundler.external(dependency);
  });

  bundler.bundle()
    .pipe(stream);

  return stream;
});

gulp.task('bundle', ['bundle:server', 'bundle:client']);
