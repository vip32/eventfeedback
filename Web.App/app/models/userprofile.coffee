config = require '../config'
Model = require '../lib/base/model'
settings = require '../settings'
user = require 'user'

module.exports.Model = class UserProfile extends Model
  urlRoot: ->
    "#{config.apiroot}/user/profile"
  credentials: ->
    token: user.token()