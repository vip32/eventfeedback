config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require '../settings'
user = require 'user'

module.exports.Model = class Session extends Model

module.exports.Collection = class SessionsCollection extends Collection

  url: ->
    "#{config.apiroot}/events/#{settings.get('active-event')}/sessions"
  credentials: ->
    token: user.token()
  model: module.exports.Model
  
  filterForTag: (tag) -> 
    @filter (model) -> 
      (_.contains model.get('tags'), tag) or (_.isEmpty(model.get('tags')))