application = require 'application'
vent = require 'vent'

module.exports = class HomeView extends Backbone.Marionette.ItemView
  id: 'home-view'
  template: require './templates/home'

  initialize: (options) ->
    application.trigger 'navigation:back:off'

  onClose: ->
    console.log 'home view close'