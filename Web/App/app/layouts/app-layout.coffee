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
    'swipeleft .page-content': 'onSidebarHide'
    'swiperight .page-content': 'onSidebarToggle'

  onSidebarToggle: ->
    $('#wrapper').toggleClass('active')

  onSidebarHide: ->
    $('#wrapper').removeClass('active')