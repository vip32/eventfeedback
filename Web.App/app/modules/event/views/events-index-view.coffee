application = require 'application'
vent = require 'vent'
Event = require '../../../models/event'
user = require 'user'

module.exports = class EventIndexView extends Backbone.Marionette.CompositeView
  id: 'event-index-view'
  template: require './templates/events-index'
  itemView: require './event-item-view'
  itemViewContainer: '.js-events'
  events:
    'click .js-new': 'onNew'

  initialize: (options) ->
    @resources = options?.resources
    vent.trigger 'navigation:back:off'
  
  serializeData: ->
    resources: @resources?.toJSON()
    isAdmin: user.isAdministrator()
    
  onNew: (e) ->
    e.preventDefault()  
    vent.trigger 'events:new'
    
  onClose: ->
    log 'events-index view close'