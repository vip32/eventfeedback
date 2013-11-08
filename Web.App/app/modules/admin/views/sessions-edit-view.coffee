application = require 'application'
vent = require 'vent'

module.exports = class SessionsEditView extends Backbone.Marionette.ItemView
  id: 'sessions-edit-view'
  template: require './templates/sessions-edit'

  initialize: (options) ->
    @resources = options?.resources

