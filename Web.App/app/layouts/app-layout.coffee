application = require 'application'
vent = require 'vent'

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
    'click div #sidebar-wrapper': 'onSidebarHide'

  onSidebarToggle: ->
    $('#wrapper').toggleClass('active')

  onSidebarHide: ->
    $('#wrapper').removeClass('active')