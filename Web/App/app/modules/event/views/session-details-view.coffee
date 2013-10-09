module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/event-details'

  initialize: (options) ->
    console.log 'session id', options

