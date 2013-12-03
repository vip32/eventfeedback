app = require 'application'
config = require 'config'

$ ->
  $.ajaxSetup(timeout:config.apitimeout)
  $.blockUI.defaults.fadeIn = 50
  $.blockUI.defaults.fadeOut = 150
  FastClick.attach(document.body)
  app.initialize()