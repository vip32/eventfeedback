application = require 'application'
vent = require 'vent'
Controller = require './controller'
config = require 'config'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'home': 'showHome'
    'about': 'showAbout'
    'debug': 'showDebug'
    'signin': 'showSignin'

  initialize: (options)  ->
    console.log 'about router init'

    application.addInitializer (options) =>

      vent.on 'sync:fail:unauthorized', =>
        vent.trigger config.signintrigger

      vent.on 'sync:fail:servererror', =>
        console.warn 'sync:server error'

      vent.on 'sync:fail:unknown', =>
        console.warn 'sync:unknown error'

      vent.on 'home:index', =>
        application.navigate 'home'
        @controller.showHome()

      vent.on 'signin:index', =>
        application.navigate 'signin'
        @controller.showSignin()

      vent.on 'about:index', =>
        application.navigate 'about'
        @controller.showAbout()

      vent.on 'debug:index', =>
        application.navigate 'debug'
        @controller.showDebug()

  controller: new Controller()
