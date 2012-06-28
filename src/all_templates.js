/**
 * Define an object containing all of the templates.
 */
define([
    'text!src/templates/app.html',
    'text!src/templates/player.html',
    'text!src/templates/playlist.html',
    'text!src/templates/track.html',
    'text!src/templates/bookmarklet.html'
], function(
    app,
    player,
    playlist,
    track,
    bookmarklet
) {
    "use strict";

    return {
        app:            app,
        player:         player,
        playlist:       playlist,
        track:          track,
        bookmarklet:    bookmarklet
    };
});
