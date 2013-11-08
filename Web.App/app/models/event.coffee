config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Event extends Model


module.exports.Collection = class EventsCollection extends Collection

  url: "#{config.apiroot}/events"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
  comparator: 'title'