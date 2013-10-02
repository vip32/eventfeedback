application = require 'application'
Header = require '../../models/header'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

    application.addInitializer (options) =>

      @headers = new Header.Collection()
      @headers.fetch().done =>
        new Header.TestData().addTo(@headers)

  showHeader: ->
    @headers.fetch().done (models) ->
      View = require './views/header-view'
      view = new View.Header(collection: models)
      application.layout.header.show(view)

  onClose: ->
    console.log 'header controller close'
