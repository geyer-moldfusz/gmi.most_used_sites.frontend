module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build'],
    copy: {
      fonts: {
        files: [{expand: true, cwd: 'app/css/', src: ['fonts/**/*.woff'], dest: 'build/css/'}]
      }
    },
    uglify: {
      trckyrslf: {
        files: {
          'build/js/trckyrslf.min.js': ['app/js/**.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['copy', 'uglify']);

};
