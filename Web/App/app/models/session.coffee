config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require '../settings'

module.exports.Model = class Contact extends Model


module.exports.Collection = class SessionsCollection extends Collection

  url: ->
    "#{config.apiroot}/events/#{settings.get('active-event')}/sessions"
  credentials:
    username: 'admin'
    password: 'admin'
  model: module.exports.Model
  comparator: 'title'