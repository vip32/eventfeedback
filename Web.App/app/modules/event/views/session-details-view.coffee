application = require 'application'
vent = require 'vent'

module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/session-details'
  events:
    'click .js-submit': 'onSubmit'
    'click .js-remove': 'onRemove'
    'change textarea': 'onChange'
    'input textarea': 'onChange'

  initialize: (options) ->
    @resources = options?.resources
    @feedback = options?.feedback
    vent.trigger 'navigation:back:on'
    vent.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    feedback: @feedback?.toJSON()
    feedbackdefinition: @model.get('feedbackDefinition')

  onBack: =>
    log 'back from session-details'
    vent.trigger 'event:details', @model.get('eventId')

  onShow: ->
    scrollTo(0,0)
    for id in [0..9]
      $("#rateit#{id}").rateit()
    $('textarea').autosize()

  onChange: (e) ->
    maxlength = $(e.currentTarget).attr('data-maxlength')
    if maxlength > 0 and $(e.currentTarget).val().length > maxlength
      $(e.currentTarget).val($(e.currentTarget).val().substring(0, maxlength));

  onRemove: (e) ->
    e.preventDefault()
    # TODO: remove feedback from api
    
  onSubmit: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(@)
    # vent.trigger 'view:feedback:do', data
    @feedback.set('active', true)
    @feedback.set('answer0', data.answer0) # TODO: optimize this with unserscore (merge 2 objects)
    @feedback.set('answer1', data.answer1)
    @feedback.set('answer2', data.answer2)
    @feedback.set('answer3', data.answer3)
    @feedback.set('answer4', data.answer4)
    @feedback.set('answer5', data.answer5)
    @feedback.set('answer6', data.answer6)
    @feedback.set('answer7', data.answer7)
    @feedback.set('answer8', data.answer8)
    @feedback.set('answer9', data.answer9)
    vent.trigger 'feedback:save', @feedback

  onClose: ->
    vent.off 'navigation:back', @onBack
    log 'session-details view close'