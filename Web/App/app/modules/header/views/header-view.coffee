application = require 'application'
config = require 'config'

module.exports.HeaderItem = class ItemView extends Backbone.Marionette.ItemView
  id: 'header-item-view'
  template: require './templates/header-item'
  tagName: 'li'
  events:
    'click': 'onClick'

  initialize: (options) ->
    @resources = options?.resources

    application.on 'set:active:header', (title) =>
      if title is @model.get('title')
        @setActive()
      else
        @setInactive()

  serializeData: ->
    title: (@resources.find ((resource) =>
      resource.get('key') is @model.get('resource')))?.get('value') ? '-'
    href: @model.get('href')
    icon: @model.get('glyphicon') ? config.sidebarglyphicon

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
    'click #menu-back': 'onBack'

  initialize: (options) ->
    @resources = options?.resources

    application.on 'set:active:header', (title) =>
      @setSubHeader(title)

    application.on 'navigation:back:on', ->
      $('#menu-back').show()
    application.on 'navigation:back:off', ->
      $('#menu-back').hide()

  serializeData: ->
    resources: @resources?.toJSON()

  itemViewOptions: ->
    resources: @resources

  onShow: ->
    $('#menu-back').hide()
    @$('.js-apptitle').text(config.apptitle)

  onSidebarToggle: (e) ->
    e.preventDefault()
    application.trigger 'sidebar:toggle'

  onBack: (e) ->
    e.preventDefault()
    application.trigger 'navigation:back'

  setSubHeader: (title) ->
    @$('.js-subtitle').text(title)