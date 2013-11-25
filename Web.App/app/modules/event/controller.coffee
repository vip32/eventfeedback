application = require 'application'
config = require 'config'
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
      reload: true # needed after login, otherwise FAIL on fetch
      data:
        filter: 'all'
    ).done (models) ->
      application.trigger 'set:active:header', application.resources.key('Title_Events'), 'bookmark' # TODO: breaks sidebar highlight
      View = require './views/events-index-view'
      view = new View(collection: models, resources: application.resources)
      application.layout.content.show(view)
    # .fail ->
    #   application.trigger config.signintrigger

  showEventDetails: (id) ->
    @events.fetch(
      data:
        filter: 'all'
    ).done (models) =>
      application.trigger 'set:active:header', models.get(id).get('title'), 'bookmark' # TODO: breaks sidebar highlight
      settings.set('active-event', id)

      @sessions.fetch(
        # reload: true
      ).done (sessions) =>
        View = require './views/event-details-view'
        view = new View(model: models.get(id), collection: sessions, resources: application.resources)
        application.layout.content.show(view)

  showSessionDetails: (id) ->
    @sessions.fetch().done (models) ->
      application.trigger 'set:active:header', models.get(id).get('title'), 'comment' # TODO: breaks sidebar highlight
      settings.set('active-session', id)
      View = require './views/session-details-view'
      view = new View(model: models.get(id), resources: application.resources)
      application.layout.content.show(view)

  onClose: ->
    console.log 'event controller close'