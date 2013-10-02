module.exports = class ItemView extends Backbone.Marionette.ItemView

  onShow: ->
    # add the defined attributes in tagAttrs to the tag for this ItemView
    if @tagAttrs?
      for attr of @tagAttrs
        @$el.attr(attr, @tagAttrs[attr](@model))

