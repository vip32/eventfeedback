config = require '../config'
Model = require '../lib/base/model'
settings = require '../settings'

module.exports.Model = class UserToken extends Model
  urlRoot: ->
    "#{config.apiroot}/user/token"