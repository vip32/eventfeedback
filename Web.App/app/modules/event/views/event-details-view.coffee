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
    'click .js-tag': 'onTag'

  initialize: (options) ->
    @resources = options?.resources
    @tags = options?.tags
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack
    @orgcoll = new options?.collection.constructor(options?.collection.models)

  serializeData: ->
    resources: @resources?.toJSON()
    tags: @tags?.toJSON()
    activetag: settings.get('active-eventtag')
    model: @model.toJSON()

  itemViewOptions: ->
    resources: @resources
    
  onShow: ->
    tag = settings.get('active-eventtag')
    # TODO: highlight correct button
    @filterByTag(tag)
    roles = settings.get('api_userroles') ? []
    if not _.contains(roles, 'Administrator')
      $('.js-report').hide()

  onBack: =>
    console.log 'back from event-details'
    application.trigger 'events:index'
    
  onReport: (e) ->
    e.preventDefault()
    application.trigger 'event:report',  settings.get('active-event')
    
  onTag: (e) ->
    e.preventDefault()
    tag = e.target.value
    settings.set('active-eventtag', tag)
    @filterByTag(tag)
    
  filterByTag: (tag) ->
    if tag isnt ""
      @collection.reset(@orgcoll.filterForTag(tag))
    else
      @collection.reset(@orgcoll.models)
      
  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'events-details view close'