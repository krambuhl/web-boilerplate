// npm package
var pkg = require('./package.json');

//gulp
var gulp = require('gulp');
require('gulp-grunt')(gulp);

// npm tools
var path  = require('path');


// gulp general plugins
var sequence = require('run-sequence');
var rename = require('gulp-rename');
// var concatMaps = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
// var handlebars = require('gulp-compile-handlebars');

var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');


// css tasks
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var minify = require('gulp-clean-css');

// project directories
var dir = {
  src: 'source',
  dist: 'dist',
  assets: 'dist/assets',
  tests: 'tests'
};

// __styles__ task:
// - sass
// - autoprefixer
// - media query combiner
// - css minifier
gulp.task('styles', function() {
  return gulp.src(path.join(dir.src, 'sass/style.scss'))
    .pipe(sass({ style: 'expanded', errLogToConsole: true })) //sourceComments: 'map',
    .pipe(cmq())
    .pipe(autoprefix({ cascade: true }))
    .pipe(gulp.dest(path.join(dir.assets, 'styles')))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(path.join(dir.assets, 'styles')));
});


gulp.task('app', function() { return; });
gulp.task('lib', function() { return; });


gulp.task('pull-data', function() {
  return;
});


// __build__ task:
// compiles static templates with enviornment data
//
// - static handlebars
//   + output: various files to './dist/'
gulp.task('build-pages', function() {
  return;
});


gulp.task('copy-images', function() {
  return gulp.src(path.join(dir.src, 'images/**/*.{jpg,jpeg,png,gif}'))
    .pipe(imagemin({ use: [pngcrush()] }))
    .pipe(gulp.dest(path.join(dir.assets, 'images')));
});

gulp.task('copy-fonts', function() {
  return gulp.src(path.join(dir.src, 'fonts/**/*'))
    .pipe(gulp.dest(path.join(dir.assets, 'fonts')));
});


// __watch__ task:
gulp.task('watch', function () {
  // run `styles` task on css file changes
  gulp.watch(path.join(dir.src, 'css/**/*.{css,sass,scss}'), ['styles']);

  // run `app` task on js file changes in './source/app'
  gulp.watch(path.join(dir.src, 'app/**/*.js'), ['app']);

  // run `icons` task on svg file changes in './source/svg'
  gulp.watch(path.join(dir.src, 'svg/**/*.svg'), ['icons']);

  // run `app` task on js file changes in './source/app'
  gulp.watch(path.join(dir.src, '**/*.{json,hbs,handlebars}'), ['grunt-assemble']);
});


gulp.task('empty', function () {
  return gulp.src(dir.dist, {read: false})
    .pipe(clean());
});

// gulp.task('bump', function () {
//   return gulp.src(['./package.json', './bower.json'])
//     .pipe(bump())
//     .pipe(gulp.dest('./'));
// });


gulp.task('scripts', ['lib', 'app']);
gulp.task('icons', ['grunt-iconizr']);
gulp.task('copy', ['copy-images', 'copy-fonts']);
gulp.task('pages', function(done) {
  seqence(['grunt-assemble'], done);
});

gulp.task('compile', function(done) {
  sequence(
    'empty',
    ['styles', 'scripts', 'icons', 'copy', 'pages'],
    done
  );
});

gulp.task('develop', ['compile', 'watch']);

gulp.task('default', ['develop']);
