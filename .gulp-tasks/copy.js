var gulp = require('gulp');

gulp.task('copy', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist/public/'));
});
