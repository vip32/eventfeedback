Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'

module.exports.Model = class Header extends Model

  defaults:
    title: ''
    href: ''
    intern: true


module.exports.Collection = class HeadersCollection extends Collection

  url: 'headers'
  model: module.exports.Model
  comparator: 'order'

  active: (roles) ->
    filtered = @filter (item) =>
      log 'header:item', item.get('title'), item.get('roles'), '>', roles
      visible = item.get('visible') ? true
      return true if visible and _.isEmpty(item.get('roles'))
      return true if visible and not _.isEmpty(roles) and _.intersection(roles, item.get('roles')).length > 0

    log 'header:filtered', filtered
    new HeadersCollection(filtered)

module.exports.TestData = class TestData

  addTo: (collection) ->
    # add the data items to the provided collection if its empty
    if collection.size() is 0
      collection.reset(@data)

  data: [
    id: "511b8984-8958-663d-4707-9378aa71776b"
    visible: true
    authenticated: false,
    resource: 'Title_Home'
    glyphicon: 'glyphicon-home'
    title: "Home"
    trigger: "home:index"
    intern: true
    order: 0
  ,
    id: "ce82ceb6-1104-aaa6-4fab-a4656694de17"
    title: "About"
    authenticated: false
    resource: 'Title_About'
    glyphicon: 'glyphicon-info-sign'
    trigger: "about:index"
    intern: true
    order: 3
  ,
    id: "1cf247f4-4c76-d453-bbec-1c40080e32e4"
    title: "Events"
    authenticated: true
    roles: ['User', 'Administrator']
    resource: 'Title_Events'
    glyphicon: 'glyphicon-bookmark'
    trigger: "events:index"
    intern: true
    order: 1
  # ,
  #   id: "1cf247f4-4c76-d453-bbec-1c40080e32e1"
  #   title: "Sessions"
  #   roles: []
  #   visible: false
  #   resource: 'Title_Sessions'
  #   glyphicon: 'comment'
  #   trigger: "sessions:index"
  #   intern: true
  #   order: 2
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5"
    title: "Sign-in"
    authenticated: false
    resource: 'Title_SignIn'
    glyphicon: 'glyphicon-user'
    trigger: "signin:index"
    intern: true
    order: 4
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4"
    title: "Debug"
    authenticated: true
    roles: ['Administrator']
    resource: 'Title_Debug'
    glyphicon: 'glyphicon-cog'
    trigger: "debug:index"
    intern: true
    order: 5
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b890"
    title: "-"
    authenticated: true
    roles: ['Administrator']
    resource: ''
    glyphicon: ''
    trigger: "-"
    intern: true
    order: 10
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f6"
    title: "Admin - Events"
    authenticated: true
    roles: ['Administrator']
    resource: ''
    glyphicon: 'glyphicon-bookmark'
    trigger: "admin:events:edit"
    intern: true
    order: 11
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f7"
    title: "Admin - Settings"
    authenticated: true
    roles: ['Administrator']
    resource: ''
    glyphicon: 'glyphicon-cog'
    trigger: "admin:settings:index"
    intern: true
    order: 12
#  ,
#    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f8"
#    title: "Admin - Reports"
#    authenticated: true
#    roles: ['Administrator']
#    resource: ''
#    glyphicon: 'glyphicon-list'
#    trigger: "admin:reports:index"
#    intern: true
#    order: 13
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f9"
    title: "Admin - Users"
    authenticated: true
    roles: ['Administrator']
    resource: ''
    glyphicon: 'glyphicon-user'
    trigger: "admin:users:generator"
    intern: true
    order: 14
#  ,
#    id: "b85fd64c-3d4a-e8f1-8f1b-1d5e6ed8b801"
#    title: "Admin - Users Generator"
#    authenticated: true
#    roles: ['Administrator']
#    resource: ''
#    glyphicon: 'glyphicon-user'
#    trigger: "admin:users:generator"
#    intern: true
#    order: 14
  ]