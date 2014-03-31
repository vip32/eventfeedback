application = require 'application'
vent = require 'vent'
settings = require 'settings'
user = require 'user'

module.exports = class EventDetailsView extends Backbone.Marionette.CompositeView
  id: 'event-details-view'
  template: require './templates/event-details'
  itemView: require './session-item-view'
  itemViewContainer: '.js-sessions'
  events:
    'click .js-edit': 'onEdit'
    'click .js-report': 'onReport'
    'change .js-tag': 'onTag'

  initialize: (options) ->
    @resources = options?.resources
    @tags = options?.tags
    vent.trigger 'navigation:back:on'
    vent.on 'navigation:back', @onBack
    # keep the original collections, for resetting the filtered collection
    @orgcoll = new options?.collection.constructor(options?.collection.models)

  serializeData: ->
    resources: @resources?.toJSON()
    tags: @tags?.toJSON()
    model: @model.toJSON()
    isAdmin: user.isAdministrator()

  itemViewOptions: ->
    resources: @resources
    
  onShow: ->
    scrollTo(0,0)
    # highlight the active tag
    tag = settings.get('active-eventtag')
    @$("input:radio[name='tags'][value='" + tag + "']").attr('checked', 'checked').parent().addClass('active');
    # ^^ replace with bootstrap api: set the correct radio    
    @filterByTag(tag)
    # hide some administrator only elements

  onTag: (e) ->
    e.preventDefault()
    @filterByTag @$("input:radio[name='tags']:checked").val() # << replace with bootstrap api: get the selected value
    
  filterByTag: (tag) ->
    # filter the session collection by tag
    if tag?
      settings.set('active-eventtag', tag)
      if _.isEmpty(tag)
        @collection.reset(@orgcoll.models)
      else
        @collection.reset(@orgcoll.filterForTag(tag))
      
  onBack: =>
    log 'back from event-details'
    vent.trigger 'events:index'
    
  onEdit: (e) ->
    e.preventDefault()  
    vent.trigger 'event:edit',  settings.get('active-event')
    
  onReport: (e) ->
    e.preventDefault()
    vent.trigger 'event:report',  settings.get('active-event')
    
  onClose: ->
    vent.off 'navigation:back', @onBack
    log 'events-details view close'