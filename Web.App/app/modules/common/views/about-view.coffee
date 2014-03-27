application = require 'application'
vent = require 'vent'
settings = require 'settings'
user = require 'user'

module.exports = class AboutView extends Backbone.Marionette.ItemView
  id: 'about-view'
  template: require  './templates/about'
  events:
    'click .js-reset': 'onReset'

  initialize: (options) ->
    vent.trigger 'navigation:back:off'
  
  serializeData: ->
    resources: @resources?.toJSON()
    user: user.name()
    roles: user.roles()
    admin: user.isAdministrator()
    auth: user.isAuthenticated()
    
  onShow: ->
    scrollTo(0,0)
    
  onReset: (e) ->
    e.preventDefault()
    user.reset()
    settings.destroy()
    vent.trigger 'home:index'
    vent.trigger 'resources:loaded' # resets the header + nav
    
  onClose: ->
    log 'about view close'