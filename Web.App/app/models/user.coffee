config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Account extends Model


module.exports.Collection = class UsersCollection extends Collection

  url: "#{config.apiroot}/admin/users"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
  comparator: 'username'