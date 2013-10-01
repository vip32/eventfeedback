module.exports = class AboutView extends Backbone.Marionette.ItemView
  id: 'about-view'
  template: require  './templates/about'

  onClose: ->
    console.log 'about view close'

