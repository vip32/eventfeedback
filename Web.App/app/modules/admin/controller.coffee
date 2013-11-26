application = require 'application'
vent = require 'vent'
settings = require 'settings'
Event = require '../../models/event'
Session = require '../../models/session'
User = require '../../models/user'
Role = require '../../models/role'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'admin controller init'

    application.addInitializer (options) =>

      @events = new Event.Collection()
      @sessions = new Session.Collection()
      @users = new User.Collection()
      @roles = new Role.Collection()

      vent.on 'save:users', =>
        @onSaveUsers()

  showEventsEdit: ->
    @events.fetch(
      reload: true
      data:
        filter: 'all'
    ).done (models) ->
      vent.trigger 'set:active:header', 'admin:events:edit', application.resources.key('Title_Events'), 'bookmark'
      View = require './views/events-edit-view'
      view = new View(collection: models, resources: application.resources)
      application.layout.content.show(view)

  showSessionsEdit: (id) ->
    @events.fetch(
      data:
        filter: 'all'
    ).done (events) =>
      settings.set('active-event', id)

      @sessions.fetch(
        reload: true
      ).done (sessions) =>
        vent.trigger 'set:active:header', 'admin:events:edit', application.resources.key('Title_Sessions'), 'comment'
        View = require './views/sessions-edit-view'
        view = new View(model: events.get(id), collection: sessions, resources: application.resources)
        application.layout.content.show(view)

  showUsersEdit: =>
    @roles.fetch(
      reload: true
    ).done (roles) =>
      @users.fetch(
        reload: true
        data:
          filter: 'all'
      ).done (users) =>
        vent.trigger 'set:active:header', 'admin:users:edit', application.resources.key('Title_Admin_Users'), 'user' #
        users.on 'change', (model) =>
          console.log 'user change:', model
          model.credentials = users.credentials
          model.set('dirty', true, silent: true)
        View = require './views/users-edit-view'
        view = new View(collection: users, roles: roles, resources: application.resources)
        application.layout.content.show(view)

  onSaveUsers: =>
    @users.each (model) ->
      if model.get('dirty') and model.get('name') isnt ''
        model.save null,
          success: (model, response, options) ->
            model.set('dirty', false, silent: true)
          error: (model, xhr, options) ->
            console.warn 'user save error', model

  onClose: ->
    console.log 'admin controller close'