application = require 'application'
vent = require 'vent'
settings = require 'settings'
ItemView = require '../../../../lib/base/item-view'

module.exports = class SessionItemView extends ItemView
  id: 'session-item-view'
  template: require './templates/session-item'
  tagName: 'div'
  className: 'list-group-item'
  # tagAttrs:
  #   'href': (model) -> '#sessions/' + model.get('id')

  events:
    'click': 'onClick'

  initialize: (options) ->
    @resources = options?.resources

  onShow: ->
    if @model.get('feedbackAllowed') is false
      console.log @model, @model.get('feedbackAllowed')
      
      @$el.addClass('nofeedback') 

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()

  onClick: (e) ->
    e.preventDefault()
    @$el.addClass('active')
    settings.set('active-session', @model.get('id'))
    application.trigger 'session:details', @model.get('id')
