application = require 'application'
vent = require 'vent'
settings = require 'settings'
user = require 'user'

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
    user: user.name()
    roles: user.roles()

  onTriggerEvent: (e) ->
    model = Backbone.Syphon.serialize(@)
    log 'onTriggerEvent', model
    vent.trigger model.event
    e.preventDefault()

  onShow: ->
    scrollTo(0,0)
    log 'resources', @resources
    #$('input.rating[type=number]').rating();

  onClose: ->
    log 'debug view close'