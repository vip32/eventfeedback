application = require 'application'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  initialize: (options)  ->
    console.log 'header router init'

    application.addInitializer (options) =>

      application.on 'start', =>
        @controller.showHeader()

  controller: new Controller()
