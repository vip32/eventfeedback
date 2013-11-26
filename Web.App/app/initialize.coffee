app = require 'application'

$ ->
  $.ajaxSetup(timeout:30000)
  $.blockUI.defaults.fadeOut = 150
  $.blockUI.defaults.fadeIn = 50
  FastClick.attach(document.body)
  app.initialize()