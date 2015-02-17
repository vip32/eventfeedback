application = require 'application'
vent = require 'vent'
settings = require 'settings'
user = require 'user'
config = require 'config'

module.exports = class AboutView extends Backbone.Marionette.ItemView
  id: 'about-view'
  template: require  './templates/about'
  events:
    'click .js-reset': 'onReset'
    'click .js-signout': 'onSignout'

  initialize: (options) ->
    vent.trigger 'navigation:back:off'
  
  serializeData: ->
    resources: @resources?.toJSON()
    user: user.name()
    roles: user.roles()
    admin: user.isAdministrator()
    auth: user.isAuthenticated()
    help: "#{config.approot}help"  
    swagger: "#{config.approot}swagger"  
    apiinfo: "#{config.apiroot}/lookup/apiinfo"  
    
  onShow: ->
    scrollTo(0,0)
    
  onSignout: ->
    vent.trigger 'signout:index'
    
  onReset: (e) ->
    e.preventDefault()
    user.reset()
    settings.destroy()
    vent.trigger 'home:index'
    vent.trigger 'header:refresh' 
    
  onClose: ->
    log 'about view close'