application = require 'application'
vent = require 'vent'
settings = require 'settings'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'admin/events': 'showEventsEdit'
    'admin/events/:id': 'showSessionsEdit'
    'admin/users': 'showUsersEdit'
    'admin/usersgenerator': 'showUsersGenerator'

  initialize: (options)  ->
    console.log 'admin router init'

    application.addInitializer (options) =>

      application.on 'admin:events:edit', =>
        application.navigate 'admin/events'
        @controller.showEventsEdit()

      application.on 'admin:sessions:edit', (id) =>
        application.navigate 'admin/events/' + id
        @controller.showSessionsEdit(id)

      application.on 'admin:users:edit', =>
        application.navigate 'admin/users'
        @controller.showUsersEdit()
        
      application.on 'admin:users:generator', =>
        application.navigate 'admin/usersgenerator'
        @controller.showUsersGenerator()

  controller: new Controller()
