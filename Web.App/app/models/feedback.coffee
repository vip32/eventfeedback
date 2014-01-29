config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Feedback extends Model


module.exports.Collection = class FeedbacksCollection extends Collection

  url: "#{config.apiroot}/feedbacks"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
