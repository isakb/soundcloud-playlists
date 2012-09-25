(
  _,
  $,
  Backbone,
  EventHub,
  models,
  AuthView,
  PlaylistsView,
  PlaylistView,
  PlayerView,
  AddTrackView,
  appTemplate
) <- define <[
  underscore
  jquery
  backbone
  ../events
  ../models/models
  ./auth
  ./playlists
  ./playlist
  ./player
  ./add_track
  text!../templates/app.html
]>

# Main App View / Controller.
Backbone.View.extend do
  el: \#soundcloud-playlists
  template: _.template(appTemplate)

  # Bind to a global EventHub's events:
  onEventHub:
    "playlists:change-playlist":    \onChangedPlaylist
    "playlist:change-track":        \onChangedTrack
    "add-track-form:track-added":   \onAddedTrack
    "player:finished-track":        \onPlayerFinishedTrack

  initialize: ->
    _.bindAll @
    @render! # creates DOM nodes that the components need
    @renderComponents!
    _.each @onEventHub, (callbackName, event) ->
      EventHub.on event, @[callbackName], @
    , @

  # Render the layout of the app.
  render: ->
    @$el.html @template(@options)
    @


  # Initialize and render the player, playlist, and playlists nav bar.
  renderComponents: ->
    user = new models.User!
    playlists = new models.Playlists!
    @auth = new AuthView(model: user).render!
    @playlists = new PlaylistsView(collection: playlists).render!

    # FIXME: getActivePlaylist should be a method of the model, not
    # the view.
    playlist = @playlists.getActivePlaylist!
    @playlist = new PlaylistView(model: playlist).render!
    @addTrack = new AddTrackView(model: playlist).render!

    # TODO: Maybe the player should only have the track as a model, not
    # a whole playlist...
    @player = new PlayerView do
      model: playlist
      widgetParams: {
        +auto_play
        +show_user
        -sharing        # FB sharing code throws annoying errors.
      }
    @player.render!


  # The user added a track in the playlist. Show the player if invisible.
  onAddedTrack: ->
    @player.refresh!


  # The user clicked on another track in the playlist. Play it.
  onChangedTrack: (track) ->
    @player.playTrack track


  # The player has played the whole track. Start playing next track,
  # indicate the change also in the playlist view.
  onPlayerFinishedTrack: ->
    track = @playlist.model.getNextTrack!
    if track
      @playlist.activateTrack track
      @player.playTrack track


  # When the user activates another playlist, let's also load that in the
  # playlist view and activate the same playlist in the player.
  onChangedPlaylist: (playlist) ->
    @playlist.changeModel playlist
    @player.changeModel playlist
    @addTrack.changeModel playlist
