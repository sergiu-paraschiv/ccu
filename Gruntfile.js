module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            beforeBuild: {
                src: ['build']
            },

            afterBuild: {
                src: ['.tmp', 'build/scripts/templates.js']
            }
        },

        ngtemplates: {
            Crosscut: {
                cwd: 'app',
                src: 'views/**/*.html',
                dest: '.tmp/concat/scripts/templates.js'
            }
        },

        concat: {
            addTemplates: {
                src: ['.tmp/concat/scripts/app.js', '.tmp/concat/scripts/templates.js'],
                dest: '.tmp/concat/scripts/app.js'
            }
        },
        
        copy: {
            beforeBuild: {
                files: [                    
                    { expand: true, flatten: true, src: ['app/index.html'], dest: 'build/'}
                ]
            },

            afterBuild: {
                files: [
                    { expand: true, flatten: true, src: ['app/images/*'], dest: 'build/images/' },
                    { expand: true, flatten: true, src: ['app/images/dynamic/*'], dest: 'build/images/dynamic/' },
                    { expand: true, flatten: true, src: ['.tmp/concat/scripts/*'], dest: 'build/scripts/' }
                ]
            }
        },

        jshint: {
            all: ['app/scripts/**/*.js']
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
                assetsDirs: ['scripts', 'styles', '.tmp'],
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
            },
            html: {
                files: ['app/index.html', 'app/views/*.html', 'app/views/**/*.html'],
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('default', [
        'jshint'
    ]);
    
    grunt.registerTask('build', [
        'clean:beforeBuild',
        'copy:beforeBuild',
        'useminPrepare',
        'concat:generated',
        'cssmin',
        'usemin',
        'ngtemplates',
        'concat:addTemplates',
        'copy:afterBuild',
        'clean:afterBuild'
    ]);
    
    grunt.registerTask('server', [
        'connect',
        'open',
        'watch'
    ]);

};