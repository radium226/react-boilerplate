var gulp = require('gulp');

var globby = require('globby').sync;
var util = require('gulp-util');
var path = require('path');

gulp.task('copy', ['copy:images']);

gulp.task('copy:images', function() {
  var imagePaths = globby('src/images/**/*.{png,jpg}');
  imagePaths.forEach(function(imagePath) {
    var imageName = path.basename(imagePath);
    util.log('Copying', util.colors.yellow(imageName));
  });

  return gulp.src(imagePaths, {
    base: 'src/images'
  })
    .pipe(gulp.dest('dist/public/images'));
});
