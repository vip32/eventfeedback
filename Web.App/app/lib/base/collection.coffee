vent = require 'vent'
config = require 'config'

# Base class for all collections.
module.exports = class Collection extends Backbone.Collection

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
      vent.trigger config.signintrigger
    else
      console.warn 'UNKNOWN', error
      vent.trigger 'sync:fail:unknown', error

  destroyAll: ->
    promises = []

    while @models.length > 0
      promises.push(this.models[0].destroy())

    # handle errors communicating with the server
    $.when(promises).fail (response) ->
      @trigger('syncError', response)

  fetch: (options) ->
    log 'fetch:start', @constructor.name
    @trigger 'fetch:start'
    vent.trigger 'fetch:start'
    super(options)
      .done (collection, response, options) ->
        @trigger 'fetch:done'
        vent.trigger 'fetch:done'
        log 'fetch:done', @constructor.name, collection, response, options
      .fail (collection, response, options) ->
        vent.trigger 'fetch:fail'
        # vent.trigger 'message:error:show', 'fetch failed'
        console.warn  'fetch:fail', @constructor.name, collection, response, options