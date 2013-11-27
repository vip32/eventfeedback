application = require 'application'
vent = require 'vent'

module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/session-details'
  events:
    'click .js-submit': 'onSubmit'

  initialize: (options) ->
    @resources = options?.resources
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    feedbackdefinition: @model.get('feedbackDefinition')

  onBack: =>
    console.log 'back from session-details'
    application.trigger 'event:details', @model.get('eventId')

  onShow: ->
    $('input.rating[type=number]').rating()
    $('textarea').autosize()


  onSubmit: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(@)
    # vent.trigger 'view:feedback:do', data
    console.log 'data:', data
    alert data.answer0

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'session-details view close'

