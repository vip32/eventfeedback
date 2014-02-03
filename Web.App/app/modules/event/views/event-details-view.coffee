application = require 'application'
vent = require 'vent'
settings = require 'settings'

module.exports = class EventDetailsView extends Backbone.Marionette.CompositeView
  id: 'event-details-view'
  template: require './templates/event-details'
  itemView: require './session-item-view'
  itemViewContainer: '.js-sessions'
  events:
    'click .js-report': 'onReport'

  initialize: (options) ->
    @resources = options?.resources
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()

  itemViewOptions: ->
    resources: @resources
    
  onShow: ->
    roles = settings.get('api_userroles') ? []
    if not _.contains(roles, 'Administrator')
      $('.js-report').hide()

  onBack: =>
    console.log 'back from event-details'
    application.trigger 'events:index'
    
  onReport: (e) ->
    e.preventDefault()
    application.trigger 'event:report',  settings.get('active-event')

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'events-details view close'