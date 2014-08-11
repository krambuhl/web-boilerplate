//gulp
var gulp = require('gulp');
require('gulp-grunt')(gulp);

// npm tools
var pkg = require('./package.json');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

// gulp general plugins
var sequence = require('run-sequence');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

// build / dist
var clean = require('gulp-clean');
var fileinclude = require('gulp-file-include');

// js tasks
var bowerFiles  = require('bower-files')();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// image/svg tasks
var imagemin = require('gulp-imagemin');

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

var env = {
  production: false
};


// Task `empty`
// empties the dist folder before each startup
// > input `dist` folder
//  - clean
gulp.task('empty', function () {
  return gulp.src(dir.dist, {read: false})
    .pipe(clean());
});

// Task `define-env`
// creates `env.json` including cli options
// > input CLI_ARGUMENTS
//  ==> `env.json` 
gulp.task('define-env', function(done) {
  var environment = _.extend({}, env, {
    production: process.env.npm_config_production
  });

  fs.writeFile(path.join(dir.src,'data/env.json'), JSON.stringify(environment), function(err) {
    if (err) throw err;
    done();
  });
});

// Task `styles`
// compiles stylesheet and optimises file
// > input `sass/style.scss`
//  - sass
//  - autoprefixer
//  - media query combiner
//  ==> output `style.css`
//  ==> output `style.css.map`
//  - css minifier
//  ==> output `style.min.css
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


// Task `app`
// compiles app script and optimises file
// > input `app/app.js`
//  - fileinclude
//  ==> output `app.js` w/ sourcemaps
//  - uglify
//  ==> output `app.min.js
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


// Task `lib`
// combines bower scripts and optimises file
// > input bowerFiles.js
//  - concat
//  ==> output `lib.js`
//  - uglify
//  ==> output `lib.min.js
gulp.task('lib', function() {
  return gulp.src(bowerFiles.js)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(dir.scripts))
    .pipe(uglify())
    .pipe(rename('lib.min.js'))
    .pipe(gulp.dest(dir.scripts));
});


// Task `pull-data`
// pull any external data needed before
// assembling html pages
gulp.task('pull-data', function() {
  return;
});


// Task `post-iconizr`
// creates a includable partial from the
// iconizr fragment before assembling html pages
// > input `sprite-loader-fragment.html`
//  - replace (fix loader pathing)
//  ==> output `partials/iconizr-fragment.hbs`
gulp.task('post-iconizr', function() {
 return gulp.src(path.join(dir.assets, 'svg/sprite-loader-fragment.html'))
  .pipe(replace(/\/dist/ig, ''))
  .pipe(rename('iconizr-fragment.hbs'))
  .pipe(gulp.dest(path.join(dir.src, 'templates/partials')));
});


// Task `copy-images`
// minimizes and copies images
// > input `images` folder (jpg/png/gif)
//  - imagemin
//  - pngcrush
//  ==> output to `dist/assets`
gulp.task('copy-images', function() {
  return gulp.src(path.join(dir.src, 'images/**/*.{jpg,jpeg,png,gif}'))
    .pipe(imagemin({ 
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(path.join(dir.assets, 'images')));
});


// Task `copy-fonts`
// copies fonts folder to dist
// > input `fonts` folder
//  ==> output to `dist/assets`
gulp.task('copy-fonts', function() {
  return gulp.src(path.join(dir.src, 'fonts/**/*'))
    .pipe(gulp.dest(path.join(dir.assets, 'fonts')));
});


// Task `watch`
// run various tasks on file changes
gulp.task('watch', function () {
  // run `styles` task on css file changes in `./
  gulp.watch(path.join(dir.src, 'sass/**/*.{css,sass,scss}'), ['styles']);

  // run `app` task on js file changes in './source/app'
  gulp.watch(path.join(dir.src, 'app/**/*.js'), ['app']);

  // run `icons` task on svg file changes in './source/svg'
  gulp.watch(path.join(dir.src, 'svg/**/*.svg'), ['icons']);

  // run `app` task on js file changes in './source/app'
  gulp.watch(path.join(dir.src, '**/*.{json,html,hbs,handlebars}'), ['grunt-assemble']);

  // ping livereload sever when dist folder files change
  gulp.watch(path.join(dir.dist, '**/*')).on('change', livereload.changed);
  livereload.listen();
});

// Task `zip`
gulp.task('zip', function() { 
  var name = process.env.npm_config_name;
  if (!name) {
    name = pkg.name + '-' + pkg.version;
  }

  return;
});


gulp.task('archive', function(done) {
  var orgenv = env;
  env.production = true;

  sequence(
    'compile',
    'zip',
    function() {
      env = orgenv;
      return;
    },
    done
  );
});


// Task `compile`
// runs blocks of build tasks in specific order 
gulp.task('compile', function(done) {
  sequence(
    ['empty', 'sync', 'define-env'],
    ['styles','scripts','icons','copy'],
    'pages',
    done
  );
});

// Task `pages`
// gets any ext. data, then assembles pages
gulp.task('pages', function(done) {
  sequence('pull-data', 'grunt-assemble', done);
});

// Task `icons`
// compile svgs, then prepare fragment
gulp.task('icons', function(done) {
  sequence('grunt-iconizr', 'post-iconizr', done);
});

gulp.task('sync', ['grunt-update_json']);
gulp.task('scripts', ['lib', 'app']);
gulp.task('copy', ['copy-images', 'copy-fonts']);

gulp.task('develop', ['compile', 'watch']);
gulp.task('default', ['develop']);
