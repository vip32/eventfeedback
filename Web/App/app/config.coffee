# The config object
class Config
  apptitle: 'Event|Feedback'
  appcontainer: 'content'
  approot: '/'
  apiroot: '/api'
  startuptrigger: 'events:index'
  brandtrigger: 'events:index'
  layout: 'layouts/app-layout'
  modules:
    'header': 'modules/header/router'
    'common': 'modules/common/router'
    'event': 'modules/event/router'

module.exports = new Config()