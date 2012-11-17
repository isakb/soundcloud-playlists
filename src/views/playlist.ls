(
  _,
  $,
  Backbone,
  EventHub,
  SC,
  models,
  templateHelpers,
  playlistTemplate,
  editPlaylistTemplate
) <- define <[
  underscore
  jquery
  backbone
  ../events
  ../helpers/sc_client
  ../models/models
  ../helpers/template_helpers
  text!../templates/playlist.html
  text!../templates/playlist_edit.html
]>

# Active playlist View / Controller.
Backbone.View.extend do
  el: \#playlist
  template: _.template(playlistTemplate)
  editTemplate: _.template(editPlaylistTemplate)

  events:
    "submit form":            \onEditPlaylist
    "click .meta":            \onClickMeta
    "click tbody tr":         \onClickTrack
    "click .abort":           \onClickAbort
    "click .delete":          \onClickDeleteTrack


  initialize: ->
    _.bindAll @
    @createModelBindings!

  createModelBindings: ->
    @model.on \change, @render
    @tracks = @model.tracks
    @tracks.on "add remove", @render

  destroyModelBindings: ->
    @model.off \change, @render
    delete @tracks
    @model.tracks.off "add remove", @render

  # Set the active track to another track.
  activateTrack: (track) ->
    @model.setActiveTrack track
    @render!

  # Change the playlist model used in the view.
  changeModel: (playlist) ->
    @destroyModelBindings!
    @model = playlist
    @createModelBindings!
    @render!

  render: ->
    tplVars = _.extend({}, @model.toJSON!,
      tracks: @tracks.toJSON!
    , templateHelpers)
    html = (@overrideTemplate ? @template) tplVars
    @$el.html html
    activeElement = @$ ".tracks tr[data-track-index=#{@model.activeTrackIndex}]"
    activeElement.addClass \active
    @

  # when user clicks on a track in the playlist
  onClickTrack: (e) ->
    i = $ e.target .closest \tr .data \trackIndex
    track = @tracks.at i
    if track != @model.getActiveTrack!
      # If the track changed, we need to show the new active track.
      @model.setActiveTrack track
      EventHub.trigger "playlist:change-track", track
      @render!

  # when user clicks on the playlist title or description
  onClickDeleteTrack: (e) ->
    e.stopPropagation!
    i = $ e.target .closest \tr .data \trackIndex
    @tracks.at i .destroy!

  # when user cancels editing details
  onClickAbort: (e) ->
    delete @overrideTemplate
    @render!

  # when user clicks on the playlist title or description
  onClickMeta: (e) ->
    @overrideTemplate = @editTemplate
    @render!
    @$ "form [name=name]" .select!

  # when user is editing details of playlist and submits the form
  onEditPlaylist: (e) ->
    e.preventDefault!
    delete @overrideTemplate
    name = @$ "form [name=name]" .val! or \unnamed
    description = @$ "form [name=description]" .val!
    # Since I'm using a very lightweight templating library
    # I will have to take care of escaping HTML myself:
    name = $ "<div/>" .text name .html!
    description = $ "<div/>" .text description .html!
    cache = @model.toJSON! # To check if anything changed

    # This will trigger model change, which in turn re-renders this
    # view, if the user has modified any value in the form.
    @model.set do
      description: description
      name: name

    # Hide the edit form also if no changes were made:
    @render!  if _.isEqual cache, @model.toJSON!
