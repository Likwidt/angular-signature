"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var jslint = require('gulp-jslint');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var angularFilesort = require('gulp-angular-filesort');
var Karma = require('karma').Server;
var sources = {
	js: ['js/*.js', 'js/**/*.js'],
	css: ['css/*.css'],
  bower: ['bower_components/**/*'],
  img: ['img/*.*', 'img/**/*.*'],
  partials: ['partials/*.*', 'partials/**/*.*'],
	sass: ['sass/*.scss'],
	html: ['index.html', 'partials/*.html']
}
 
gulp.task('connect', function() {
  return connect.server({
    fallback: 'index.html',
    port: 4567,
    livereload: true
  });
});
 
gulp.task('html', function () {
  return gulp 
          .src('index.html')
          .pipe(connect.reload());
});

gulp.task('open', function () {
    return gulp 
            .src('index.html')
            .pipe(open({
                uri: 'http://localhost:4567/index.html',
                app: 'chrome' 
            }));
});

gulp.task('watch', function () {
  gulp.watch(sources.html.concat(sources.js), ['html']);
});
 
gulp.task('default', function(done) {
  runSequence('connect', 'open', 'watch', done)
});

 

 

