require 'lib/marionette-renderer'
require 'lib/view-helper'
config = require 'config'
settings = require 'settings'
vent = require 'vent'
Resource = require '../../models/resource'

class Application extends Backbone.Marionette.Application
  routers: {}

  initialize: =>
    log 'application:initialize'
    vent.setup()
    @hookGlobalEvents()
    @on "initialize:after", (options) =>
      log 'application init after'

      for name, module of config.modules
        log 'module', name
        router = new (require module)
        @routers[name] = router

      Backbone.history.start()
      log 'current route', @getCurrentRoute()
      @on 'start', =>
        # if @getCurrentRoute() is ''
          @trigger(config.startuptrigger)

    @addInitializer (options) =>
      @layout = new (require config.layout)
      @layout.render()

    @resources = new Resource.Collection()
    @resources.fetch(
      data:
        language: 'de-DE'
    ).done (resources) =>
      vent.trigger 'resources:loaded'

    settings.set('last-visit', moment())
    @start()

  checkauth: (trigger) ->
    log 'checkauth', trigger
    # TODO possible trigger config.signintrigger + add return url

  navigate: (route, options) ->
    log 'navigate', route
    options = options or {}
    Backbone.history.navigate(route, options)

  getCurrentRoute: ->
    Backbone.history.fragment

  startModule: (name, options) ->
    log 'startmodule', route
    currentModule = name or @module(name) or null
    if ContactManager.currentModule is currentModule then return
    if @currentModule? then @currentModule.stop()

    @currentModule = currentModule;
    if(currentModule) then currentModule.start(options)
    
  hookGlobalEvents: ->
    $(window).error (msg, url, line) ->
      # general error handler ###
      message = "'#{msg.originalEvent.message}' at #{msg.originalEvent.filename}:#{msg.originalEvent.lineno}"
      log 'ERROR:', message
      #vent.trigger 'message:error:show', message
      alert message
      vent.trigger 'about:index'

module.exports = new Application()