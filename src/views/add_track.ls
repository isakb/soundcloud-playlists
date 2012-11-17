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
        url = decodeURIComponent(part.match(/^track[^=]*=([^$]+)/)[1])
        url

      for index, str of tracks
        _.delay @addAnything, index * 10, str

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

    $search = @$ "form input[name=new_track]"
    str = $search.val!

    if /^\d+$/.test(str)
      @addTrackByID +str
    else if /^https?:\/\/.+/.test(str)
      @addFromUrl str
    else
      @addAnything str

    @render!


  addTrackByID: (trackID) ->
    @model.addTrackByID trackID
      .done (track) -> EventHub.trigger "add-track-form:track-added", track
      .fail (error) -> window.alert "Sorry! Not a valid track: " + trackID


  # Add a track(s) from a typical Soundcloud track URL, e.g.:
  # http://soundcloud.com/isakba/mahadatest6
  addTrackFromUrl: (trackUrl) ->
    @model.addTrackFromUrl trackUrl
      .done (track) -> EventHub.trigger "add-track-form:track-added", track
      .fail (error) -> window.alert "Sorry! Not a valid track URL: " + trackUrl


  # Add track(s) from e.g.
  # http://soundcloud.com/isakba/mahadatest6 or /isakba/mahdadatest6
  # or just "isakba" to add all of isakba's tracks.
  addAnything: (str) ->
    # TODO: Use the search API.
    url = 'http://soundcloud.com' + (if str[0] == '/' then '' else '/') + str
    @model.addTrackFromUrl url
      .done (tracks) -> for t in tracks then EventHub.trigger "add-track-form:track-added", t
      .fail (error)  -> window.alert "Sorry! Couldn't add track(s) from #{str}"

