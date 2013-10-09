ItemView = require '../../../../lib/base/item-view'

module.exports = class SessionItemView extends ItemView
  id: 'session-item-view'
  template: require './templates/session-item'
  tagName: 'a'
  className: 'list-group-item'
  tagAttrs:
    'href': (model) -> '#sessions/' + model.get('id')