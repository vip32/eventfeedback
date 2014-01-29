application = require 'application'
config = require 'config'
vent = require 'vent'
settings = require 'settings'
Event = require '../../models/event'
Feedback = require '../../models/feedback'
Session = require '../../models/session'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'event controller init'

    application.addInitializer (options) =>

      @events = new Event.Collection()
      @feedbacks = new Feedback.Collection()
      @sessions = new Session.Collection()
      
      vent.on 'feedback:save', (feedback) =>
        @saveFeedback feedback

  showEventsIndex: ->
    @events.fetch(
      reload: true # needed after login, otherwise FAIL on fetch
      data:
        filter: 'all'
    ).done (models) =>
      @feedbacks.fetch(
          # reload: true
      ).done (feedbacks) =>
        vent.trigger 'set:active:header', 'events:index', application.resources.key('Title_Events'), 'bookmark'
        View = require './views/events-index-view'
        view = new View(collection: models, resources: application.resources)
        application.layout.content.show(view)
    # .fail ->
    #   vent.trigger config.signintrigger

  showEventDetails: (id) ->
    @events.fetch(
      data:
        filter: 'all'
    ).done (models) =>
      event = models.get(id)
      if not event?
        vent.trigger 'message:error:show', 'event not found'
      else
        vent.trigger 'set:active:header', 'events:index', event.get('title'), 'bookmark'
        settings.set('active-event', id)

        @sessions.fetch(
          reload: true
        ).done (sessions) =>
          View = require './views/event-details-view'
          view = new View(model: event, collection: sessions, resources: application.resources)
          application.layout.content.show(view)

  showSessionDetails: (id) ->
    @sessions.fetch().done (models) =>
      session = models.get(id)
      if not session?
        vent.trigger 'message:error:show', 'session not found'
      else  
        vent.trigger 'set:active:header', 'events:index', session.get('title'), 'comment'
        settings.set('active-session', id)
      
        # prepare the feedback for this session
        feedback = @feedbacks.find (item) -> 
          item.get('sessionId') is id
        if not feedback?
          feedback = new Feedback.Model(sessionId: id, feedbackDefinitionId: session.get('feedbackDefinitionId'))
          @feedbacks.add(feedback)
      
        View = require './views/session-details-view'
        view = new View(model: session, feedback: feedback, resources: application.resources)
        application.layout.content.show(view)
        
  saveFeedback: (feedback) ->
    feedback.credentials = @feedbacks.credentials
    console.log 'saved', feedback
    feedback.save null,
      success: (model, response, options) =>
        vent.trigger 'message:success:show', application.resources.key('Feedback_Saved_Success')
        application.trigger 'event:details', settings.get('active-event')
      error: (model, xhr, options) =>
        vent.trigger 'message:error:show', application.resources.key('Feedback_Saved_Failed')

  onClose: ->
    console.log 'event controller close'