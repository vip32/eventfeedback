config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'
user = require 'user'

module.exports.Model = class User extends Model


module.exports.Collection = class UsersCollection extends Collection

  url: "#{config.apiroot}/admin/users"
  credentials: ->
    token: user.token()
  model: module.exports.Model
  comparator: 'name'