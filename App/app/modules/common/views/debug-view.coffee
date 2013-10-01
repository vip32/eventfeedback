application = require 'application'

module.exports = class DebugView extends Backbone.Marionette.ItemView
  id: 'debug-view'
  template: require  './templates/debug'
  events:
    'click .js-triggerevent': 'onTriggerEvent'

  onTriggerEvent: (e) ->
    model = Backbone.Syphon.serialize(@)
    console.log 'onTriggerEvent', model
    application.trigger model.event
    e.preventDefault()

  onClose: ->
    console.log 'debug view close'