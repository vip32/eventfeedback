application = require 'application'
Event = require '../../../models/event'

module.exports = class SessionIndexView extends Backbone.Marionette.CompositeView
  id: 'session-index-view'
  template: require './templates/events-index'
  itemView: require './session-item-view'
  itemViewContainer: '.js-events'

  onClose: ->
    console.log 'sessions-index view close'