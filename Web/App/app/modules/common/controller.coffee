application = require 'application'
vent = require 'vent'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

  showHome: ->
    application.trigger 'set:active:header', 'Home'
    View = require './views/home-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showSignin: ->
    application.trigger 'set:active:header', 'Sign-in'
    # application.execute('set:active:header', 'sign-in')
    View = require './views/signin-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showAbout: ->
    application.trigger 'set:active:header', 'About'
    View = require './views/about-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  showDebug: ->
    application.trigger 'set:active:header', 'Debug'
    View = require './views/debug-view'
    view = new View(resources: application.resources)
    application.layout.content.show(view)

  onClose: ->
    console.log 'about controller close'
