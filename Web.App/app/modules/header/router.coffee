application = require 'application'
Controller = require './controller'
vent = require 'vent'

module.exports = class Router extends Backbone.Marionette.AppRouter
  
  initialize: (options)  ->
    log 'header router init'

    application.addInitializer (options) =>

      application.on 'start', =>
        @controller.showHeader()

      vent.on 'header:refresh', =>
        @controller.showHeader()

  controller: new Controller()
