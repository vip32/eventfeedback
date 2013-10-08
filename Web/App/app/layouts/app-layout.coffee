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
    'click div #sidebar-wrapper': 'onSidebarHide'

  onSidebarToggle: ->
    $('#wrapper').toggleClass('active')
    # lock scroll position, but retain settings for later
    scrollPosition = [self.pageXOffset or document.documentElement.scrollLeft or document.body.scrollLeft, self.pageYOffset or document.documentElement.scrollTop or document.body.scrollTop]
    html = jQuery("html") # it would make more sense to apply this to body, but IE7 won't have that
    html.data "scroll-position", scrollPosition
    html.data "previous-overflow", html.css("overflow")
    html.css "overflow", "hidden"
    window.scrollTo scrollPosition[0], scrollPosition[1]

  onSidebarHide: ->
    $('#wrapper').removeClass('active')
    # un-lock scroll position
    html = jQuery("html")
    scrollPosition = html.data("scroll-position")
    html.css "overflow", html.data("previous-overflow")
    window.scrollTo scrollPosition[0], scrollPosition[1]