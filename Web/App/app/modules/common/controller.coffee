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
        if not _.isEmpty(data.username) and not _.isEmpty(data.password)
          settings.set('api_token', '')
          settings.set('api_authenticated', false)
          settings.set('api_username', data.username)
          settings.set('api_password', data.password)
          settings.set('api_remember', data.remember is 'on')
          @doSignin(data.username, data.password)

      vent.on 'message:success:show', (data) =>
        @showMessage data, 'success'

      vent.on 'message:error:show', (data) =>
        @showMessage data, 'danger'

  showMessage: (data, type) ->
    $('#messagebox').append('<div id="currentmessage" class="alert alert-' +  type + '"><a class="close" data-dismiss="alert">×</a><span>'+data+'</span></div>')
    setTimeout ->
      $("#currentmessage").remove();
    , 3000

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

  doSignin: (username, password) ->
    # get the accesstoken
    userToken = new UserToken.Model
      userName: username
      password: password
    userToken.save null,
      success:  (model, response, options) =>
        settings.set('api_token', userToken.get('accessToken'))
        settings.set('api_authenticated', true)

        # get the userprofile
        profile = new UserProfile.Model()
        profile.fetch
          success:  (model, response, options) =>
            vent.trigger 'message:success:show', 'signed in ' + username
            vent.trigger 'navigation:signin'
          error: (model, xhr, options) ->
            # alert('profile fetch failed')
            vent.trigger 'message:error:show', 'profile fetch failed'
            vent.trigger 'navigation:signout'
      error: (model, xhr, options) ->
        # alert('signin failed')
        vent.trigger 'message:error:show', 'sign in failed'
        vent.trigger 'navigation:signout'

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