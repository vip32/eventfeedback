application = require 'application'
vent = require 'vent'
settings = require 'settings'

module.exports = class AboutView extends Backbone.Marionette.ItemView
  id: 'about-view'
  template: require  './templates/about'
  events:
    'click .js-reset': 'onReset'

  initialize: (options) ->
    vent.trigger 'navigation:back:off'
  
  onShow: ->
    scrollTo(0,0)
    
  onReset: (e) ->
    e.preventDefault()
    settings.destroy()
    vent.trigger 'home:index'
    vent.trigger 'resources:loaded' # resets the header + nav
    
  onClose: ->
    console.log 'about view close'