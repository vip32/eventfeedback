application = require 'application'
vent = require 'vent'
settings = require 'settings'
Controller = require './controller'

module.exports = class Router extends Backbone.Marionette.AppRouter

  appRoutes:
    'events': 'showEventsIndex'
    'events/:id': 'showEventDetails'
    'sessions/:id': 'showSessionDetails'
    'eventreport/:id': 'showEventReport'

  initialize: (options)  ->
    log 'event router init'

    application.addInitializer (options) =>

      vent.on 'events:index', =>
        # application.checkauth 'events:index'
        application.navigate 'events'
#        @controller.showEventsIndex()

      vent.on 'event:details', (id) =>
        # if @noActiveEvent()
        #   vent.trigger 'events:index'
        # else
        application.navigate 'events/' + id
#        @controller.showEventDetails(id)

      vent.on 'session:details', (id) =>
        # if @noActiveEvent()
        #   vent.trigger 'events:index'
        # else
        application.navigate 'sessions/' + id
#        @controller.showSessionDetails(id)
        
      vent.on 'event:report', (id) =>
        # if @noActiveEvent()
        #   vent.trigger 'events:index'
        # else
        application.navigate 'eventreport/' + id
#        @controller.showEventReport(id)

  # noActiveEvent: ->
  #   return _.isEmpty(settings.get('active-event'))

  controller: new Controller()
