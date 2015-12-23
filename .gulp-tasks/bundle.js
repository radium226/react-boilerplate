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

// Include common stuff
var common = require('./common.js');

//var mkdirp = require('mkdirp');

// Build client.js file
gulp.task('bundle:client.js', function() {
  //mkdirp('dist/public/scripts'); // TODO: Remove that!

  var stream = through();
	stream
		.pipe(source('client.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/public/scripts/'));

  // Find every JavaScript and TypeScript sources
	var entries = globby(['src/**/*.js', '!src/server.js', '!src/render.js']);

  // create the Browserify instance.
  var bundler = common.createBundler({
    entries: entries,
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }, false);

  // Exclude every client vendor depdendencies
	common.listClientDependencies().forEach(function(dependency) {
    bundler.external(dependency);
  });

  // Bundler everything
	bundler.bundle()
    .pipe(exorcist('dist/public/scripts/client.js.map'))
    .pipe(stream);

	return stream;
});

// Build vendor.js file
gulp.task('bundle:vendor.js', function() {
  var bundler = browserify({

  });

  // Inlude all client vendor dependencies
  common.listClientDependencies().forEach(function(dependency) {
    var filePath = resolve(dependency);
      bundler.require(filePath, {
        expose: dependency
      });
  });

  // Bundle everything
  var stream = bundler
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('dist/public/scripts/'));

  return stream;
});

// Bundle the server.js file
gulp.task('bundle:server.js', function() {
  var stream = through();
  stream
    .pipe(source('server.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist/'));

  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: globby(['src/**/*.js', '!src/client.js', '!src/render.js'])
  })
    //.plugin(tsify, { target: "es6" }) TODO: Make TypeScript works
    .transform(babelify.configure());

  common.listServerDependencies().forEach(function(dependency) {
    bundler.external(dependency);
  });

  bundler.bundle()
    .pipe(stream);

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

gulp.task('bundle', ['bundle:server.js', 'bundle:client.js', 'bundle:vendor.js']);
