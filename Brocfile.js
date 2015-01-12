var mergeTrees = require('broccoli-merge-trees');
var makeModules = require('broccoli-es6-module-filter');
var browserify = require('broccoli-browserify');
var pickFiles = require('broccoli-static-compiler');
var compileSass = require('broccoli-sass');
var autoprefixer = require('broccoli-autoprefixer');
var uglifyJavaScript = require('broccoli-uglify-js');
var es6transpiler = require('broccoli-es6-transpiler');
var imagemin = require('broccoli-imagemin');

/*
  Images
*/

var images = pickFiles('web-source', {
  srcDir: 'images',
  destDir: 'assets/images'
});

var minImg = imagemin(images);

/*
  Javascript
*/

var modules = makeModules('web-source/scripts', {
  moduleType: 'cjs'
});

var es5ified = es6transpiler(modules);

var scripts = browserify(es5ified, {
  entries: ['./main.js'],
  outputFile: 'assets/bundle.js'
});

var uglyBundle = uglifyJavaScript(scripts, {
  mangle: true
});

/*
  CSS
*/

var sass = compileSass(['web-source/sass'], 'style.scss', 'assets/style.css');
var autopref = autoprefixer(sass, {
  sourcemap: true,
  browsers: ['> 1%', 'last 2 versions', 'Chrome 5', 'Firefox 6']
});


module.exports = mergeTrees([uglyBundle, autopref, minImg]);