/**
 * Soundcloud Playlist application.
 *
 * RequireJS (http://requirejs.org/) is used for dependency management.
 */
(function(){
'use strict';
/*global requirejs*/

// Configure requirejs module paths etc:
requirejs.config({
    paths: {
        'underscore': 'vendor/underscore',
        'jquery':     'vendor/jquery',
        'backbone':   'vendor/backbone',
        'sc_api':     'vendor/sc_api',
        // RequireJS text plugin, used to load templates:
        'text':       'vendor/require.text'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: function (bar) {
                return this._.noConflict();
            }
        },
        // Soundcloud API:
        'sc_api': {
            exports: 'SC'
        }
    }
});
// MAIN dependencies and definition:
requirejs(['underscore', 'jquery', './models', './views'],
function(_, $, models, views) {
    var playlist,
        main;
        // widgetIframe  = document.getElementById('sc-widget'),
        // playerBaseUrl = widgetIframe.src + '?url=',
        // widget        = SC.Widget(widgetIframe),
        // nextTrackUrl = 'http://api.soundcloud.com/tracks/13692671';

    // playlist = new models.Playlist();

    // // Add some dummy tracks to playlist

    // playlistView = new views.PlaylistView({
    //     model: playlist
    // });

    // playlistView.render();

    playlist = new models.Playlist({
        name: 'Dummy playlist',
        description: 'Just a placeholder playlist for now.'
    });
    _.each([
        'http://soundcloud.com/isakba/mahadatest6',
        'http://soundcloud.com/isakba/bravissimo-2001',
        'http://soundcloud.com/isakba/blip-blip-2001'
    ], _.bind(playlist.addTrackFromUrl, playlist));

    main = new views.AppView({
        playlist: playlist,
        bookmarkletUrl: window.location.href.replace('index.html', 'src/bookmarklet.js')
    });


});

})();
