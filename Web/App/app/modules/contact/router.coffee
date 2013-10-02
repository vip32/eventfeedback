application = require 'application'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'contacts': 'showContactsIndex'
    'contacts/:id': 'showContactDetails'

  initialize: (options)  ->
    console.log 'contact router init'

    application.addInitializer (options) =>

      application.on 'contacts:index', =>
        application.navigate 'contacts'
        @controller.showContactsIndex()

      application.on 'contact:details', (id) =>
        application.navigate 'contact', id
        @controller.showContactDetails(id)

  controller: new Controller()
