application = require 'application'
vent = require 'vent'
settings = require 'settings'
Event = require '../../models/event'
Session = require '../../models/session'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'event controller init'

    application.addInitializer (options) =>

      @events = new Event.Collection()
      @sessions = new Session.Collection()

  showEventsIndex: ->
    @events.fetch(
      reload: true
      data:
        filter: 'all'
    ).done (models) ->
      application.trigger 'set:active:header', application.resources.key('Title_Events')
      View = require './views/events-index-view'
      view = new View(collection: models, resources: application.resources)
      application.layout.content.show(view)

  showEventDetails: (id) ->
    @events.fetch(
      data:
        filter: 'all'
    ).done (models) =>
      application.trigger 'set:active:header', models.get(id).get('title')
      settings.set('active-event', id)

      @sessions.fetch(reload: true).done (sessions) =>
        View = require './views/event-details-view'
        view = new View(model: models.get(id), collection: sessions, resources: application.resources)
        application.layout.content.show(view)

  showSessionDetails: (id) ->
    @sessions.fetch().done (models) ->
      application.trigger 'set:active:header', models.get(id).get('title')
      settings.set('active-session', id)
      View = require './views/session-details-view'
      view = new View(model: models.get(id), resources: application.resources)
      application.layout.content.show(view)

  onClose: ->
    console.log 'event controller close'