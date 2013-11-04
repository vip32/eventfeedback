application = require 'application'
vent = require 'vent'
settings = require 'settings'

module.exports = class DebugView extends Backbone.Marionette.ItemView
  id: 'debug-view'
  template: require  './templates/debug'
  events:
    'click .js-triggerevent': 'onTriggerEvent'

  initialize: (options) ->
    @resources = options?.resources
    application.trigger 'navigation:back:off'

  serializeData: ->
    resources: @resources?.toJSON()
    username: settings.get('api_username')
    password: settings.get('api_password')

  onTriggerEvent: (e) ->
    model = Backbone.Syphon.serialize(@)
    console.log 'onTriggerEvent', model
    application.trigger model.event
    e.preventDefault()

  onShow: ->
    console.log 'resources', @resources
    $('input.rating[type=number]').rating();

  onClose: ->
    console.log 'debug view close'