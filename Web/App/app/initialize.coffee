app = require 'application'

# redirect to https if protocol is http
if window.location.protocol isnt "https:"
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length)

$ ->
  FastClick.attach(document.body)
  app.initialize()