module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                src: ['.tmp', 'build']
            }
        },
        
        copy: {
            build: {
                files: [
                    { expand: true, flatten: true, src: ['app/images/*'], dest: 'build/images/'},
                    { expand: true, flatten: true, src: ['app/index.html'], dest: 'build/'}
                ]
            }
        },

        jshint: {
            all: ['app/scripts/**/*.js']
        },
        
        csslint: {
            all: ['app/styles/**/*.css']
        },
        
        useminPrepare: {
            html: 'app/index.html',
            options: {
                root: 'app',
                dest: 'build'
            }
        },
  
        usemin: {
            html: 'build/index.html',
            options: {
                assetsDirs: ['scripts', 'styles'],
                dest: 'build'
            }
        },
        
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['app/scripts/**/*.js'],
            },
            css: {
                files: ['app/styles/**/*.css'],
            }
        },
        
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'app'
                }
            }
        },
        
        open: {
            server: {
                path: 'http://localhost:9001/',
                app: 'Chrome'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask('default', [
        'jshint',
        'csslint'
    ]);
    
    grunt.registerTask('build', [
        'clean',
        'copy',
        'useminPrepare',
        'usemin',
        'concat',
        'uglify',
        'cssmin'
    ]);
    
    grunt.registerTask('server', [
        'connect',
        'open',
        'watch'
    ]);

};