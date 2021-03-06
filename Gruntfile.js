/*global module:true*/
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var yeomanConfig = {
  app: 'app',
  dist: 'dist'
};


module.exports = function (grunt) {
  'use strict';

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    yeoman: yeomanConfig,

    open: {
      server: {
        url: 'http://localhost:<%= connect.livereload.options.port %>'
      }
    },

    watch: {
      widgets: {
        files: ['app/widgets/**/*.js'],
        tasks: ['concat']
      },
      handlebars: {
        files: ['app/widgets/**/*.hbs'],
        tasks: ['handlebars']
      },
      livereload: {
        files: [
          'app/*.html',
          '{.tmp,app}/styles/*.css',
          '{.tmp,app}/scripts/*.js',
          'app/images/*.{png,jpg,jpeg}'
        ],
        tasks: ['livereload']
      }
    },

    jshint: {
      all: [
        'app/scripts/[^templates].js',
        'app/widgets/**/*.js'
      ]
    },

    handlebars: {
      compile: {
        files: {
          "app/scripts/templates.js" : ["app/widgets/**/*.hbs"]
        },
        options: {
          wrapped: false,
          namespace: "Hull.templates",
          processName: function (filename) {
            return filename.replace(/^app\/widgets\//, '').replace(/\.hbs$/, '');
          }
        }
      }
    },

    connect: {
      livereload: {
        options: {
          port: 9000,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      }
    },

    clean: {
      dist: ['.tmp', 'dist/*'],
      server: '.tmp'
    },

    uglify: {
      dist: {
        files: {
          'dist/scripts/application.js': [
            'app/scripts/*.js'
          ],
          'dist/scripts/components.js': [
            'app/components/spin.js/dist/spin.js',
            'app/components/jquery/jquery.min.js'
          ]
        }
      }
    },

    useminPrepare: {
      html: 'index.html'
    },

    usemin: {
      html: ['dist/*.html'],
      css: ['dist/styles/*.css']
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '*.{png,jpg,jpeg}',
          dest: 'dist/images'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/styles/main.min.css': ['app/styles/main.css'],
          'dist/styles/admin.min.css': ['app/styles/admin.css']
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          removeCommentsFromCDATA: true,
          collapseWhitespace: false,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          useShortDoctype: true,
          removeEmptyAttributes: false,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: 'app',
          src: '*.html',
          dest: 'dist'
        }]
      }
    },

    concat: {
      dist: {
        src: ['app/widgets/**/*.js'],
        dest: 'app/scripts/widgets.js'
      }
    }
  });

  grunt.registerTask('server', [
    'clean:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'jshint',
    'handlebars',
    'useminPrepare',
    'uglify',
    'imagemin',
    'cssmin',
    'htmlmin',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);

};
