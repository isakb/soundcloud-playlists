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
        'sc_sdk':     'http://connect.soundcloud.com/sdk',
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
            exports: function () {
                return this._.noConflict();
            }
        },
        // Soundcloud SDK:
        'sc_sdk': {
            exports: function () {
                return this.SC;
            }
        },
        // Soundcloud API:
        'sc_api': {
            exports: function () {
                var SC = this.SC;
                this.SC = undefined;
                return SC;
            }
        }
    }
});
// MAIN dependencies and definition:
requirejs(['underscore', 'jquery', './models', './views'],
function(_, $, models, views) {
    var playlist,
        main;


    playlist = new models.Playlist({
        name: 'Dummy playlist',
        description: 'Just a placeholder playlist for now.'
    });
    _.each([
        'http://soundcloud.com/isakba/mahadatest6',
        'http://soundcloud.com/isakba/bravissimo-2001',
        'http://soundcloud.com/isakba/blip-blip-2001',
        'http://soundcloud.com/awooooo/09-the-16th-hour'
    ], _.bind(playlist.addTrackFromUrl, playlist));

    main = new views.AppView({
        playlist: playlist,
        playerStartUrl: 'http://api.soundcloud.com/users/isakba',
        bookmarkletUrl: window.location.href.replace('index.html', 'src/bookmarklet.js')
    });


});

})();
