exports.config =
  # See http://brunch.io/#documentation for docs.
  paths:
    public: '../Web'
    # watched: ['src', 'test', 'vendor']

  files:
    javascripts:
      joinTo:
        'app/javascripts/app.js': /^app/
        'app/javascripts/vendor.js': /^(bower_components|vendor)/
        'app/test/test.js': /^test/
      order:
        after: [
          'app/test/vendor/scripts/test-helper.js'
        ]

    stylesheets:
      joinTo:
        'app/stylesheets/app.css': /^(?!test)/
        'app/test/test.css': /^test/
      order:
        after: ['app/vendor/styles/helpers.css']

    templates:
      defaultExtension: 'hbs'
      joinTo: 'app/javascripts/app.js'