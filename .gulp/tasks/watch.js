var gulp = require('gulp');
var util = require('gulp-util');

var through = require('through2');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby').sync;
var notify = require("gulp-notify");

var browserSync = require("browser-sync").create()

var common = require('../common.js');
var path = require('path');

var nodemon = require('gulp-nodemon');

var BROWSER_SYNC_RELOAD_DELAY = 500;

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  browserSync.notify("Compile Error!");
  this.emit('end'); // Keep gulp from hanging on this task
}

// Watch for change on client.js file
gulp.task('watch:client.js', function() {

  // Find every JavaScript and TypeScript sources
	var entries = globby(['src/**/*.js', '!src/server.js', '!src/server/**/*.js', '!src/render.js']);

  // create the Browserify instance.
  var bundler = common.createBundler({
    entries: entries,
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }, true);

  // Exclude every client vendor depdendencies
	common.listClientDependencies().forEach(function(dependency) {
    bundler.external(dependency);
  });

  function bundle() {
    return bundler.bundle()
      .on('error', handleErrors)
      .pipe(source('client.js'))
      .pipe(buffer())
      .pipe(gulp.dest('dist/public/scripts/'))
      .pipe(browserSync.stream({ once: true }))
      .pipe(notify({
        title: 'Gulp',
        message: 'Bundle updated',
        icon: path.join(__dirname, 'analyevent.png')
      }));
  }

  // Watch for change
  bundler
    .on('update', function() {
      util.log("Bundle2! ");
      bundle()
    });

  // Bundler everything
	return bundle();
});

gulp.task('watch', ['watch:client.js', 'watch:server.js'], function() {

  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4000,
  });

  return nodemon({
    script: 'dist/server.js',
    watch: ['dist/server.js']
  })
    .on('restart', function() {
      setTimeout(function() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
})

// Watch for change on server.js file
gulp.task('watch:server.js', function() {

  // Find every JavaScript and TypeScript sources
	var entries = globby(['src/**/*.js', '!src/client.js', '!src/render.js']);

  // create the Browserify instance.
  var bundler = common.createBundler({
    entries: entries,
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }, true);

  // Exclude every client vendor depdendencies
	common.listServerDependencies().forEach(function(dependency) {
    bundler.external(dependency);
  });

  function bundle() {
    return bundler.bundle()
      .on('error', handleErrors)
      .pipe(source('server.js'))
      .pipe(buffer())
      .pipe(gulp.dest('dist/'))
      .pipe(notify({
        title: 'Gulp',
        message: 'Server updated',
        icon: path.join(__dirname, 'analyevent.png')
      }));
  }

  // Watch for change
  bundler
    .on('update', function() {
      bundle()
    });

  // Bundler everything
	bundle();

});
