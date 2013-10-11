module.exports = class SigninView extends Backbone.Marionette.ItemView
  id: 'signin-view'
  template: require './templates/signin'
  events:
    'click .js-signin': 'onSignin'

  onSignin: (e) ->
    e.preventDefault()

  onShow: ->
    $('.make-switch').bootstrapSwitch()

  onClose: ->
    console.log 'signin view close'
