application = require 'application'
Header = require '../../models/header'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

    application.addInitializer (options) =>

      @headers = new Header.Collection()
      new Header.TestData().addTo(@headers)

  showHeader: ->
    View = require './views/header-view'
    view = new View.Header
      collection: @headers.visible()
      resources: application.resources # TODO: filter on 'visible'
    application.layout.header.show(view)

  onClose: ->
    console.log 'header controller close'
