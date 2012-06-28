/**
 * Define an object containing all of the templates, precompiled.
 *
 * The templates must be compatible with Underscore.js' _.template().
 */
define([
    'underscore',
    'text!./templates/app.html',
    'text!./templates/player.html',
    'text!./templates/playlist.html',
    'text!./templates/playlist_edit.html'
], function(
    _,
    app,
    player,
    playlist,
    playlist_edit
) {
    "use strict";

    var T = {};

    _.each({
        app:            app,
        player:         player,
        playlist:       playlist,
        playlist_edit:  playlist_edit

    }, function(html, name) {
        T[name] = _.template(html);
    });

    return T;
});
