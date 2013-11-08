config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Resource extends Model


module.exports.Collection = class ResourceCollection extends Collection

  url: "#{config.apiroot}/resources"
  model: module.exports.Model
  comparator: 'key'

  key: (key) ->
    result = @find (model) =>
      console.log model.get('key'), key
      model.get('key') is key
    result?.get('value') ? ''

  toJSON: ->
    result = {}
    @each (model) ->
      result[model.get('key')] = model.get('value')
    return result

