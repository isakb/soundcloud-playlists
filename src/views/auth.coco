(
  _, $, Backbone, EventHub, SC, authTemplate
) <- define <[
  underscore jquery backbone ../events ../helpers/sc_client text!../templates/auth.html
]>

# Auth View / Controller.
Backbone.View.extend do
  el: \#auth
  template: _.template authTemplate

  events:
    "click .login":           \onClickLoginOrLogout
    "click .logout":          \onClickLoginOrLogout


  initialize: ->
    _.bindAll @
    @model.bind \change, @render


  render: ->
    @$el.html @template @model.toJSON!
    @


  isLoggedIn: ->
    !!@model.get("user_id")


  logIn: ->
    SC.connect ~>
      SC.get "/me", (user) ~>

        # Since id is a special field in Backbone.
        user.user_id = user.id
        delete user.id

        @model.set user
        EventHub.trigger "sc:connected", user


  logOut: ->
    SC.disconnect!
    @model.clear silent: true
    @model.set @model.defaults


  # When clicking on the login (connect) or logout link.
  onClickLoginOrLogout: (e) ->
    if @isLoggedIn!
      @logOut!
    else
      @logIn!
