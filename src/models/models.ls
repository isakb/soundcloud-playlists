(
  _, $, Backbone, EventHub, Store, SC
) <- define <[
  underscore jquery backbone ../events localstorage ../helpers/sc_client
]>

# Soundcloud User model. Mainly used for the auth view.
User = Backbone.Model.extend do
  defaults:
    avatar_url: ""
    user_id: 0
    permalink_url: ""   # e.g. http://s.com/isakba/
    uri: ""             # e.g. https://api.s..com/users/4446361
    username: ""        # e.g. isak-ba"

# A single Soundcloud track.
# These are the attributes we are interested in, although a soundcloud
# track has even more attributes.
Track = Backbone.Model.extend do
  defaults:
    artwork_url: null
    duration: 0         # duration in milliseconds
    sc_id: 0            # e.g. 14426514
    permalink_url: ""   # e.g. http://s..com/isakba/bravissimo-2001
    title: ""           # e.g. Bravissimo 2001
    uri: ""             # e.g. http://api.s..com/tracks/14426514
    user_id: null       # e.g. 4446361
    user_name: ""       # e.g. isak-ba


# A collection of Soundcloud tracks.
# In essence a playlist, except that a playlist also has a name and
# description, and perhaps some other meta-data.
Tracks = Backbone.Collection.extend do
  model: Track

  # Total duration of all tracks in milliseconds
  getDuration: ->
    @reduce ((duration, track) -> duration + track.get \duration ), 0


# A playlist model wraps the Tracks object and some metadata about
# a playlist.
Playlist = Backbone.Model.extend do
  defaults:
    name: "New Playlist"          # playlist name
    description: ""               # short description of the playlist
    duration: 0                   # total playlist duration (ms)
    isActive: true                # is the playlist in use now?

  initialize: ->
    _.bindAll @
    count = 0
    @activeTrackIndex = 0

    if @isNew!
      # Try not to reuse the "New Playlist" name.
      name = @get \name
      while @collection.where(name: @get \name).length
        count += 1
        @set \name, "#name (#count)", {+silent}
      @save!

    @tracks = new Tracks!
    @tracks.localStorage = new Store "sc-tracks-#{@id}"
    @tracks.fetch!

    # Auto-save changes.
    @on \change, @save

    # Auto-refresh playlist if tracks are added, removed, or changed:
    @tracks.on "add remove change", @refresh


  setActiveTrack: (track) ->
    @activeTrackIndex = @tracks.indexOf(track)


  getActiveTrack: ->
    @tracks.at(@activeTrackIndex) || @getNextTrack!


  # Get next active track (currently assuming that playlist will be repeated).
  # Also updates the activeTrackIndex.
  getNextTrack: ->
    nextIndex = (@activeTrackIndex + 1) % @tracks.length
    @activeTrackIndex = nextIndex
    @tracks.at(nextIndex) || @tracks.at(0)


  # Refresh the playlist after something has changed.
  # Re-calculates total duration of tracks.
  refresh: ->
    tracks = @tracks
    numTracks = @tracks.length
    @set "duration", (if numTracks > 0 then tracks.getDuration! else 0)


  # Add a track from the URL that you typically go to when you click
  # on a Soundcloud track link on Soundcloud.
  #
  # Example url: http://soundcloud.com/isakba/bravissimo-2001
  addTrackFromUrl: (url) ->
    dfd = $.Deferred!
    SC.get "/resolve", {url: url}, (track, error) ~>
      return dfd.reject error  if error
      switch track.kind
      | \track        => dfd.resolve @makeTrack track
      | \user         => dfd.pipe @addTracksByUser track
      | \playlist     => dfd.resolve [@makeTrack(track) for track in track.tracks]
      |_              =>
        console.error track
        dfd.reject do
         message: "This (#{url}) is no public soundcloud track.
                   Log in if you were trying to add a private track."
    dfd.promise!


  # Add a user's tracks (all of them).
  addTracksByUser: (user) ->
    dfd = $.Deferred!
    SC.get "/users/#{user.id}/tracks", (tracks, error) ~>
      return dfd.reject error  if error
      dfd.resolve [@makeTrack(track) for track in tracks]
    dfd.promise!


  addTrackByID: (id) ->
    dfd = $.Deferred!
    SC.get "/tracks/#id", (track, error) ~>
      return dfd.reject error  if error
      addedTrack = @makeTrack track
      if addedTrack
        dfd.resolve addedTrack
      else
        dfd.reject message: "This URL does not go to a soundcloud track."
    dfd.promise!


  # (Maybe) make a playlist track from the SC track data received by API.
  makeTrack: (track) ->
    if track.kind is \track
      track{username: user_name, avatar_url: user_avatar_url} = delete track.user
      # If we keep the id field we can only have a track once per
      # playlist, which is not so good. So let's rename it.
      track.sc_id = delete track.id
      @tracks.create(track)
    else
      null


# A collection of Playlists.
Playlists = Backbone.Collection.extend do
  model: Playlist
  localStorage: new Store "sc-playlists"
  initialize: ->
    @fetch!
    # Always have at least one playlist.
    @create!  if @length is 0


  # Create a new playlist and set it as active.
  create: ->
    newPlaylist = Playlists.__super__.create.call(@)
    @trigger "playlists:activate", newPlaylist


{User, Track, Tracks, Playlist, Playlists}
