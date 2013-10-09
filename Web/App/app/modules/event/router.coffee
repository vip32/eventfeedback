application = require 'application'
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

      application.on 'events:index', =>
        application.navigate 'events'
        @controller.showEventsIndex()

      application.on 'event:details', (id) =>
        if @noActiveEvent()
          application.trigger 'events:index'
        else
          application.navigate 'event', id
          @controller.showEventDetails(id)

      application.on 'session:details', (id) =>
        if @noActiveEvent()
          application.trigger 'events:index'
        else
          application.navigate 'session', id
          @controller.showSessionDetails(id)

  noActiveEvent: ->
    return _.isEmpty(settings.get('active-event'))

  controller: new Controller()
