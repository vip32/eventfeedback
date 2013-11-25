application = require 'application'
config = require 'config'
vent = require 'vent'

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
      resource.get('key') is @model.get('resource')))?.get('value') ? @model.get('title')
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

    application.on 'set:active:header', (title, glyphicon) =>
      @setSubHeader(title, glyphicon)

    vent.on 'fetch:start', (title) =>
      # blockui here https://github.com/malsup/blockui/
      $('#spinner').spin
        lines: 5, length: 8, width: 5, radius: 4
        corners: 0, rotate: 56, trail: 40, speed: 1.5,
        direction: 1, color: '#64b92a'
      $('.page-content').addClass('loading')
    vent.on 'fetch:done', =>
      $('#spinner').spin(false)
      $('.page-content').removeClass('loading')
    vent.on 'fetch:fail', =>
      $('#spinner').spin(false)
      $('.page-content').removeClass('loading')

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

  setSubHeader: (title, glyphicon) ->
    @$('#js-subtitle').text(title)
    @$('#js-subtitle-glyph').removeClass()
    @$('#js-subtitle-glyph').addClass("glyphicon glyphicon-#{glyphicon}")