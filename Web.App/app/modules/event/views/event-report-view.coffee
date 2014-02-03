application = require 'application'
vent = require 'vent'

module.exports = class EventReportView extends Backbone.Marionette.ItemView
  id: 'event-report-view'
  template: require './templates/event-report'

  initialize: (options) ->
    @resources = options?.resources
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack
    console.log '------>', options

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    json: JSON.stringify(@model, null, 4)

  onBack: =>
    console.log 'back from event-report'
    application.trigger 'event:report', @model.get('eventId')

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'event-report view close'