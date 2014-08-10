Web Boilerplate
======

Frontend boilerplate for web base projects.  Provides a set of tools for building static websites using assemble, iconizr, gulp/grunt.

Tasks
------
- ```npm run bower``` -- alias for bower install __required before compile__
- ```npm run compile``` -- compile source files to dist folder
- ```npm run develop``` -- run compile, then watch file changes
- ```npm start``` -- start static node server, compatible with heroku


Recommendations
------

Add a few aliases to your ```.bash_profile``` to ease typing common commands.

- ```alias nrun="npm run"```
- ```alias npm-sd="npm install --save-dev"```


Explainations
----

####Grunt & Gulp are Better Together

Gulp & Grunt are both great at some things, but both fall flat in other ways.  Grunt has a great community of tools that are well fleshed out and great, but the speed of the basic I/O system in grunt is terible. In complex build systems this underlying lag becomes very noticeable, that's where gulp comes in.  Gulp is very good at batching processes, it runs in parallel by default which tends to be very fast, but the ideology of gulp makes certain tasks treacherous.

`npm run` is used over gulp/grunt commands so that as technology changes the tools api is maintained.  gulp is used as the basic task runner, but cetain -- usually more complex -- tasks are delegated to grunt using [gulp-grunt](https://www.npmjs.org/package/gulp-grunt).

