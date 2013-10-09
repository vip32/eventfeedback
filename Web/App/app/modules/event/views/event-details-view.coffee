module.exports = class EventDetailsView extends Backbone.Marionette.CompositeView
  id: 'event-details-view'
  template: require './templates/event-details'
  itemView: require './session-item-view'
  itemViewContainer: '.js-sessions'

  initialize: (options) ->
    console.log 'event id', options

  # onBeforeClose: ->
  #   alert 'bbbbbbbbbb'


  # onClose: ->
  #   alert 'aaaa'

