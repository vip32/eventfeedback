ItemView = require '../../../../lib/base/item-view'

module.exports = class EventItemView extends ItemView
  id: 'event-item-view'
  template: require './templates/event-item'
  tagName: 'a'
  className: 'list-group-item'
  tagAttrs:
    'href': (model) -> '#events/' + model.get('id')