# The config object
class Config
  apptitle: 'Event|Feedback'
  appcontainer: 'content'
  approot: '/'
  apiroot: '/api/v1'
  startuptrigger: 'events:index'
  signintrigger: 'signin:index'
  brandtrigger: 'events:index'
  layout: 'layouts/app-layout'
  sidebarglyphicon: 'minus'
  modules:
    'header': 'modules/header/router'
    'common': 'modules/common/router'
    'event': 'modules/event/router'
    'admin': 'modules/admin/router'

module.exports = new Config()