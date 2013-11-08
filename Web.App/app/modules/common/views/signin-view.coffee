application = require 'application'
vent = require 'vent'
settings = require 'settings'

module.exports = class SigninView extends Backbone.Marionette.ItemView
  id: 'signin-view'
  template: require './templates/signin'
  events:
    'click .js-signin': 'onSignin'

  initialize: (options) ->
    application.trigger 'navigation:back:off'

  serializeData: ->
    resources: @resources?.toJSON()
    username: if settings.get('api_remember') then settings.get('api_username')
    password: if settings.get('api_remember') then settings.get('api_password')
    remember: if settings.get('api_remember') then settings.get('api_remember')

  onSignin: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(@)
    vent.trigger 'view:signin:do', data

  onShow: ->
    $('.make-switch').bootstrapSwitch()

  onClose: ->
    console.log 'signin view close'
