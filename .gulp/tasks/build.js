var gulp = require('gulp');
var runSequence = require('run-sequence');
var util = require('gulp-util');
var notifier = require('node-notifier');
var path = require('path');
var notifier = require('../notifier');

var mkdirp = require('mkdirp')

gulp.task('make-directories', function(callback) {
  mkdirp('dist/public/scripts');
  callback();
})

gulp.task('build', function(callback) {
  runSequence('clean', 'make-directories', ['bundle', 'copy'], function() {
    notifier.notify('Build is completed! ');
    callback();
  });
});
