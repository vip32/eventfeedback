application = require 'application'
config = require 'config'
vent = require 'vent'
settings = require 'settings'
Event = require '../../models/event'
Feedback = require '../../models/feedback'
FeedbackDefinition = require '../../models/feedbackdefinition'
Session = require '../../models/session'
EventReport = require '../../models/eventreport'
EventTag = require '../../models/eventtag'
user = require 'user'

module.exports = class Controller extends Backbone.Marionette.Controller
  
  resourceFilter: if user.isAdministrator() then 'all' else ''
  
  constructor: (options) ->
    log 'event controller init'

    application.addInitializer (options) =>

      @events = new Event.Collection()
      @feedbacks = new Feedback.Collection()
      @feedbackdefinitions = new FeedbackDefinition.Collection()
      @sessions = new Session.Collection()
      @eventreports = new EventReport.Collection()
      @eventtags= new EventTag.Collection()

      vent.on 'feedback:save', (feedback) =>
        @saveFeedback feedback

  showEventsIndex: ->
    vent.trigger 'fetch:done' # switch off block
    @events.fetch(
      reload: true # needed after login, otherwise FAIL on fetch
      data: filter: @resourceFilter
    ).done (models) =>
      @feedbacks.fetch(
          # reload: true
      ).done (feedbacks) =>
        vent.trigger 'set:active:header', 'events:index', application.resources.key('Title_Events'), 'glyphicon-bookmark'
        View = require './views/events-index-view'
        view = new View(collection: models, resources: application.resources)
        application.layout.content.show(view)

  showEventDetails: (id) ->
    @events.fetch(
      data: filter: @resourceFilter
    ).done (models) =>
      event = models.get(id)
      if not event?
        vent.trigger 'message:error:show', 'event not found'
      else
        vent.trigger 'set:active:header', 'events:index', event.get('title'), 'glyphicon-bookmark'
        settings.set('active-event', id)

        @eventtags.fetch(
          reload: true
        ).done (tags) =>
          @sessions.fetch(
            reload: true
          ).done (sessions) =>

            # check if each session has feedback, expects feedbacks to be fetched
            @sessions.each (session) =>
              commented = @feedbacks.find (item) ->
                (session.get('id') is item.get('sessionId')) and item.get('active')
              session.set('commented', commented?)
            console.log '==========>', @sessions

            View = require './views/event-details-view'
            view = new View(model: event, collection: sessions, tags: tags, resources: application.resources)
            application.layout.content.show(view)
  
  showEventsNew: ->
    @showEventEdit()
  
  showEventEdit: (id) ->
    @events.fetch(
      data: filter: @resourceFilter
    ).done (models) =>
      event = models.get(id)
      if not event?
        event = new Event.Model(active: true)
        @events.add event
      vent.trigger 'set:active:header', 'events:index', 'edit', 'glyphicon-bookmark'
      @feedbackdefinitions.fetch(
          reload: true
        ).done (definitions) =>
        View = require './views/event-edit-view'
        view = new View(model: event, collection: @events, definitions: definitions, resources: application.resources)
        application.layout.content.show(view)
            
  showEventReport: (id) ->
    settings.set('active-event', id)
    @eventreports.fetch(
      reload: true
      data: filter: @resourceFilter
    ).done (models) =>
      event = models.first()
      if not event?
        vent.trigger 'message:error:show', 'event not found'
      else
        vent.trigger 'set:active:header', 'events:index', event.get('title'), 'bookmark'

      View = require './views/event-report-view'
      view = new View(model: event, resources: application.resources)
      application.layout.content.show(view)

  showSessionDetails: (id) ->
    @sessions.fetch().done (models) =>
      session = models.get(id)
      if not session?
        vent.trigger 'message:error:show', 'session not found'
      else
        vent.trigger 'set:active:header', 'events:index', session.get('title'), 'icon-comment'
        settings.set('active-session', id)

        # prepare the feedback for this session, expects feedbacks to be fetched
        feedback = @feedbacks.find (item) ->
          item.get('sessionId') is id
        if not feedback?
          feedback = new Feedback.Model(sessionId: id, feedbackDefinitionId: session.get('feedbackDefinitionId'))
          feedback.set('active', false)
          @feedbacks.add(feedback)

        View = require './views/session-details-view'
        view = new View(model: session, feedback: feedback, resources: application.resources)
        application.layout.content.show(view)

  saveFeedback: (feedback) ->
    feedback.credentials = @feedbacks.credentials
    vent.trigger 'fetch:start'
    feedback.save null,
      success: (model, response, options) =>
        vent.trigger 'message:success:show', application.resources.key('Feedback_Saved_Success')
        vent.trigger 'fetch:done'
        vent.trigger 'event:details', settings.get('active-event')
      error: (model, xhr, options) =>
        vent.trigger 'message:error:show', application.resources.key('Feedback_Saved_Failed')
        vent.trigger 'fetch:fail'
    
  onClose: ->
    log 'event controller close'