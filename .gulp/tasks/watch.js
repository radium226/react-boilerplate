
var gulp = require('gulp');
var util = require('gulp-util');
var globby = require('globby').sync;

var browserSync = require("browser-sync").create();
var nodemon = require('gulp-nodemon');

var createBundler = require('../bundler.js').createBundler;

gulp.task('watch:client', function(callback) {
  var sources = globby(['src/**/*.js', '!src/server.js', '!src/render.js', '!src/server/**/*']);
	var bundler = createBundler({
    monitorChanges: true,
    browserSync: browserSync,
		// client.js
		sources: sources,
		target: 'dist/public/scripts/client.js',
		sourceMaps: true,
		// vendor.js
		vendor: true,
		vendorTarget: 'dist/public/scripts/vendor.js'
	});

  counter = { count: 0 };
  bundler
    .bundle(function() {
      if (counter.count == 0) {
        callback();
      } else {
        util.log('Reload', util.colors.grey('#' + counter.count + ''));
      }
      counter.count++;

      reload();
    });
});

gulp.task('watch:server', function(callback) {
  var sources = globby(['src/**/*.js', '!src/client.js', '!src/render.js']);
  var bundler = createBundler({
    monitorChanges: true,
    sources: sources,
    target: 'dist/server.js',
    vendor: false,
    external: true
  });

  var counter = { count: 0 };

  bundler
    .bundle(function() {
      if (counter.count == 0) {
        callback();
      } else {
        util.log('Reload', util.colors.grey('#' + counter.count + ''));
      }
      counter.count++;
    });
})

var pendingReload = null;
function reload() {
  if (pendingReload) {
    util.log('Reload already pending for', util.colors.grey('BrowserSync'));
    clearTimeout(pendingReload);
  }

  pendingReload = setTimeout(function() {
    util.log('Reloading using', util.colors.grey('BrowserSync'));
    browserSync.reload({
      stream: false
    });
  }, 2500);
}

gulp.task('watch', ['watch:client', 'watch:server'], function(callback) {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4000,
  });

  nodemon({
    script: 'dist/server.js',
    watch: ['dist/server.js']
  })
    .on('start', reload);
});
