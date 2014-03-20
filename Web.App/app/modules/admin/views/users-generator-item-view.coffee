application = require 'application'
vent = require 'vent'
config = require 'config'
settings = require 'settings'
ItemView = require '../../../../lib/base/item-view'

module.exports = class UsersGeneratorItemView extends Backbone.Marionette.ItemView
  id: 'users-generator-item-view'
  template: require './templates/users-generator-item'
  tagName: 'div'
  className: 'list-group-item'
  
  initialize: (options) ->
    @resources = options?.resources

  serializeData: ->
    resources: @resources?.toJSON()
    model: @model.toJSON()
    title: config.apptitle
    url: config.url
    
  onShow: ->
    url = "#{config.url}/index.html#signin?u=#{@model.get('userName')}&p=#{@model.get('password')}"
    $("#qrlink#{@model.get('userName')}").attr('href', url)
    new QRCode "qr#{@model.get('userName')}", 
      text: url
      width: 128
      height: 128
      colorDark : "#000000"
      colorLight : "#ffffff"
      correctLevel : QRCode.CorrectLevel.H