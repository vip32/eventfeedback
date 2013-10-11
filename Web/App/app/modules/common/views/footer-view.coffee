vent = require 'vent'

module.exports = class FooterView extends Backbone.Marionette.ItemView
  id: 'footer-view'
  template: require './templates/footer'