module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-iconizr');

    // Project configuration.
    grunt.initConfig({
        /*
            Iconizr
            -- compile icon files from svgs
        */

        iconizr: {
            options: {
                prefix: 'icon',
                verbose: 1
            },
            generate: {
                src: 'source/svg',
                dest: 'dist/assets/svg',
            }
        }
    });


    // icons
    grunt.registerTask('default', ['iconizr']);

};
