application = require 'application'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'events': 'showEventsIndex'
    'events/:id': 'showEventDetails'

  initialize: (options)  ->
    console.log 'event router init'

    application.addInitializer (options) =>

      application.on 'events:index', =>
        application.navigate 'events'
        @controller.showEventsIndex()

      application.on 'event:details', (id) =>
        application.navigate 'event', id
        @controller.showEventDetails(id)

  controller: new Controller()
