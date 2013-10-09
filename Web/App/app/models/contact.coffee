Model = require '../lib/base/model'
Collection = require '../lib/base/collection'

module.exports.Model = class Contact extends Model

  urlRoot: "contacts"
  defaults:
    firstName: ''
    lastName: ''
    phoneNumber: ''

  validate: (attrs, options) ->
    errors = {}
    if _.isEmpty(attrs.firstName)
      errors.firstName = "can't be blank"
    if _.isEmpty(attrs.lastName)
      errors.lastName = "can't be blank"
    else
      if attrs.lastName.length < 2
        errors.lastName = "is too short"

    if not _.isEmpty(errors)
      return errors;


module.exports.Collection = class ContactsCollection extends Collection

  localStorage: new Backbone.LocalStorage("contacts")
  credentials:
    username: 'admin'
    password: 'admin'
  model: module.exports.Model
  comparator: 'firstName'


module.exports.TestData = class TestData

  addTo: (collection) ->
    # add the data items to the provided collection if its empty
    if collection.size() is 0
      collection.reset(@data)
      # save all new models to the collection
      collection.forEach (model) ->
        model.save()

  data: [
    id: "ce82ceb6-1104-aaa6-4fab-a4656694de17"
    firstName: "Alice"
    lastName: "Arten"
    phoneNumber: "555-0184"
  ,
    id: "9cf247f4-4c76-d453-bbec-1c40080e32e5"
    firstName: "Bob"
    lastName: "Brigham"
    phoneNumber: "555-0163"
  ,
    id: "511b8984-8958-663d-4707-9378aa71776b"
    firstName: "Charlie"
    lastName: "Campbell"
    phoneNumber: "555-0129"
  ,
    id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5"
    firstName: "Amy"
    lastName: "Campbell"
    phoneNumber: "555-0130"
  ]