application = require 'application'

module.exports = class EventDetailsView extends Backbone.Marionette.CompositeView
  id: 'event-details-view'
  template: require './templates/event-details'
  itemView: require './session-item-view'
  itemViewContainer: '.js-sessions'

  initialize: (options) ->
    @resources = options?.resources
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()

  itemViewOptions: ->
    resources: @resources

  onBack: =>
    console.log 'back from event-details'
    application.trigger 'events:index'

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'events-details view close'