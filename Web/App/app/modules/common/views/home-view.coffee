application = require 'application'

module.exports = class HomeView extends Backbone.Marionette.ItemView
  id: 'home-view'
  template: require './templates/home'

  onClose: ->
    console.log 'home view close'