config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require '../settings'

module.exports.Model = class Session extends Model

module.exports.Collection = class SessionsCollection extends Collection

  url: ->
    "#{config.apiroot}/events/#{settings.get('active-event')}/sessions"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
  comparator: 'title'
  
  filterForTag: (tag) -> 
    @filter (model) -> 
      _.contains model.get('tags'), tag