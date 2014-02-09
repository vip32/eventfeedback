application = require 'application'
vent = require 'vent'

module.exports = class SessionsEditView extends Backbone.Marionette.ItemView
  id: 'sessions-edit-view'
  template: require './templates/sessions-edit'

  initialize: (options) ->
    @resources = options?.resources

  onShow: ->
    scrollTo(0,0)
    columns = [
      name: "id" # The key of the model attribute
      label: "ID" # The name to display in the header
      editable: false # By default every cell in a column is editable, but *ID* shouldn't be
      # Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
      cell: 'string' #Backgrid.IntegerCell.extend(orderSeparator: "")
    ,
      name: "title"
      label: "Title"
      cell: "string"
    ,
      name: "description"
      label: "Description"
      cell: "string"
    ]
    grid = new Backgrid.Grid({
      columns: columns,
      collection: @collection
    });
    $("#js-table").append(grid.render().$el);