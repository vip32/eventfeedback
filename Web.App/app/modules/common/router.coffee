application = require 'application'
vent = require 'vent'
Controller = require './controller'
config = require 'config'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    '': 'showHome'
    'home': 'showHome'
    'about': 'showAbout'
    'debug': 'showDebug'
    'signin': 'showSignin'
    'signout': 'doSignout'

  initialize: (options)  ->
    log 'common router init'

    application.addInitializer (options) =>

      vent.on 'sync:fail:unauthorized', =>
        vent.trigger config.signintrigger

      vent.on 'sync:fail:servererror', =>
        console.warn 'sync:server error'

      vent.on 'sync:fail:unknown', =>
        console.warn 'sync:unknown error'

      vent.on 'home:index', =>
        console.log 'HOME!'
        application.navigate 'home'
        #@controller.showHome()

      vent.on 'signin:index', =>
        console.log 'current route:', application.currentRoute()
        if not application.currentRoute().startsWith('signin')
          application.navigate 'signin',
            returnroute: application.currentRoute()
        else
          application.navigate 'signin',
            returnroute: 'home' # should be se to current returnroute (from url)
#        @controller.showSignin()

      vent.on 'signout:index', =>
        application.navigate 'signout'

      vent.on 'about:index', =>
        console.log 'ABOUT!'
        application.navigate 'about'
        #@controller.showAbout()

      vent.on 'debug:index', =>
        application.navigate 'debug'
        #@controller.showDebug()

  controller: new Controller()
