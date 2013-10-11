application = require 'application'

module.exports = class AboutView extends Backbone.Marionette.ItemView
  id: 'about-view'
  template: require  './templates/about'

  initialize: (options) ->
    application.trigger 'navigation:back:off'

  onClose: ->
    console.log 'about view close'

