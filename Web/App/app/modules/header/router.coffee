application = require 'application'
Controller = require './controller'
vent = require 'vent'

module.exports = class Router extends Backbone.Marionette.AppRouter

  initialize: (options)  ->
    console.log 'header router init'

    application.addInitializer (options) =>

      application.on 'start', =>
        @controller.showHeader()

      vent.on 'navigation:signin', =>
        @controller.showHeader()

      vent.on 'navigation:signout', =>
        @controller.showHeader()

  controller: new Controller()
