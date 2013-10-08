application = require 'application'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

  showHome: ->
    application.trigger 'set:active:header', 'Home'
    view = new (require './views/home-view')
    application.layout.content.show(view)

  showSignin: ->
    application.trigger 'set:active:header', 'Sign-in'
    # application.execute('set:active:header', 'sign-in')
    view = new (require './views/signin-view')
    application.layout.content.show(view)

  showAbout: ->
    application.trigger 'set:active:header', 'About'
    view = new (require './views/about-view')
    application.layout.content.show(view)

  showDebug: ->
    application.trigger 'set:active:header', 'Debug'
    view = new (require './views/debug-view')
    application.layout.content.show(view)

  onClose: ->
    console.log 'about controller close'
