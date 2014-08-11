Web Boilerplate
======

Frontend boilerplate for web base projects.  Provides a set of tools for building static websites using assemble, iconizr, gulp/grunt.


Tasks
------

- ```npm run vendor``` -- installs vendor files __required before compile__
- ```npm run compile``` -- compile source files to dist folder
- ```npm run develop``` -- run compile, then watch for file changes
- ```npm run archive [--archive name]```  -- create archives of dist folder
- ```npm run test``` -- runs testsuite
- ```npm run start``` -- start static node server, compatible with heroku


Recommendations
------

####Aliases

Add a few aliases to your ```.bash_profile``` to ease typing common commands.

- ```alias nrun="npm run"```
- ```alias npm-sd="npm install --save-dev"```

####Livereload

Livereload is supported by default, but will require a browser plugin to work properly. 
- [Chrome Extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- [Mozilla Addon](https://addons.mozilla.org/en-US/firefox/addon/livereload)
- [Safari Extension](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)


Explainations
----

####Grunt & Gulp are Better Together

Gulp & Grunt are both great at some things, but both fall flat in other ways.  Grunt has a great community of tools that are well fleshed out and great, but the slow speed of the basic I/O system in grunt compounds in larger application.  That is where gulp comes in.  Gulp is very good at batching processes, it runs in parallel by default which tends to be very fast, but the ideology of gulp makes certain tasks treacherous.

Gulp is used as the basic task runner, but cetain -- usually more complex -- tasks are delegated to grunt using [gulp-grunt](https://www.npmjs.org/package/gulp-grunt).  `npm run` is used over gulp/grunt commands so that as technology changes the tools api is maintained.  This also removes the requirement to install the gulp & grunt commands globally, which can be clunky on remote environments.