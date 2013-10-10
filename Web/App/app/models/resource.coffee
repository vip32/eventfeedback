config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'

module.exports.Model = class Resource extends Model


module.exports.Collection = class ResourceCollection extends Collection

  url: "#{config.apiroot}/resources"
  credentials:
    username: 'admin'
    password: 'admin'
  model: module.exports.Model
  comparator: 'key'

  toJSON: ->
    result = {}
    @each (model) ->
      result[model.get('key')] = model.get('value')
    return result

