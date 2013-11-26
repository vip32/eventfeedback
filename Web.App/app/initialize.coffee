app = require 'application'

$ ->
  $.ajaxSetup(timeout:30000)
  $.blockUI.defaults.fadeOut = 250
  $.blockUI.defaults.fadeIn = 250
  FastClick.attach(document.body)
  app.initialize()