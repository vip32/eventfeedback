application = require 'application'
vent = require 'vent'
settings = require 'settings'

module.exports = class EventEditView extends Backbone.Marionette.ItemView
  id: 'event-report-view'
  template: require './templates/event-edit'
  events:
    'click .js-submit': 'onSubmit'
    'click .js-remove': 'onRemove'

  initialize: (options) ->
    @resources = options?.resources
    @definitions = options?.definitions
    vent.trigger 'navigation:back:on'
    vent.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    definitions: @definitions?.toJSON()
  
  onShow: ->
    scrollTo(0,0)
    
    @form = new Backbone.Form(model: @model)
    @form.schema.feedbackDefinitionId.options = 
      @definitions.map (def) ->
        val: def.get('id'), label: def.get('title')
       
    @form.initialize()
    @$('#form').append(@form.render().el)
    
  onSubmit: (e) ->
    e.preventDefault()
    errors = @form.commit(validate: true)
    if _.isEmpty(errors)
      @model.set('key', _.str.slugify(@model.get('title')))
      @model.credentials = @collection.credentials
      @model.save(wait: true)
      @onBack()
    
  onRemove: (e) ->
    e.preventDefault()

  onBack: =>
    log 'back from event-edit'
    vent.trigger 'events:index'

  onClose: ->
    vent.off 'navigation:back', @onBack
    log 'event-edit view close'