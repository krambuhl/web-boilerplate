module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-iconizr');
    grunt.loadNpmTasks('assemble');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /*
            Iconizr
            -- compile icon files from svgs
        */

        iconizr: {
            options: {
                spritedir: 'output',
                prefix: 'icon',
                verbose: 1
            },
            generate: {
                src: 'source/svg',
                dest: 'dist/assets/svg',
            }
        },

        assemble: {
            options: {
                assets: 'assets',
                layoutdir: 'source/templates/layouts',
                partials: ['source/templates/partials/**/*.{hbs,handlebars,html}'],
                layout: 'main.hbs',
                data: ['source/data/**/*.json'],
                pkg: '<%= pkg %>',
                iconizr: 'dist/svg/iconizr-fragment.html'
            },

            pages: {
                expand: true,
                cwd: 'source/templates/pages',
                src: ['**/*.hbs'],
                dest: 'dist/'
            }
        },

        update_json: {
            sync: {
                src: 'package.json',
                dest: 'bower.json',
                fields: [
                    'name',
                    'author',
                    'version',
                    'repository'
                ]
            }
        }
    });
};