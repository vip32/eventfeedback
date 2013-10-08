application = require 'application'
config = require 'config'

module.exports.HeaderItem = class ItemView extends Backbone.Marionette.ItemView
  id: 'header-item-view'
  template: require './templates/header-item'
  tagName: 'li'
  events:
    'click': 'onClick'

  initialize: ->
    application.on 'set:active:header', (title) =>
      if title is @model.get('title')
        @setActive()
      else
        @setInactive()

  onClick: (e) ->
    e.preventDefault()
    application.trigger 'sidebar:hide'
    application.trigger @model.get('trigger')

  setActive: ->
    @$el.addClass('active')

  setInactive: ->
    @$el.removeClass('active')


module.exports.Header = class View extends Backbone.Marionette.CompositeView
  id: 'header-view'
  template: require './templates/header'
  itemView: module.exports.HeaderItem
  itemViewContainer: '.js-headers'
  events:
    'click #menu-toggle': 'onSidebarToggle'

  initialize: ->
    application.on 'set:active:header', (title) =>
      @setSubHeader(title)

  onShow: ->
    @$('.js-apptitle').text(config.apptitle)

  onSidebarToggle: (e) ->
    e.preventDefault()
    application.trigger 'sidebar:toggle'

  setSubHeader: (title) ->
    @$('.js-subtitle').text(title)