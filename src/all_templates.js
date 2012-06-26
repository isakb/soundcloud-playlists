/**
 * Define an object containing all of the templates, precompiled.
 *
 * The templates must be compatible with Underscore.js' _.template().
 */
define([
    'underscore',
    'text!./templates/app.html',
    'text!./templates/player.html',
    'text!./templates/playlist.html'
], function(
    _,
    app,
    player,
    playlist
) {
    "use strict";

    var T = {};

    _.each({
        app:            app,
        player:         player,
        playlist:       playlist

    }, function(html, name) {
        T[name] = _.template(html);
    });

    return T;
});
