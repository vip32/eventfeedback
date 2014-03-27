application = require 'application'
vent = require 'vent'
settings = require 'settings'
user = require 'user'

module.exports = class SigninView extends Backbone.Marionette.ItemView
  id: 'signin-view'
  template: require './templates/signin'
  events:
    'click .js-signin': 'onSignin'

  initialize: (options) ->
    vent.trigger 'navigation:back:off'

  serializeData: ->
    resources: @resources?.toJSON()
    username: if @options.username then @options.username else if user.remember() then user.name()
    password: @options.password #if settings.get('api_remember') then settings.get('api_password')
    remember: user.remember()

  onSignin: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(@)
    vent.trigger 'view:signin:do', data

  onShow: ->
    scrollTo(0,0)
    $('#make-switch').bootstrapSwitch('size', 'small')

  onClose: ->
    log 'signin view close'
