config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class FeedbackDefinition extends Model


module.exports.Collection = class FeedbackDefinitionsCollection extends Collection

  url: "#{config.apiroot}/feedbackdefinitions"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
  comparator: 'title'