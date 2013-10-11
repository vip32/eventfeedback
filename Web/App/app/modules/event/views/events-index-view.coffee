application = require 'application'
Event = require '../../../models/event'

module.exports = class EventIndexView extends Backbone.Marionette.CompositeView
  id: 'event-index-view'
  template: require './templates/events-index'
  itemView: require './event-item-view'
  itemViewContainer: '.js-events'

  initialize: (options) ->
    application.on 'navigation:back', @onBack

  onBack: ->
    console.log 'back from events-index'

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'events-index view close'