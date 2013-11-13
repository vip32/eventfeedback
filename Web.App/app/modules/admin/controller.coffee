application = require 'application'
vent = require 'vent'
settings = require 'settings'
Event = require '../../models/event'
Session = require '../../models/session'
User = require '../../models/user'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'admin controller init'

    application.addInitializer (options) =>

      @events = new Event.Collection()
      @sessions = new Session.Collection()
      @users = new User.Collection()

      vent.on 'save:users', =>
        @onSaveUsers()

  showEventsEdit: ->
    @events.fetch(
      reload: true
      data:
        filter: 'all'
    ).done (models) ->
      application.trigger 'set:active:header', 'Admin - Events', 'bookmark' # admin:events:edit
      View = require './views/events-edit-view'
      view = new View(collection: models, resources: application.resources)
      application.layout.content.show(view)

  showSessionsEdit: (id) ->
    @events.fetch(
      data:
        filter: 'all'
    ).done (models) =>
      settings.set('active-event', id)

      @sessions.fetch(
        reload: true
      ).done (sessions) =>
        View = require './views/sessions-edit-view'
        view = new View(model: models.get(id), collection: sessions, resources: application.resources)
        application.layout.content.show(view)

  showUsersEdit: =>
    @users.fetch(
      reload: true
      data:
        filter: 'all'
    ).done (collection) ->
      application.trigger 'set:active:header', 'Admin - Users', 'bookmark' # admin:accounts:edit
      collection.on 'change', (model) =>
        console.log 'user change:', model
        model.credentials = collection.credentials
        model.set('dirty', true, silent: true)
      View = require './views/users-edit-view'
      view = new View(collection: collection, resources: application.resources)
      application.layout.content.show(view)

  onSaveUsers: =>
    @users.each (model) ->
      if model.get('dirty') and model.get('name') isnt ''
        model.save null,
          success: (model, response, options) ->
            model.set('dirty', false, silent: true)
          error: (model, xhr, options) ->
            alert('save error')

  onClose: ->
    console.log 'admin controller close'