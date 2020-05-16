'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      pug = require('gulp-pug'),
      debug = require('gulp-debug'),
      del = require('del'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync = require('browser-sync').create();

gulp.task('pug', function () {
  return gulp.src('src/templates/*.pug')
      .pipe(pug())
      .pipe(debug({title: 'working on'}))
      .pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(debug({title: 'working on'}))
      .pipe(gulp.dest('build/css'))
});

gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
      .pipe(debug({title: 'working on'}))
      .pipe(gulp.dest('build/js/'))
});

// gulp.task('images', function () {
//   return gulp.src('src/images/**/*.*', {since: gulp.lastRun('images')})
//       .pipe(debug({title: 'working on'}))
//       .pipe(gulp.dest('build/images'))
// });

// gulp.task('assets', function () {
//   return gulp.src('src/assets/**/**.*')
//       .pipe(gulp.dest('build/assets'))
// });

// gulp.task('fonts', function () {
//   return gulp.src('src/fonts/**/**.*')
//       .pipe(gulp.dest('build/fonts'))
// });

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
    notify: true
  })
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.*', gulp.series('sass'));
  gulp.watch('src/templates/**/*.*', gulp.series('pug'));
  gulp.watch('src/js/**/*.*', gulp.series('js'));

  gulp.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', gulp.parallel('pug', 'sass', 'js')));
// , 'images', 'assets', 'fonts'

gulp.task('serve', gulp.parallel('watch', 'browser-sync'));

gulp.task('dev', gulp.series('build', 'serve'));