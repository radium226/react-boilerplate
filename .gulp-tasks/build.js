var gulp = require('gulp');
var runSequence = require('run-sequence');
var util = require('gulp-util');
var notifier = require('node-notifier');
var path = require('path');
var common = require('./common');

gulp.task('build', function(callback) {
  runSequence('clean', ['bundle', 'copy'], function() {
    common.notify('Build is completed! ');
    callback();
  });
});
