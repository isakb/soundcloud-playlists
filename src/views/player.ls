(
  _,
  $,
  Backbone,
  EventHub,
  SC,
  models,
  templateHelpers,
  playerTemplate
) <- define <[
  underscore
  jquery
  backbone
  ../events
  sc_sdk
  ../models/models
  ../helpers/template_helpers
  text!../templates/player.html
]>

# Custom Soundcloud track player.
Backbone.View.extend do
  el: \#player
  template: _.template(playerTemplate)

  # Temporary placeholder picture.
  # Just to have something to look at, in case there is neither an
  # artwork_url or a user.avatar_url for the track.
  default_artwork_url: "http://farm2.staticflickr.com/1165/644335254_4b8a712be5_s.jpg"

  # User actions:
  events:
    "click .play":            \onClickPlay
    "change .slider":         \onSeek

  # Events from SoundManager 2.
  # See http://www.schillmania.com/projects/soundmanager2/doc/
  soundEvents:
    onfinish:                 \onSoundFinish
    onpause:                  \onSoundPause
    onplay:                   \onSoundPlay
    whileplaying:             \whileSoundPlaying


  initialize: ->
    _.bindAll @
    @changeModel @model

  render: ->
    return @  unless @track
    tplVars = @track.toJSON!
    tplVars.artwork_url = tplVars.user_avatar_url or @default_artwork_url  unless tplVars.artwork_url
    _.extend tplVars, templateHelpers
    @$el.html @template tplVars
    @$interactive = @$ ".interactive"
    @$slider = @$ ".slider"
    @$currentTime = @$ ".current-time"
    @$play = @$ ".play"
    @isRendered = true
    @refresh!
    @

  refresh: ->
    @track = @model.getActiveTrack!
    @render!  unless @isRendered
    @$play.prop \disabled, not @track
    if @sound
      @$interactive.show!
    else
      @$interactive.hide!
    if @isPlaying!
      @$play.addClass \playing
    else
      @$play.removeClass \playing

  isPlaying: ->
    @sound and not @sound.paused

  # Play a track in the player.
  playTrack: (track) ->
    @sound.stop!  if @sound
    throw new Error "Not a streamable track: " + track.get \uri  unless track.get \streamable
    SC.stream track.get(\uri), @onStreamReady

  # when the stream is ready
  onStreamReady: (sound) ->
    options = {}
    @sound = sound
    _.each @soundEvents, ((callback, eventName) ->
      options[eventName] = @[callback]
    ), @
    sound.play options

  # when sound is loaded and starts to play
  onSoundPlay: ->
    @refresh!
    @render!

  onSoundPause: ->
    @refresh!

  onSoundFinish: ->
    EventHub.trigger "player:finished-track"

  whileSoundPlaying: ->
    # only update current location 10 times per second
    ms = @sound.position
    tenthSeconds = (ms / 100) .|. 0
    if tenthSeconds != @_lastTenthSeconds
      @$slider.val ms
      @$currentTime.text templateHelpers.formatShortTime ms
    @_lastTenthSeconds = tenthSeconds

  onClickPlay: ->
    if @sound
      if @sound.paused
        @sound.play!
      else
        @sound.pause!
      @refresh!
    else
      @playTrack @model.getActiveTrack!

  onSeek: ->
    @sound.setPosition @$slider.val!

  # Change to another playlist model.
  changeModel: (@model) ->
    @track = @model.getActiveTrack!
    @render! # FIXME also done in app.js initialize
