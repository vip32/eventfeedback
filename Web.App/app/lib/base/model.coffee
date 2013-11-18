vent = require 'vent'

# Base class for all models.
module.exports = class Model extends Backbone.Model

  initialize: (attributes, options) ->
    @bind("error", @errorHandler)

  errorHandler: (model, error) ->
    if error.status is 404
      console.warn 'NOTFOUND', error
      vent.trigger 'sync:fail:notfound', error
    if error.status is 500
      console.warn 'SERVERERROR', error
      vent.trigger 'sync:fail:servererror', error
    else if error.status is 401 or error.status is 403
      console.warn 'UNAUTHORIZED', error
      vent.trigger 'sync:fail:unauthorized', error
    else
      console.warn 'UNKNOWN', error
      vent.trigger 'sync:fail:unknown', error