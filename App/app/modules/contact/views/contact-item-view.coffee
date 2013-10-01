ItemView = require '../../../../lib/base/item-view'

module.exports = class ContactItemView extends ItemView
  id: 'contact-item-view'
  template: require './templates/contact-item'
  tagName: 'a'
  className: 'list-group-item'
  tagAttrs:
    'href': (model) -> '#contacts/' + model.get('id')

  flash: (cssClass) ->
    $view = @$el
    $view.hide().toggleClass(cssClass).fadeIn 500, ->
      setTimeout ->
        $view.toggleClass(cssClass)
      , 500