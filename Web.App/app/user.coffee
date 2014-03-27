settings = require 'settings'

class User
  ###
    encapsulates the current user
  ###

  constructor: ->
    ### initializes this instance ###
    log 'user init'
    
  set: (key, value) ->
    settings.set(key, value)
    
  get: (key) ->
    settings.get(key)
    
  isAuthenticated: ->
    not (_.isEmpty(@token()) or _.isEmpty(@tokenexpires()))
    # TODO: check expiration date (against now) of token
    
  isAdministrator: ->
    _.intersection(['Administrator'], @roles).length > 0
  
  reset: ->
    settings.destroy('api_token')
    settings.destroy('api_token_expires')
    settings.destroy('api_authenticated')
    settings.destroy('api_username')
    settings.destroy('api_remember')
    settings.destroy('api_userroles')
  
  token: (value) ->
    if not _.isEmpty(value)
      settings.set('api_token', value)   
    else
      settings.get('api_token') 
      
  tokenexpires: (value) ->
    if not _.isEmpty(value)
      settings.set('api_token_expires', value)   
    else
      settings.get('api_token_expires') 
    
  roles: (values) ->
    if not _.isEmpty(values)
      settings.set('api_userroles', values)   
    else
      settings.get('api_userroles') ? []
      
  name: (value) ->
    if not _.isEmpty(value)
      settings.set('api_username', value)   
    else
      settings.get('api_username') 
      
  remember: (value) ->
    if _.isBoolean(value)
      settings.set('api_remember', value)   
    else
      settings.get('api_remember') ? false
  
module.exports = new User()
  