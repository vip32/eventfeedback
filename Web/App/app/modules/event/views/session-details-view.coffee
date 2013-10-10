module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/session-details'

  initialize: (options) ->
    console.log 'session id', options
    @resources = options?.resources

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()

  onShow: ->
     $('input.rating[type=number]').rating();

