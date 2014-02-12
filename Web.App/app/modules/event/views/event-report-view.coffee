application = require 'application'
vent = require 'vent'

module.exports = class EventReportView extends Backbone.Marionette.ItemView
  id: 'event-report-view'
  template: require './templates/event-report'

  initialize: (options) ->
    @resources = options?.resources
    vent.trigger 'navigation:back:on'
    vent.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    json: JSON.stringify(@model, null, 4)

  onBack: =>
    log 'back from event-report'
    vent.trigger 'event:details', @model?.id

  onClose: ->
    vent.off 'navigation:back', @onBack
    log 'event-report view close'