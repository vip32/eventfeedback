Collection = require '../lib/base/collection'

module.exports.Collection = class StoreCollection extends Collection

  url: 'store'
  localStorage: new Backbone.LocalStorage('store')

  initialize: (options) ->
    @name = options?.name

  setValue: (id, value) ->
    ###
      add or opdate an item in the collection with the specified id and value.
      if the item exists the value will be updated
    ###
    item = @get("#{@name}-#{id}")
    if item?
      # item.set "value", value
      @remove(item)
      @create
        id: "#{@name}-#{id}"
        value: value
    else
      @create
        id: "#{@name}-#{id}"
        value: value

  getValue: (id) ->
    ### get the value attribute for an item ###
    @getValueOrDefault(id, '')

  getValueOrDefault: (id, val) ->
    ### get the value attribute for an item ###
    item = @get("#{@name}-#{id}")
    if item? then item.get('value') else val

  has: (id) ->
    ### looks through the collection for the specified id ###
    item = @get("#{@name}-#{id}")
    item? == true
    
  destroy: (id) ->
    ### removes all models from the collection and store ###
    if _.isEmpty(id)
      _.chain(@models).clone().each (model) ->
        model.destroy()
    else
      _.chain(@models).clone().each (model) =>
        if "#{@name}-#{id}" is model.get('id')
          model.destroy()