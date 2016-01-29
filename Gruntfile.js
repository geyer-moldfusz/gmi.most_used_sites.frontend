module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build'],
    copy: {
      fonts: {
        files: [{expand: true, cwd: 'app/css/', src: ['fonts/**/*.woff'], dest: 'build/css/'}]
      },
      svgs: {
        files: [{expand: true, cwd: 'app/css/', src: ['svg/*.svg'], dest: 'build/css/'}]
      },
      partials: {
        files: [{expand: true, cwd: 'app/partials/', src: ['*.html'], dest: 'build/partials/'}]
      },
      index: {
        src: 'app/production.html',
        dest: 'build/index.html'
      },
      css: {
        src: 'app/css/app.css',
        dest: 'build/css/trckyrslf.css'
      }
    },
    concat: {
      trckyrslf: {
        src: ['app/js/**.js'],
        dest: 'build/js/trckyrslf.js'
      }
    },
    cssmin: {
      trckyrslf: {
        files: {
          'build/css/trckyrslf.min.css': ['app/css/app.css']
        }
      }
    },
    bower: {
      options: {
        targetDir: 'build/vendor/',
        bowerOptions: {
          production: true
        }
      },
      install: { }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('build', ['copy', 'concat', 'cssmin', 'bower']);

};
