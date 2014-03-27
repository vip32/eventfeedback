config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'
user = require 'user'

module.exports.Model = class Feedback extends Model


module.exports.Collection = class FeedbacksCollection extends Collection

  url: "#{config.apiroot}/feedbacks"
  credentials: ->
    token: user.token()
  model: module.exports.Model
