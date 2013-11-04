config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'

module.exports.Model = class Event extends Model


module.exports.Collection = class EventsCollection extends Collection

  url: "#{config.apiroot}/events"
  credentials:
    username: 'admin'
    password: 'adminadmin'
  model: module.exports.Model
  comparator: 'title'