/**
 * Soundcloud Playlists application.
 *
 * https://github.com/isakb/soundcloud-playlists
 *
 * Copyright (c) 2012 Isak B
 * GPL Licensed (LICENSE.txt)
 */

// Configure module paths etc. for RequireJS:
require.config({
    paths: {
        // Backbone and its dependencies:
        'underscore':   'vendor/underscore',
        'jquery':       'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
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
            exports: 'Backbone.LocalStorage'
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
require(['jquery', 'backbone', './views/app'],
function($, Backbone, AppView) {
"use strict";

    var appUrl = location.protocol + '//' + location.hostname +
                (location.port === '80' ? '' : (':' + location.port)) +
                location.pathname;

    // With jQuery hosted by CDN and the rest of the files concatenated in prod
    // environment, Backbone doesn't yet know about jQuery. Solution:
    Backbone.setDomLibrary($);

    return new AppView({
        appUrl: appUrl,
        bookmarkletUrl: appUrl.replace('index.html', 'bookmarklet.js')
    });



});
