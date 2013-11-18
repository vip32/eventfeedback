application = require 'application'
Header = require '../../models/header'
vent = require 'vent'
settings = require 'settings'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

    application.addInitializer (options) =>

      @headers = new Header.Collection()
      new Header.TestData().addTo(@headers)

      vent.on 'resources:loaded', =>
        @showHeader()

  showHeader: ->
    View = require './views/header-view'
    view = new View.Header
      collection: @headers.active(settings.get('api_userroles'))
      resources: application.resources
    application.layout.header.show(view)

  onClose: ->
    console.log 'header controller close'
