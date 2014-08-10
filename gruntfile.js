module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-iconizr');
    grunt.loadNpmTasks('assemble');

    // Project configuration.
    grunt.initConfig({
        /*
            Iconizr
            -- compile icon files from svgs
        */

        iconizr: {
            options: {
                prefix: 'icon',
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
                partials: ['source/templates/partials/**/*.hbs'],
                layout: 'main.hbs',
                data: ['source/data/**/*.json']
            },
            site: {
                expand: true,
                cwd: 'source/pages',
                src: ['**/*.hbs'],
                dest: 'dist/'
            }
        }
    });
};