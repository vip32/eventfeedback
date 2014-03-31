config = require '../config'
Model = require '../lib/base/model'
Collection = require '../lib/base/collection'
settings = require 'settings'
user = require 'user'

module.exports.Model = class Event extends Model
  schema: 
    active: 'Checkbox'
    title: type: 'Text', validators: ['required']
    description: type: 'Text', validators: ['required']
    feedbackAllowed: title: 'Feedback allowed', type: 'Checkbox'
    link: 'Text'
    location: 'Text'
    taglist: 'Text'
    feedbackDefinitionId: title: 'Feedback type', type: 'Select', options: []
    startDate: type: 'Text', dataType: 'datetime-local' 
    endDate: type: 'Text', dataType: 'datetime-local'


module.exports.Collection = class EventsCollection extends Collection

  url: "#{config.apiroot}/events"
  credentials: ->
    token: user.token()
  model: module.exports.Model
  #comparator: 'title'