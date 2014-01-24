config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Role extends Model


module.exports.Collection = class RolesCollection extends Collection

  url: "#{config.apiroot}/admin/roles"
  credentials: ->
    token: settings.get('api_token')
  model: module.exports.Model
  comparator: 'name' 

  toArray: ->
    roles = [["",""]]
    @each (role) =>
      roles.push [role.get('name'), role.get('name')]
    return roles