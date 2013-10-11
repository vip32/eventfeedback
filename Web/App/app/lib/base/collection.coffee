vent = require 'vent'

# Base class for all collections.
module.exports = class Collection extends Backbone.Collection

  destroyAll: ->
    promises = []

    while @models.length > 0
      promises.push(this.models[0].destroy())

    # handle errors communicating with the server
    $.when(promises).fail (response) ->
      @trigger('syncError', response)

  fetch: (options) ->
    console.log 'fetch:start', @constructor.name
    @trigger 'fetch:start'
    vent.trigger 'fetch:start'
    super(options)
      .done (models) ->
        @trigger 'fetch:done'
        vent.trigger 'fetch:done'
        console.log 'fetch:off', @constructor.name
      .fail (models) ->
        vent.trigger 'fetch:fail'
        console.log 'fetch:fail', @constructor.name