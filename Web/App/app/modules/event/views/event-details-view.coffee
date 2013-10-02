module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'event-details-view'
  template: require './templates/event-details'

  initialize: (options) ->
    console.log 'event id', options

