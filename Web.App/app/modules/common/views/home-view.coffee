application = require 'application'
vent = require 'vent'

module.exports = class HomeView extends Backbone.Marionette.ItemView
  id: 'home-view'
  template: require './templates/home'

  initialize: (options) ->
    @resources = options?.resources
    vent.trigger 'navigation:back:off'

  serializeData: ->
    resources: @resources?.toJSON()
    
  onShow: ->
    scrollTo(0,0)
    
  onClose: ->
    log 'home view close'