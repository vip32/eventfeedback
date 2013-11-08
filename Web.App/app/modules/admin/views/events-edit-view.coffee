application = require 'application'
vent = require 'vent'

module.exports = class EventsEditView extends Backbone.Marionette.ItemView
  id: 'events-edit-view'
  template: require './templates/events-edit'

  initialize: (options) ->
    @resources = options?.resources

