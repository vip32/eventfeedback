# The config object
class Config
  appcontainer: 'content'
  approot: '/'
  apiroot: '/api'
  startuptrigger: 'home:index'
  brandtrigger: 'home:index'
  layout: 'layouts/app-layout'
  modules:
    'common': 'modules/common/router'
    'header': 'modules/header/router'
    'contact': 'modules/contact/router'
    'event': 'modules/event/router'

module.exports = new Config()