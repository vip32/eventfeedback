application = require 'application'
vent = require 'vent'
settings = require 'settings'
user = require 'user'
Event = require '../../../models/event'

module.exports = class DebugView extends Backbone.Marionette.ItemView
  id: 'debug-view'
  template: require  './templates/debug'
  events:
    'click .js-triggerevent': 'onTriggerEvent'
    'click .js-submit': 'onSubmit'
    'click .js-remove': 'onRemove'

  initialize: (options) ->
    @resources = options?.resources
    vent.trigger 'navigation:back:off'

  serializeData: ->
    resources: @resources?.toJSON()
    user: user.name()
    roles: user.roles()

  onTriggerEvent: (e) ->
    model = Backbone.Syphon.serialize(@)
    log 'onTriggerEvent', model
    vent.trigger model.event
    e.preventDefault()

  onShow: ->
    scrollTo(0,0)
    log 'resources', @resources
    
    @model = new Event.Model(title: 'new title')
    @form = new Backbone.Form(model: @model).render()
    @$('#form').append(@form.el)
    
  onSubmit: ->
    log 'submit', @form
    @form.commit(validate: true)
    @model.set('key', _.str.slugify(@model.get('title')))
    log 'model:', @model
    
  onRemove: ->
    log 'remove'

  onClose: ->
    log 'debug view close'