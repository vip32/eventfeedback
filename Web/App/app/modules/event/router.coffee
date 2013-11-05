application = require 'application'
vent = require 'vent'
settings = require 'settings'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'events': 'showEventsIndex'
    'events/:id': 'showEventDetails'
    'sessions/:id': 'showSessionDetails'

  initialize: (options)  ->
    console.log 'event router init'

    application.addInitializer (options) =>

      vent.on 'navigation:signin', =>
        application.navigate 'events'
        @controller.showEventsIndex()

      application.on 'events:index', =>
        application.navigate 'events'
        @controller.showEventsIndex()

      application.on 'event:details', (id) =>
        # if @noActiveEvent()
        #   application.trigger 'events:index'
        # else
        application.navigate 'events/' + id
        @controller.showEventDetails(id)

      application.on 'session:details', (id) =>
        # if @noActiveEvent()
        #   application.trigger 'events:index'
        # else
        application.navigate 'sessions/' + id
        @controller.showSessionDetails(id)

  # noActiveEvent: ->
  #   return _.isEmpty(settings.get('active-event'))

  controller: new Controller()
