application = require 'application'
vent = require 'vent'
Event = require '../../../models/event'

module.exports = class EventIndexView extends Backbone.Marionette.CompositeView
  id: 'event-index-view'
  template: require './templates/events-index'
  itemView: require './event-item-view'
  itemViewContainer: '.js-events'

  initialize: (options) ->
    vent.trigger 'navigation:back:off'

  onClose: ->
    log 'events-index view close'