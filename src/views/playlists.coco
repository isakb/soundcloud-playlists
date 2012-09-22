(
  _,
  $,
  Backbone,
  EventHub,
  models,
  templateHelpers,
  playlistsTemplate
) <- define <[
  underscore
  jquery
  backbone
  ../events
  ../models/models
  ../helpers/template_helpers
  text!../templates/playlists.html
]>

# All playlists View / Controller.
Backbone.View.extend do
  el: \#playlists
  template: _.template(playlistsTemplate)

  events:
    'click .playlist':        \onClickPlaylist
    'click .new-playlist':    \onClickNew
    'click .delete':          \onClickDelete


  initialize: ->
    _.bindAll @
    @activePlaylist = @collection.where(isActive: true)[0]
    @collection.on 'playlists:activate', @setActivePlaylist
    @collection.on 'change add remove', @render

  getActivePlaylist: ->
    @activePlaylist

  setActivePlaylist: (playlist) ->
    @activePlaylist.set \isActive, false  if @activePlaylist
    @activePlaylist = playlist
    playlist.set \isActive, true
    @render!
    EventHub.trigger 'playlists:change-playlist', playlist

  render: ->
    activeIndex = @collection.indexOf(@activePlaylist)
    @$el.html @template(playlists: @collection.toJSON!)
    activeElement = @$ ".playlist:nth-child(#{1 + activeIndex})"
    activeElement.addClass \active
    @

  onClickPlaylist: (e) ->
    index = $ e.target .data \index
    @setActivePlaylist @collection.at index

  onClickNew: (e) ->
    @collection.create!

  onClickDelete: (e) ->
    e.stopPropagation!
    index = $ e.target .closest \li .data \index
    if @collection.length <= 1
      window.alert 'You are not allowed to remove the last playlist'
    else
      playlist = @collection.at index

      # If the active playlist is deleted, let's activate another.
      if playlist == @activePlaylist
        nextIndex = (index + 1) % @collection.length
        @setActivePlaylist @collection.at nextIndex
      playlist.destroy!
