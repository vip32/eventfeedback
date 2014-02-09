application = require 'application'
vent = require 'vent'

module.exports = class UsersGeneratorView extends Backbone.Marionette.CompositeView
  id: 'users-generator-view'
  template: require './templates/users-generator'
  itemView: require './users-generator-item-view'
  itemViewContainer: '.js-users'
  application.trigger 'navigation:back:on'
  application.on 'navigation:back', @onBack
  events:
    'click #js-generate': 'onGenerate'

  initialize: (options) ->
    @resources = options?.resources
    @roles = options?.roles
   
  serializeData: ->
    resources: @resources?.toJSON()
    roles: @roles?.pluck('name')
    
  itemViewOptions: ->
    resources: @resources

  onShow: ->
    scrollTo(0,0)
    
  onGenerate: (e) ->
    e.preventDefault()
    @collection.reset()
    data = Backbone.Syphon.serialize(@)
    for i in [1..data.amount]
      @collection.add
        userName: data.prefix + @makeid() + i
        password: @makeid()
        roles: data.roles
        active: true
        dirty: true
    console.log 'new users', @collection
    vent.trigger 'save:users'
    
  makeid: ->
    text = ''
    possible = 'abcdefghjkmnpqrstuvwxy23456789'
    i = 0
    while i < 5
      text += possible.charAt(Math.floor(Math.random() * possible.length))
      i++
    text
    
  onSave: ->
    vent.trigger 'save:users'
    # TODO: button > trigger event for controller to save all 'dirty' models
    
  onBack: =>
    application.trigger 'admin:users:edit'
