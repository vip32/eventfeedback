﻿(function() {

  exports.config = {
    paths: {
      "public": '../public'
    },
    files: {
      javascripts: {
        joinTo: {
          'javascripts/app.js': /^app/,
          'javascripts/vendor.js': /^(bower_components|vendor)/,
          'test/test.js': /^test/
        },
        order: {
          after: ['test/vendor/scripts/test-helper.js']
        }
      },
      stylesheets: {
        joinTo: {
          'stylesheets/app.css': /^(?!test)/,
          'test/test.css': /^test/
        },
        order: {
          after: ['vendor/styles/helpers.css']
        }
      },
      templates: {
        defaultExtension: 'hbs',
        joinTo: 'javascripts/app.js'
      }
    }
  };

}).call(this);
