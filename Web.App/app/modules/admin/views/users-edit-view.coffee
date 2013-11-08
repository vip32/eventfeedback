application = require 'application'
vent = require 'vent'

module.exports = class UsersEditView extends Backbone.Marionette.ItemView
  id: 'users-edit-view'
  template: require './templates/users-edit'

  initialize: (options) ->
    @resources = options?.resources

  onShow: ->
    columns = [
      name: "id" # The key of the model attribute
      label: "ID" # The name to display in the header
      editable: false # By default every cell in a column is editable, but *ID* shouldn't be
      # Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
      cell: 'string' #Backgrid.IntegerCell.extend(orderSeparator: "")
    ,
      name: "userName"
      label: "Name"
      editable: false
      cell: "string"
    ,
      name: "organization"
      label: "Organization"
      cell: "string"
    ,
      name: "email"
      label: "Email"
      cell: "string"
    ]
    grid = new Backgrid.Grid({
      columns: columns,
      collection: @collection
    });
    $("#js-table").append(grid.render().$el);