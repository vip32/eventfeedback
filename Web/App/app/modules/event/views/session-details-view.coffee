module.exports = class EventDetailsView extends Backbone.Marionette.ItemView
  id: 'session-details-view'
  template: require './templates/session-details'

  initialize: (options) ->
    console.log 'session id', options

  onShow: ->
     $('input.rating[type=number]').rating();

