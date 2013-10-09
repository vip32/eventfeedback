application = require 'application'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'events': 'showEventsIndex'
    'events/:id': 'showEventDetails'
    'sessions': 'showSessionsIndex'
    'sessions/:id': 'showSessionDetails'

  initialize: (options)  ->
    console.log 'event router init'

    application.addInitializer (options) =>

      application.on 'events:index', =>
        application.navigate 'events'
        @controller.showEventsIndex()

      application.on 'event:details', (id) =>
        application.navigate 'event', id
        @controller.showEventDetails(id)

      application.on 'sessions:index', =>
        application.navigate 'sessions'
        @controller.showSessionsIndex()

      application.on 'session:details', (id) =>
        application.navigate 'session', id
        @controller.showSessionDetails(id)

  controller: new Controller()
