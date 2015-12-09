module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        buildcontrol: {
            options: {
                dir: 'prototype',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            prototypeheroku: {
                options: {
                    remote: 'git@heroku.com:name-of-heroku-app.git',
                    branch: 'master'
                }
            },
            local: {
                options: {
                remote: '../',
                branch: 'build'
                }
            }
        }

    });

    [
        'grunt-contrib-connect',
        'grunt-build-control'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });


    grunt.registerTask('deploy', ['buildcontrol']);

};
