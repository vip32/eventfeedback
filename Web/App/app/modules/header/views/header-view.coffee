application = require 'application'

module.exports.HeaderItem = class ItemView extends Backbone.Marionette.ItemView
  id: 'header-item-view'
  template: require './templates/header-item'
  tagName: 'li'
  events:
    'click': 'onClick'

  onClick: (e) ->
    $('.navbar-collapse').collapse('hide')
    application.trigger @model.get('trigger')
    e.preventDefault()


module.exports.Header = class View extends Backbone.Marionette.CompositeView
  id: 'header-view'
  template: require './templates/header'
  itemView: module.exports.HeaderItem
  itemViewContainer: '.js-headers'


