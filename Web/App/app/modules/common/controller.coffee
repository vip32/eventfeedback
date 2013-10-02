application = require 'application'

module.exports = class Controller extends Backbone.Marionette.Controller

  constructor: (options) ->
    console.log 'about controller init'

  showHome: ->
    view = new (require './views/home-view')
    application.layout.content.show(view)

  showSignin: ->
    # application.execute('set:active:header', 'sign-in')
    view = new (require './views/signin-view')
    application.layout.content.show(view)

  showAbout: ->
    view = new (require './views/about-view')
    application.layout.content.show(view)

  showDebug: ->
    view = new (require './views/debug-view')
    application.layout.content.show(view)

  onClose: ->
    console.log 'about controller close'
