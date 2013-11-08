application = require 'application'
vent = require 'vent'

module.exports = class UsersEditView extends Backbone.Marionette.ItemView
  id: 'users-edit-view'
  template: require './templates/users-edit'

  initialize: (options) ->
    @resources = options?.resources

