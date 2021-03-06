application = require 'application'
Controller = require '../../lib/base/controller'
Header = require '../../models/header'
vent = require 'vent'
settings = require 'settings'
user = require 'user'

module.exports = class Controller extends Controller

  constructor: (options) ->
    log 'header controller init'

    application.addInitializer (options) =>

      @headers = new Header.Collection()
      new Header.TestData().addTo(@headers)

      vent.on 'resources:loaded', =>
        @showHeader()

  showHeader: ->
    View = require './views/header-view'
    view = new View.Header
      collection: @headers.active(user.roles())
      resources: application.resources
    application.layout.header.show(view)

  onClose: ->
    log 'header controller close'
