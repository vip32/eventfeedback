module.exports = class Controller extends Backbone.Marionette.Controller

  parseParams: (params) ->
    options = {}
    if params and params.trim() isnt ''
      params = params.split('&')
      _.each params, (param) ->
        values = param.split('=')
        if values[1]
            options[values[0]] = values[1]
    return options