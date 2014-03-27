application = require 'application'
UserProfile = require '../../models/userprofile'
UserToken = require '../../models/usertoken'
vent = require 'vent'
settings = require 'settings'
user = require 'user'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    log 'about controller init'

    application.addInitializer (options) =>

      vent.on 'view:signin:do', (data) =>
        if not _.isEmpty(data.username) and not _.isEmpty(data.password)
          user.reset()
          user.name(data.username) if data.remember
          user.remember(data.remember)
          @doSignin(data.username, data.password)

      vent.on 'message:success:show', (data) =>
        @showMessage data, 'success'

      vent.on 'message:error:show', (data) =>
        @showMessage data, 'danger'

  showMessage: (data, type) ->
    $('#messagebox').append('<div id="currentmessage" class="alert alert-' +  type + '"><a class="close" data-dismiss="alert">&emsp;×</a><span>'+data+'</span></div>')
    setTimeout ->
      $("#currentmessage").remove();
    , 3000

  showHome: ->
    vent.trigger 'fetch:done' # switch off block
    vent.trigger 'set:active:header', 'home:index', '', 'glyphicon-home'
    View = require './views/home-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showSignin: (params) ->
    vent.trigger 'fetch:done' # switch off block
    vent.trigger 'set:active:header', 'signin:index', application.resources.key('Title_SignIn'), 'glyphicon-user'
    View = require './views/signin-view'
    view = new View
      resources: application.resources
      username: params?.u
      password: params?.p
      returnroute: params?.returnroute
    application.layout.content.show(view)
    
  showAbout: ->
    vent.trigger 'fetch:done' # switch off block
    vent.trigger 'set:active:header', 'about:index', application.resources.key('Title_About'), 'glyphicon-info-sign'
    View = require './views/about-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showDebug: ->
    vent.trigger 'fetch:done' # switch off block
    vent.trigger 'set:active:header', 'debug:index', application.resources.key('Title_Debug'), 'glyphicon-cog'
    View = require './views/debug-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  doSignin: (username, password) ->
    # get the accesstoken

    vent.trigger 'fetch:start' # because save() does not trigger block
    userToken = new UserToken.Model
      userName: username
      password: password
    userToken.save null, # POST
      success:  (model, response, options) =>
        user.token(userToken.get('accessToken'))
        user.tokenexpires(userToken.get('expires'))
        # get the userprofile
        profile = new UserProfile.Model()
        profile.fetch
          success: (model, response, options) =>
            user.set('api_userroles', model.get('roles'))
            vent.trigger 'message:success:show', 'signed in ' + username
            vent.trigger 'navigation:signin'
          error: (model, xhr, options) ->
            # vent.trigger 'message:error:show', 'profile fetch failed'
            vent.trigger 'navigation:signout'
      error: (model, xhr, options) ->
        vent.trigger 'message:error:show', 'sign in failed'
        vent.trigger 'navigation:signout'
        vent.trigger 'fetch:fail' # stop save() spinner