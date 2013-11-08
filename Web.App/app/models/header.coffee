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

  visible: ->
    authenticated = settings.getValueOrDefault('api_authenticated', false)
    filtered = @filter((item) =>
      itemAuthenticated = item.get("authenticated") ? false
      if itemAuthenticated is true and authenticated is true
        return true
      if itemAuthenticated is false and authenticated is true
        return true
      if itemAuthenticated is false and authenticated is false
        return true
    )
    new HeadersCollection(filtered)

module.exports.TestData = class TestData

  addTo: (collection) ->
    # add the data items to the provided collection if its empty
    if collection.size() is 0
      collection.reset(@data)

  data: [
    id: "511b8984-8958-663d-4707-9378aa71776b"
    visible: true
    authenticated: false
    resource: 'Title_Home'
    glyphicon: 'home'
    title: "Home"
    trigger: "home:index"
    intern: true
    order: 0
  ,
    id: "ce82ceb6-1104-aaa6-4fab-a4656694de17"
    title: "About"
    authenticated: false
    resource: 'Title_About'
    glyphicon: 'info-sign'
    trigger: "about:index"
    intern: true
    order: 3
  ,
    id: "1cf247f4-4c76-d453-bbec-1c40080e32e4"
    title: "Events"
    authenticated: true
    resource: 'Title_Events'
    glyphicon: 'bookmark'
    trigger: "events:index"
    intern: true
    order: 1
  # ,
  #   id: "1cf247f4-4c76-d453-bbec-1c40080e32e1"
  #   title: "Sessions"
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
    glyphicon: 'user'
    trigger: "signin:index"
    intern: true
    order: 4
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4"
    title: "Debug"
    authenticated: false
    resource: 'Title_Debug'
    glyphicon: 'cog'
    trigger: "debug:index"
    intern: true
    order: 5
  ]