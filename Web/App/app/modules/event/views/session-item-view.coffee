application = require 'application'
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
    'click': 'onclick'

  onclick: (e) ->
    e.preventDefault()
    window.navigator.vibrate?(200)
    settings.set('active-session', @model.get('id'))
    application.trigger 'session:details', @model.get('id')