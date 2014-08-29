require 'lib/marionette-renderer'
require 'lib/string-helper'
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
        log '=== module', name
        router = new (require module)
        @routers[name] = router
      log 'routers:', @routers

      Backbone.history.start()
      log 'current route:', @currentRoute()
      #@on 'start', =>
        # if @getCurrentRoute() is ''
        #vent.trigger(config.startuptrigger)

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
    appInsights.logEvent('event/appStart')
    @start()

  checkauth: (trigger) ->
    log 'checkauth', trigger
    # TODO possible trigger config.signintrigger + add return url

  navigate: (route, options) ->
    log "==========================| #{route} |========================"
    log 'navigate', route, options
    appInsights.logPageView(route);
    options = options or {}
    options.trigger = true # this causes the router (approutes) to react on url changes
    if not _.isEmpty(options?.returnroute)
      route = "#{route}?returnroute=#{options.returnroute}"
    Backbone.history.navigate(route, options)

  currentRoute: ->
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
      message = "'#{msg.originalEvent.message}' at #{msg.originalEvent.filename}:#{msg.originalEvent.lineno}"
      log 'ERROR:', message
      appInsights.logEvent('error', {message: message})
      if not msg?
        alert message
        vent.trigger 'about:index' # todo: maybe redirect to error view

module.exports = new Application()