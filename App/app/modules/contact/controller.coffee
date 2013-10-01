application = require 'application'
Contact = require '../../models/contact'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'contact controller init'

    application.addInitializer (options) =>

      application.on 'contacts:index', =>
        application.navigate 'contacts'

      application.on 'contact:details', (id) =>
        application.navigate 'contacts/' + id

      application.on 'contact:add', (data) =>
        @addContact(data)

      application.on 'contact:reset', (data) =>
        @contacts.destroyAll()

      @contacts = new Contact.Collection()
      @contacts.fetch().done =>
        new Contact.TestData().addTo(@contacts)

  showContactsIndex: ->
    @contacts.fetch().done (models) ->
      View = require './views/contacts-index-view'
      view = new View(collection: models)
      application.layout.content.show(view)

  addContact: (model) ->
    console.log 'controller:addNewContact', model

    if model.isValid()
      @contacts.add(model)
      model.save()
      application.layout.content.currentView.render()
      # find the new viewitem by model and flash the item
      itemView = application.layout.content.currentView.children?.findByModel(model)
      itemView?.flash('success')
    else
      console.warn model.validationError

  showContactDetails: (id) ->
    @contacts.fetch().done (models) ->
      View = require './views/contact-details-view'
      view = new View(model: models.get(id))
      application.layout.content.show(view)

  onClose: ->
    console.log 'contact controller close'