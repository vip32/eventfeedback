Store = require 'models/store'

class Settings
  ###
    encapsulates local storage (persistent)
  ###

  constructor: ->
    ### initializes this instance ###
    log 'settings store init'
    @store = new Store.Collection(name: 'settings')
    _.extend(@, Backbone.Events)
    @store.fetch
      async: false

  set: (id, value) ->
    ###
      add or opdate an item in the collection with the specified id and value.
      if the item exists the value will be updated
    ###
    @store.setValue(id, value)

  get: (id) ->
    ### get the value attribute for an item ###
    @store.getValue(id)

  getValueOrDefault: (id, val) ->
    ### get the value attribute for an item ###
    @store.getValueOrDefault(id, val)

  has: (id) ->
    ### looks through the collection for the specified id ###
    @store.has(id)
    
  destroy: (id) ->
    ### removes all (or by id) models from the collection and store ###
    @store.destroy(id)

module.exports = new Settings()