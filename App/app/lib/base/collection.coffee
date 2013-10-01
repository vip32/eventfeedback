# Base class for all collections.
module.exports = class Collection extends Backbone.Collection

  destroyAll: ->
    promises = []

    while @models.length > 0
      promises.push(this.models[0].destroy())

    # handle errors communicating with the server
    $.when(promises).fail (response) ->
      @trigger('syncError', response)