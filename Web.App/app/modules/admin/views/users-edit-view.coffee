application = require 'application'
vent = require 'vent'

module.exports = class UsersEditView extends Backbone.Marionette.ItemView
  id: 'users-edit-view'
  template: require './templates/users-edit'
  events:
    'click #js-add': 'onAdd'
    'click #js-save': 'onSave'

  initialize: (options) ->
    @resources = options?.resources
    console.log '==========', options

  onShow: ->
    columns = [
    #   name: "id" # The key of the model attribute
    #   label: "ID" # The name to display in the header
    #   editable: false # By default every cell in a column is editable, but *ID* shouldn't be
    #   # Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
    #   cell: 'string' #Backgrid.IntegerCell.extend(orderSeparator: "")
    # ,
      name: "active"
      label: "Active"
      cell: "boolean"
    ,
      name: "name"
      label: "Name"
      editable: true
      cell: "string"
    ,
      name: "password"
      label: "Password"
      editable: true
      cell: "string"
    ,
      name: "roles"
      label: "Roles"
      cell: Backgrid.SelectCell.extend
        optionValues: [["", ""], ["User", "User"], ["Administrator", "Administrator"], ["Administrator User", "Administrator User"]]
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

  onAdd: ->
    @collection.add
      dirty: true,
      silent: true
    # TODO: add new model to collection, insert new row in table for this model
    #       enable save button

  onSave: ->
    vent.trigger 'save:users'
    # TODO: button > trigger event for controller to save all 'dirty' models