class Vent extends Backbone.Events

  @setup: ->
    @on 'all', (name) ->
      log 'vent:trigger -->', name
    
 module.exports = Vent