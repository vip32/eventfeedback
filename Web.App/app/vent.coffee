class Vent extends Backbone.Events

  @setup: ->
    @on 'all', (name, options) ->
      log 'vent:trigger -->', name, options
    
 module.exports = Vent