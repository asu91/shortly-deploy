module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['public/**/*.js'],
        dest: 'public/dist/built.js'
      }
    },
    gitpush: {
      your_target:{
        remote: 'live2',
        branch: 'master'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/dist/built.min.js': ['public/dist/built.js']
        } 
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'app/**/*.js', 'lib/*.js', 'public/**/*.js', '*.js'
      ]
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git add . ; git commit ; Updating ...; git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');




  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' , 'shell']);
  });


  grunt.registerTask('test', [
     'eslint', 'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat', 'uglify'
  ]);


  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      
      var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });

    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    }
    grunt.task.run([ 'server-dev' ]);
  });

  grunt.registerTask('deploy', function () {
    if (grunt.option('prod')) {
      grunt.task.run(['upload']);
    } else {
      grunt.task.run(['test', 'build']);
    }
  });
    // add your deploy tasks here


};
