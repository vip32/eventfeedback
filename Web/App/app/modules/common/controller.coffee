application = require 'application'
User = require '../../models/user'
vent = require 'vent'
settings = require 'settings'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

    application.addInitializer (options) =>

      vent.on 'view:signin:do', (data) =>
        settings.set('api_username', data.username)
        settings.set('api_password', data.password)
        settings.set('api_remember', data.remember is 'on')

        @users = new User.Collection()
        @users.fetch()
          .done =>
            settings.set('api_authenticated', true)
            vent.trigger 'message:signin:success'
            vent.trigger 'navigation:signin', data
          .fail =>
            settings.set('api_authenticated', false)
            settings.set('api_username', '')
            settings.set('api_password', '')
            vent.trigger 'message:signin:failed'

  showHome: ->
    application.trigger 'set:active:header', 'Home'
    View = require './views/home-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showSignin: ->
    application.trigger 'set:active:header', 'Sign-in'
    View = require './views/signin-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  doSignin: ->

  showAbout: ->
    application.trigger 'set:active:header', 'About'
    View = require './views/about-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showDebug: ->
    application.trigger 'set:active:header', 'Debug'
    View = require './views/debug-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  onClose: ->
    console.log 'about controller close'
