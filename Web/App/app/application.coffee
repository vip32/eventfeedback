require 'lib/marionette-renderer'
require 'lib/view-helper'
config = require 'config'
settings = require 'settings'
vent = require 'vent'
Resource = require '../../models/resource'

class Application extends Backbone.Marionette.Application
  routers: {}

  initialize: =>
    console.log 'application init'

    @on "initialize:after", (options) =>
      console.log 'application init after'

      for name, module of config.modules
        console.log 'module', name
        router = new (require module)
        @routers[name] = router

      Backbone.history.start()
      console.log 'current route', @getCurrentRoute()
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
      settings.set('last-visit', moment())
      settings.set('username', 'admin')
      settings.set('password', 'adminadmin')

      @start()

  navigate: (route, options) ->
    console.log 'navigate', route
    options = options or {}
    Backbone.history.navigate(route, options)

  getCurrentRoute: ->
    Backbone.history.fragment

  startModule: (name, options) ->
    console.log 'startmodule', route
    currentModule = name or @module(name) or null
    if ContactManager.currentModule is currentModule then return
    if @currentModule? then @currentModule.stop()

    @currentModule = currentModule;
    if(currentModule) then currentModule.start(options)

module.exports = new Application()