application = require 'application'
vent = require 'vent'

module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/session-details'
  events:
    'click .js-submit': 'onSubmit'

  initialize: (options) ->
    @resources = options?.resources
    @feedback = options?.feedback
    application.trigger 'navigation:back:on'
    application.on 'navigation:back', @onBack

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    feedback: @feedback?.toJSON()
    feedbackdefinition: @model.get('feedbackDefinition')

  onBack: =>
    console.log 'back from session-details'
    application.trigger 'event:details', @model.get('eventId')

  onShow: ->
    #$('input.rating[type=number]').rating()
    for id in [0..9]
      $("#rateit#{id}").rateit()
      console.log id
    $('#rateit0').rateit()
    $('textarea').autosize()

  onSubmit: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(@)
    console.log '-------------->', data
    # vent.trigger 'view:feedback:do', data
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
    console.log '==========data:', data, @feedback
#    alert 'TODO'
    vent.trigger 'feedback:save', @feedback

  onClose: ->
    application.off 'navigation:back', @onBack
    console.log 'session-details view close'