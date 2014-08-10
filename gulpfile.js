//gulp
var gulp = require('gulp');
require('gulp-grunt')(gulp);

// npm tools
var path  = require('path');

// gulp general plugins
var sequence = require('run-sequence');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var fileinclude = require('gulp-file-include');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

// js tasks
var bowerFiles  = require('bower-files')();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// image/svg tasks

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
  styles: 'dist/assets/styles',
  scripts: 'dist/assets/scripts',
  tests: 'tests'
};


gulp.task('empty', function () {
  return gulp.src(dir.dist, {read: false})
    .pipe(clean());
});

// __styles__ task:
// - sass
// - autoprefixer
// - media query combiner
// - css minifier
gulp.task('styles', function() {
  return gulp.src(path.join(dir.src, 'sass/style.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'nested' }))
    .pipe(cmq())
    .pipe(autoprefix())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.styles))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(dir.styles));
});


gulp.task('app', function() {
  return gulp.src(path.join(dir.src, 'app/app.js'))
    .pipe(sourcemaps.init())
    .pipe(fileinclude('//=')) //=include('url.js')
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir.scripts))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(dir.scripts));
});

gulp.task('lib', function() {
  return gulp.src(bowerFiles.js)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(dir.scripts))
    .pipe(uglify())
    .pipe(rename('lib.min.js'))
    .pipe(gulp.dest(dir.scripts));
});


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

gulp.task('post-iconizr', function() {
 return gulp.src(path.join(dir.assets, 'svg/sprite-loader-fragment.html'))
  .pipe(replace(/\/dist/ig, ''))
  .pipe(rename('iconizr-fragment.hbs'))
  .pipe(gulp.dest(path.join(dir.src, 'templates/partials')));
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
  gulp.watch(path.join(dir.src, '**/*.{json,html,hbs,handlebars}'), ['grunt-assemble']);

  livereload.listen();
  gulp.watch('dist/**/*').on('change', livereload.changed);
});

gulp.task('compile', function(done) {
  sequence(
    'empty',
    [
      'sync',
      'styles',
      'scripts',
      'icons',
      'copy',
    ],
    'pages',
    done
  );
});


gulp.task('sync', ['grunt-update_json']);
gulp.task('scripts', ['lib', 'app']);
gulp.task('copy', ['copy-images', 'copy-fonts']);
gulp.task('icons', function(done) {
  sequence('grunt-iconizr', 'post-iconizr', done);
});

gulp.task('pages', function(done) {
  sequence('grunt-assemble', done);
});


gulp.task('develop', ['compile', 'watch']);
gulp.task('default', ['develop']);
