module.exports = function(config) {
  'use strict';
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'dist/static/libs/libs.min.js',
      'dist/static/scripts/core.min.js',
      'tests/**/*.js'
    ]
  });
};
