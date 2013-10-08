Model = require '../lib/base/model'
Collection = require '../lib/base/collection'

module.exports.Model = class Header extends Model

  defaults:
    title: ''
    href: ''
    intern: true


module.exports.Collection = class HeadersCollection extends Collection

  url: 'headers'
  model: module.exports.Model
  comparator: 'order'


module.exports.TestData = class TestData

  addTo: (collection) ->
    # add the data items to the provided collection if its empty
    if collection.size() is 0
      collection.reset(@data)

  data: [
    id: "511b8984-8958-663d-4707-9378aa71776b"
    title: "Home"
    trigger: "home:index"
    intern: true
    order: 0
  ,
    id: "ce82ceb6-1104-aaa6-4fab-a4656694de17"
    title: "About"
    trigger: "about:index"
    intern: true
    order: 3
  ,
    id: "9cf247f4-4c76-d453-bbec-1c40080e32e5"
    title: "Contacts"
    trigger: "contacts:index"
    intern: true
    order: 1
  ,
    id: "1cf247f4-4c76-d453-bbec-1c40080e32e4"
    title: "Events"
    trigger: "events:index"
    intern: true
    order: 2
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5"
    title: "Sign-in"
    trigger: "signin:index"
    intern: true
    order: 4
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4"
    title: "Debug"
    trigger: "debug:index"
    intern: true
    order: 5
  ]