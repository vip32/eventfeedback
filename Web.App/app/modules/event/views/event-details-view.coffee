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
    'change .js-tag': 'onTag'

  initialize: (options) ->
    @resources = options?.resources
    @tags = options?.tags
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack
    @orgcoll = new options?.collection.constructor(options?.collection.models)

  serializeData: ->
    resources: @resources?.toJSON()
    tags: @tags?.toJSON()
    model: @model.toJSON()

  itemViewOptions: ->
    resources: @resources
    
  onShow: ->
    tag = settings.get('active-eventtag')
    $("input:radio[name='tags'][value='" + tag + "']").attr('checked', 'checked').parent().addClass('active');
    @filterByTag(tag)
    
    roles = settings.get('api_userroles') ? []
    if not _.contains(roles, 'Administrator')
      $('.js-report').hide()

  onTag: (e) ->
    e.preventDefault()
    @filterByTag @$("input:radio[name='tags']:checked").val()
    
  filterByTag: (tag) ->
    if tag?
      settings.set('active-eventtag', tag)
      if tag isnt ""
        @collection.reset(@orgcoll.filterForTag(tag))
      else
        @collection.reset(@orgcoll.models)
      
  onBack: =>
    console.log 'back from event-details'
    application.trigger 'events:index'
    
  onReport: (e) ->
    e.preventDefault()
    application.trigger 'event:report',  settings.get('active-event')
    
  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'events-details view close'