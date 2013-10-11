application = require 'application'
vent = require 'vent'

module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/session-details'

  initialize: (options) ->
    @resources = options?.resources
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()

  onBack: =>
    console.log 'back from session-details'
    application.trigger 'event:details', @model.get('eventId')

  onShow: ->
     $('input.rating[type=number]').rating()
     $('textarea').autosize()

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'session-details view close'

