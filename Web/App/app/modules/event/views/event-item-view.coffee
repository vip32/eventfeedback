application = require 'application'
settings = require 'settings'
ItemView = require '../../../../lib/base/item-view'

module.exports = class EventItemView extends ItemView
  id: 'event-item-view'
  template: require './templates/event-item'
  tagName: 'div'
  className: 'list-group-item'
  # tagAttrs:
  #   'href': (model) -> '#events/' + model.get('id')

  events:
    'click': 'onClick'

  onClick: (e) ->
    e.preventDefault()
    @$el.addClass('active')
    settings.set('active-event', @model.get('id'))
    application.trigger 'event:details', @model.get('id')
