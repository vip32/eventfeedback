application = require 'application'
Contact = require '../../../models/contact'

module.exports = class ContactIndexView extends Backbone.Marionette.CompositeView
  id: 'contact-index-view'
  template: require './templates/contacts-index'
  itemView: require './contact-item-view'
  itemViewContainer: '.js-contacts'

  events:
    'click .js-add': 'onAdd'
    'click .js-reset': 'onReset'

  onAdd: (e) ->
    application.trigger 'contact:add', new Contact.Model(Backbone.Syphon.serialize(@))
    @$el.find('input[type=text]').val('') # clear the form
    e.preventDefault()

  onReset: (e) ->
    if confirm('Reset?')
      application.trigger 'contact:reset'
    e.preventDefault()

  onClose: ->
    console.log 'contacts-index view close'