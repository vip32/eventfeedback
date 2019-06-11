application = require 'application'
vent = require 'vent'

module.exports = class UsersGeneratorView extends Backbone.Marionette.CompositeView
  id: 'users-generator-view'
  template: require './templates/users-generator'
  itemView: require './users-generator-item-view'
  itemViewContainer: '#js-users'
  events:
    'click #js-generate': 'onGenerate'
    'click #js-clear': 'onClear'
    'click #js-print': 'onPrintClick'

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
    
  onClear: (e) ->
    e.preventDefault()
    @collection.reset()
    
  onGenerate: (e) ->
    e.preventDefault()
    @collection.reset()
    data = Backbone.Syphon.serialize(@)
    
    # add by names
    for i in data.accountnames.split(';')
      if i.trim() isnt ""
        @collection.add
          userName: data.prefix + i.trim()
          password: @makeId()
          roles: data.roles
          message: data.message
          activefrom: data.activefrom
          activetill: data.activetill
          active: true
          dirty: true
    
    # add by amount
    if data.amount > 0
      for i in [1..data.amount]
        @collection.add
          userName: data.prefix + @makeId()
          password: @makeId()
          roles: data.roles
          message: data.message
          activefrom: data.activefrom
          activetill: data.activetill
          active: true
          dirty: true
    vent.trigger 'save:users'
    
  onPrintClick: (e) ->
    e.preventDefault()
    #  add a page-break after every 4th element
    $('#js-users .list-group-item:nth-child(4n)').css('page-break-after', 'always')
    # setup the user list for printing
    css = '<link href="www/stylesheets/app.css" rel="stylesheet" type="text/css">'
    window.frames["print_frame"].document.body.innerHTML= css + document.getElementById("js-users").innerHTML
    window.frames["print_frame"].window.focus()
    window.frames["print_frame"].window.print()
    
  makeId: ->
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
    
  #onBack: =>
  #  vent.trigger 'admin:users:edit'

  onClose: ->
    #vent.off 'navigation:back', @onBack
    log 'user-generator view close'
