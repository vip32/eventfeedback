# The config object
class Config
  apptitle: 'Event|Feedback'
  appcontainer: 'content'
  approot: '/'
  apiroot: '/api'
  startuptrigger: 'home:index'
  brandtrigger: 'home:index'
  layout: 'layouts/app-layout'
  modules:
    'header': 'modules/header/router'
    'common': 'modules/common/router'
    'contact': 'modules/contact/router'
    'event': 'modules/event/router'

module.exports = new Config()