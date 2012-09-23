(
  _,
  Backbone,
  EventHub,
  addTrackTemplate
) <- define <[
  underscore
  backbone
  ../events
  text!../templates/add_track.html
]>

# View / Controller for the "add track to playlist" form.
Backbone.View.extend do
  el: \#playlist-add-track
  template: _.template addTrackTemplate

  events:
    'click .submit':          \onAddTrack
    'submit form':            \onAddTrack

  initialize: ->
    _.bindAll @
    # Allow to add tracks with the bookmarklet:
    try
      parts = location.search.slice(1).split("&")
      tracks = _.map parts, (part) ~>
        url = part.match(/^track[^=]*=(\d+)/)[1]

      for id of tracks
        _.defer @addTrackByID, id

  changeModel: (@model) ->

  render: ->
    tplVars = @model.toJSON!
    tplVars.appUrl = location.protocol + "//" + location.hostname + ((if location.port is "80" then "" else (":" + location.port))) + location.pathname
    tplVars.bookmarkletUrl = tplVars.appUrl.replace("index.html", "bookmarklet.js")
    @$el.html @template(tplVars)
    @


  # when user fills in a track URL and submits the form
  onAddTrack: (e) ->
    e.preventDefault!

    $trackUrl = @$ "form input[name=new_track]"
    track = $trackUrl.val!

    if /^\d+$/.test(track)
      @addTrackByID +track
    else if /^https?:\/\/.+/.test(track)
      @addTrackFromUrl track
    else
      $trackUrl.val "Enter the track's ID or URL" .select!
      return
    @render!

  # Add a track from a typical Soundcloud track URL, e.g.:
  # http://soundcloud.com/isakba/mahadatest6 or /isakba/mahdadatest6
  addTrackFromUrl: (trackUrl) ->
    trackUrl = "http://soundcloud.com#{trackUrl}"  if trackUrl.charAt(0) == "/"
    @model.addTrackFromUrl trackUrl
      .done (track) -> EventHub.trigger "add-track-form:track-added", track
      .fail (error) -> window.alert "Sorry! Not a valid track URL: " + trackUrl

  addTrackByID: (trackID) ->
    @model.addTrackByID trackID
      .done (track) -> EventHub.trigger "add-track-form:track-added", track
      .fail (error) -> window.alert "Sorry! Not a valid track: " + trackID
