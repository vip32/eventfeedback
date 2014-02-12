class Vent extends Backbone.Events

  @setup: ->
    @on 'all', (name) ->
      console.log 'vent:trigger', name
    
 module.exports = Vent