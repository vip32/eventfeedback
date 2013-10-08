application = require 'application'
Event = require '../../models/event'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'event controller init'

    application.addInitializer (options) =>

      application.on 'events:index', =>
        application.navigate 'events'

      application.on 'event:details', (id) =>
        application.navigate 'events/' + id

      @events = new Event.Collection()

  showEventsIndex: ->
    @events.fetch().done (models) ->
      application.trigger 'set:active:header', 'Events'
      View = require './views/events-index-view'
      view = new View(collection: models)
      application.layout.content.show(view)

  showEventDetails: (id) ->
    @events.fetch().done (models) ->
      application.trigger 'set:active:header', 'Events'
      View = require './views/event-details-view'
      view = new View(model: models.get(id))
      application.layout.content.show(view)

  onClose: ->
    console.log 'event controller close'