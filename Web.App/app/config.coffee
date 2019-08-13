class Config
  apptitle: 'Event|Feedback'
  appcontainer: 'content'
  approot: '/'
  apiroot: '/api/v1' # https://bit-eventfeedback.azurewebsites.net
  apitimeout: 60000
  hometrigger: 'home:index'
  startuptrigger: 'events:index'
  signintrigger: 'signin:index'
  brandtrigger: 'events:index'
  layout: 'layouts/app-layout'
  sidebarglyphicon: 'glyphicon-minus'
  spinneractive: false
  url: 'https://bit-eventfeedback.azurewebsites.net'
  modules:
    'header': 'modules/header/router'
    'common': 'modules/common/router'
    'event': 'modules/event/router'
    'admin': 'modules/admin/router'

module.exports = new Config()