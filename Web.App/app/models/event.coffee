config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'
user = require 'user'

module.exports.Model = class Event extends Model


module.exports.Collection = class EventsCollection extends Collection

  url: "#{config.apiroot}/events"
  credentials: ->
    token: user.token()
  model: module.exports.Model
  #comparator: 'title'