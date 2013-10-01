module.exports = class ContactDetailsView extends Backbone.Marionette.ItemView
  id: 'contact-details-view'
  template: require './templates/contact-details'

  initialize: (options) ->
    console.log 'contact id', options

