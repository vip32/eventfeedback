config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Event extends Model


module.exports.Collection = class EventsCollection extends Collection

  url: "#{config.apiroot}/events"
  credentials: ->
    username: settings.get('api_username')
    password: settings.get('api_password')
  model: module.exports.Model
  comparator: 'title'