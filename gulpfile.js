const
gulp = require('gulp'),
minify = require('gulp-minify'),
uglify = require('gulp-uglify'),
stripDebug = require('gulp-strip-debug')
;

gulp.task('build', function(){
  return gulp.src([
    'src/jsonsquasher.js',
  ])
  .pipe(stripDebug())
  .pipe(uglify())
  .pipe(gulp.dest('build'));
});

gulp.task('default', [ 'build' ]);
