config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class User extends Model


module.exports.Collection = class UsersCollection extends Collection

  url: "#{config.apiroot}/admin/users"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
  comparator: 'name'