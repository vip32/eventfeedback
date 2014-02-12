application = require 'application'
vent = require 'vent'
settings = require 'settings'
ItemView = require '../../../../lib/base/item-view'

module.exports = class UsersGeneratorItemView extends Backbone.Marionette.ItemView
  id: 'users-generator-item-view'
  template: require './templates/users-generator-item'
  tagName: 'div'
  className: 'list-group-item'
  
  initialize: (options) ->
    @resources = options?.resources

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()