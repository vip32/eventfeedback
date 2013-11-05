application = require 'application'
UserProfile = require '../../models/userprofile'
UserToken = require '../../models/usertoken'
vent = require 'vent'
settings = require 'settings'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

    application.addInitializer (options) =>

      vent.on 'view:signin:do', (data) =>
        settings.set('api_token', '')
        settings.set('api_authenticated', false)
        settings.set('api_username', data.username)
        settings.set('api_password', data.password)
        settings.set('api_remember', data.remember is 'on')

        # get the accesstoken
        userToken = new UserToken.Model
          userName: data.username
          password: data.password
        userToken.save null,
          success:  (model, response, options) =>
            settings.set('api_token', userToken.get('accessToken'))
            settings.set('api_authenticated', true)

            # get the userprofile
            profile = new UserProfile.Model()
            profile.fetch
              success:  (model, response, options) =>
                vent.trigger 'message:success:show', 'signed in'
                vent.trigger 'navigation:signin', data
              error: (model, xhr, options) ->
                alert('profile fetch failed')
                vent.trigger 'message:error:show', 'profile fetch failed'
          error: (model, xhr, options) ->
            alert('signin failed')
            vent.trigger 'message:error:show', 'sign in failed'

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
