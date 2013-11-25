app = require 'application'

$ ->
  $.ajaxSetup(timeout:8000)
  $.blockUI.defaults.fadeOut = 50
  $.blockUI.defaults.fadeIn = 50
  FastClick.attach(document.body)
  app.initialize()