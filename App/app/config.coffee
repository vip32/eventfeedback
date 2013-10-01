# The config object
class Config
  appcontainer: 'content'
  approot: '/'
  apiroot: '/api/v1'
  startuptrigger: 'home:index'
  brandtrigger: 'home:index'
  layout: 'layouts/app-layout'
  modules:
    'common': 'modules/common/router'
    'header': 'modules/header/router'
    'contact': 'modules/contact/router'

module.exports = new Config()