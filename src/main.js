(function(){
'use strict';
/*global requirejs*/
requirejs.config({
    waitSeconds: 2,
    paths: {
        'underscore': 'vendor/underscore',
        'jquery':     'vendor/jquery',
        'backbone':   'vendor/backbone',
        'sc_api':     'vendor/sc_api'
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
requirejs(['underscore', 'jquery', 'sc_api', './models', './all_templates'],
function(_, $, SC, models, T) {

    debugger

    var playlist,
        playlistView,
        widgetIframe  = document.getElementById('sc-widget'),
        playerBaseUrl = widgetIframe.src + '?url=',
        widget        = SC.Widget(widgetIframe),
        nextTrackUrl = 'http://api.soundcloud.com/tracks/13692671';

    playlist = new models.Playlist();

    // Add some dummy tracks to playlist

    playlistView = new models.PlaylistView({
        collection: playlist
    });

    playlistView.render();



    // The first song in the playlist:
    widgetIframe.src = playerBaseUrl + "http://api.soundcloud.com/tracks/47558795";

    widget.bind(SC.Widget.Events.READY, function() {
        widget.bind(SC.Widget.Events.FINISH, function() {
            widget.load(playerBaseUrl + nextTrackUrl);
        });
    });

    // Convenience while developing:
    window.widget = widget;

});

})();
