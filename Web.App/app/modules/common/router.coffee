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
        application.trigger config.signintrigger

      vent.on 'sync:fail:servererror', =>
        console.warn 'sync:server error'

      vent.on 'sync:fail:unknown', =>
        console.warn 'sync:unknown error'

      application.on 'home:index', =>
        application.navigate 'home'
        @controller.showHome()

      application.on 'signin:index', =>
        application.navigate 'signin'
        @controller.showSignin()

      application.on 'about:index', =>
        application.navigate 'about'
        @controller.showAbout()

      application.on 'debug:index', =>
        application.navigate 'debug'
        @controller.showDebug()

  controller: new Controller()
