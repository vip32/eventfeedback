# The config object
class Config
  appcontainer: 'content'
  approot: '/'
  apiroot: 'https://localhost:44300/api/v1' # TODO: change for other envs (Azure)
  startuptrigger: 'home:index'
  brandtrigger: 'home:index'
  layout: 'layouts/app-layout'
  modules:
    'common': 'modules/common/router'
    'header': 'modules/header/router'
    'contact': 'modules/contact/router'

module.exports = new Config()