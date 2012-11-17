# This bookmarklet script is supposed to run from Soundcloud.com.

# The purpose of this script is to find all sound cloud songs on the active
# page, and allow the user to add any of them to the active playlist.
let window = @
  'use strict'

  die = (msg) ->
    throw new Error msg

  try
    $ = window.jQuery

    die 'You can only run this bookmarklet on Soundcloud pages.'  unless $

    # The URL of the playlists app.
    appUrl = window.__scPlaylistsAppUrl

    # All the tracks (IDs) that we find on the page.
    urls = $ '.sc-link-dark.soundTitle__title' .map ->
      $ @ .attr \href

    tracks = urls.toArray!
    tracks.unshift window.location.href.split('soundcloud.com/')[1]

    # A reference to the popup window prevents us from opening a new popup
    # #every time the user clicks on the bookmarklet.
    appWindow = open appUrl + '?' + $.param({tracks} 'scPlaylistsApp' 'left=20,top=20,width=600,height=600,toolbar=1,resizable=1')
    appWindow.focus!

  catch e
    window.alert "ERROR: #{e}"
