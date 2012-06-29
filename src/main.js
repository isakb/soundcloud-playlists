/**
 * Soundcloud Playlist application.
 *
 * https://github.com/isakb/...
 *
 * Copyright (c) 2012 Isak B
 * GPL Licensed (LICENSE.txt)
 */

// Configure module paths etc. for RequireJS:
require.config({
    paths: {
        // Backbone and its dependencies:
        'underscore':   'vendor/underscore',
        'jquery':       'vendor/jquery',
        'backbone':     'vendor/backbone',

        // Local storage of backbone models:
        'localstorage': 'vendor/backbone_localstorage',

        // Soundcloud JavaScript SDK and Widget API:
        'sc_sdk':       'http://connect.soundcloud.com/sdk',
        'sc_api':       'vendor/sc_api',

        // RequireJS text plugin, used to load templates:
        'text':         'vendor/require.text',

        // For the build process:
        'requireLib':   'vendor/require'
    },
    // Relevant RequireJS 2.0 documentation: http://tinyurl.com/bn4j9sx
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'localstorage': {
            deps: ['underscore', 'backbone'],
            exports: 'Store'
        },
        'sc_sdk': {
            exports: 'SC'
        },
        'sc_api': {
            exports: 'SC'
        }
    }
});
// MAIN dependencies and definition:
require(['underscore', 'jquery', './models/models', './views/views'],
function(_, $, models, views) {
"use strict";

    // playlist = new models.Playlist({
    //     name: 'Dummy playlist',
    //     description: 'Just a placeholder playlist for now.'
    // });
    // _.each([
    //     'http://soundcloud.com/isakba/mahadatest6',
    //     'http://soundcloud.com/isakba/bravissimo-2001',
    //     'http://soundcloud.com/isakba/blip-blip-2001',
    //     'http://soundcloud.com/awooooo/09-the-16th-hour'
    // ], _.bind(playlist.addTrackFromUrl, playlist));

    return new views.AppView({
        //playlist: playlist,
        playerStartUrl: 'http://api.soundcloud.com/users/isakba',
        bookmarkletUrl: window.location.href.replace('index.html', 'src/bookmarklet.js')
    });


});
