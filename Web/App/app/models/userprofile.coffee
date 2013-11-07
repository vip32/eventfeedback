config = require '../config'
Model = require '../lib/base/model'
settings = require '../settings'

module.exports.Model = class UserProfile extends Model
  urlRoot: ->
    "#{config.apiroot}/user/profile"
  credentials: ->
    token: settings.get('api_token')