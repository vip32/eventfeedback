application = require 'application'
vent = require 'vent'

module.exports = class AboutView extends Backbone.Marionette.ItemView
  id: 'about-view'
  template: require  './templates/about'

  initialize: (options) ->
    application.trigger 'navigation:back:off'
  
  onShow: ->
    scrollTo(0,0)
    
  onClose: ->
    console.log 'about view close'

