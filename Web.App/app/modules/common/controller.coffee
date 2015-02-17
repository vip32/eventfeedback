application = require 'application'
Controller = require '../../lib/base/controller'
UserProfile = require '../../models/userprofile'
UserToken = require '../../models/usertoken'
vent = require 'vent'
settings = require 'settings'
user = require 'user'
config = require 'config'

module.exports = class Controller extends Controller

  constructor: (options) ->
    log 'common controller init'

    application.addInitializer (options) =>

      vent.on 'view:signin:do', (data) =>
        if not _.isEmpty(data.username) and not _.isEmpty(data.password)
          user.reset()
          user.name(data.username) if data.remember
          user.remember(data.remember)
          @doSignin(data.username, data.password, data.returnroute)

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
    params = @parseParams(params)
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
    
  doSignout: ->
    user.reset()
    vent.trigger 'header:refresh'
    vent.trigger config.hometrigger
    appInsights.trackEvent('event/signout')

  doSignin: (username, password, returnroute) ->
    # get the accesstoken

    vent.trigger 'fetch:start' # because save() does not trigger block
    userToken = new UserToken.Model
      userName: username
      password: password
    userToken.save null, # POST
      success:  (model, response, options) =>
        appInsights.trackEvent('event/signin/success')
        user.token(userToken.get('accessToken'))
        user.tokenexpires(userToken.get('expires'))
        # get the userprofile
        profile = new UserProfile.Model()
        profile.fetch
          success: (model, response, options) =>
            appInsights.trackEvent('event/profile/success')
            user.set('api_userroles', model.get('roles'))
            vent.trigger 'message:success:show', 'signed in ' + username
            vent.trigger 'header:refresh'
            if _.isEmpty(returnroute)
              vent.trigger config.startuptrigger
            else
              application.navigate returnroute
          error: (model, xhr, options) ->
            # vent.trigger 'message:error:show', 'profile fetch failed'
            appInsights.trackEvent('event/profile/failed')
            vent.trigger 'header:refresh'
      error: (model, xhr, options) ->
        appInsights.trackEvent('event/signin/failed')
        vent.trigger 'message:error:show', 'sign in failed'
        vent.trigger 'header:refresh'
        vent.trigger 'fetch:fail' # stop save() spinner