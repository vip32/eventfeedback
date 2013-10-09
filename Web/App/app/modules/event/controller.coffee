application = require 'application'
settings = require 'settings'
Event = require '../../models/event'
Session = require '../../models/session'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'event controller init'

    application.addInitializer (options) =>

      application.on 'events:index', =>
        application.navigate 'events'

      application.on 'event:details', (id) =>
        application.navigate 'events/' + id

      @events = new Event.Collection()
      @sessions = new Session.Collection()

  showEventsIndex: ->
    @events.fetch(
      reload: true
      data:
        filter: 'all'
    ).done (models) ->
      application.trigger 'set:active:header', 'Events'
      View = require './views/events-index-view'
      view = new View(collection: models)
      application.layout.content.show(view)

  showEventDetails: (id) ->
    @events.fetch(
      data:
        filter: 'all'
    ).done (models) =>
      application.trigger 'set:active:header', 'Events'
      settings.set('active-event', id)

      @sessions.fetch().done (sessions) =>
        View = require './views/event-details-view'
        view = new View(model: models.get(id), collection: sessions)
        application.layout.content.show(view)

  showSessionsIndex: ->
    @sessions.fetch(
      reload: true
    ).done (models) ->
      application.trigger 'set:active:header', 'Sessions'
      View = require './views/sessions-index-view'
      view = new View(collection: models)
      application.layout.content.show(view)

  showSessionDetails: (id) ->
    @sessions.fetch().done (models) ->
      application.trigger 'set:active:header', 'Sessions'
      settings.set('active-session', id)
      View = require './views/session-details-view'
      view = new View(model: models.get(id))
      application.layout.content.show(view)

  onClose: ->
    console.log 'event controller close'