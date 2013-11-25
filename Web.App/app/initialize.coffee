app = require 'application'

$ ->
  $.ajaxSetup(timeout:8000)
  FastClick.attach(document.body)
  app.initialize()