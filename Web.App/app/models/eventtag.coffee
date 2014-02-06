config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require '../settings'

module.exports.Model = class EventTag extends Model

module.exports.Collection = class EventTagsCollection extends Collection

  url: ->
    "#{config.apiroot}/lookup/tags/#{settings.get('active-event')}"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model