application = require 'application'
vent = require 'vent'

module.exports = class EventReportView extends Backbone.Marionette.ItemView
  id: 'event-report-view'
  template: require './templates/event-report'

  events:
    'click .js-print': 'onPrintClick'

  initialize: (options) ->
    @resources = options?.resources
    vent.trigger 'navigation:back:on'
    vent.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    json: JSON.stringify(@model, null, 4)

  onPrintClick: (e) ->
    e.preventDefault()
    sessionId = $(e.currentTarget).attr('data-sessionId')
    css = '<link href="www/stylesheets/app.css" rel="stylesheet" type="text/css">'
    window.frames["print_frame"].document.body.innerHTML= css + document.getElementById(sessionId).innerHTML
    window.frames["print_frame"].window.focus()
    window.frames["print_frame"].window.print()

  onBack: =>
    log 'back from event-report'
    vent.trigger 'event:details', @model?.id

  onClose: ->
    vent.off 'navigation:back', @onBack
    log 'event-report view close'