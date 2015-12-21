var gulp = require('gulp');
var util = require('gulp-util');
var globby = require('globby').sync;
var eslint = require('gulp-eslint');

var path = require('path');

var callback = require('gulp-callback')

var common = require('./common');

var baseDir = './src'

gulp.task('format', function() {
  util.log('Formatting task');
  return gulp.src(globby([path.join(baseDir, '/**/*.js')]), { base: baseDir })
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(gulp.dest(baseDir))
    .pipe(eslint.failAfterError())
    .on('error', function() {
      common.notify('There is formatting errors');
    })
});
