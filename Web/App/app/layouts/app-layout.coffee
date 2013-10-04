application = require 'application'

module.exports = class AppLayout extends Backbone.Marionette.Layout
  template: 'layouts/templates/app-layout'
  el: "body"

  regions:
    header: '#header'
    content: "#content"
    footer: "#footer"

  initialize: ->
    application.on 'sidebar:toggle', @onSidebarToggle
    application.on 'sidebar:hide', @onSidebarHide

  events:
    'click .page-content': 'onSidebarHide'

  hammerEvents:
    'touchmove .page-content': 'test'
    'swipeleft .page-content': 'onSidebarHide'
    'swiperight .page-content': 'onSidebarToggle'

  test: (e) ->
    e.preventDefault()

  onSidebarToggle: ->
    $('#wrapper').toggleClass('active')

  onSidebarHide: ->
    $('#wrapper').removeClass('active')