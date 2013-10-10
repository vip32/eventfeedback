module.exports = class EventDetailsView extends Backbone.Marionette.CompositeView
  id: 'event-details-view'
  template: require './templates/event-details'
  itemView: require './session-item-view'
  itemViewContainer: '.js-sessions'

  initialize: (options) ->
    @resources = options?.resources

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()

  itemViewOptions: ->
    resources: @resources