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
    vent.trigger 'navigation:back:off'

  serializeData: ->
    resources: @resources?.toJSON()
    user: settings.get('api_username')
    roles: settings.get('api_userroles')

  onTriggerEvent: (e) ->
    model = Backbone.Syphon.serialize(@)
    console.log 'onTriggerEvent', model
    vent.trigger model.event
    e.preventDefault()

  onShow: ->
    scrollTo(0,0)
    console.log 'resources', @resources
    #$('input.rating[type=number]').rating();

  onClose: ->
    console.log 'debug view close'