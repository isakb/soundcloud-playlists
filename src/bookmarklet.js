/**
 * This bookmarklet script is supposed to run from Soundcloud.com.
 *
 * The purpose of this script is to find all sound cloud songs on the active
 * page, and allow the user to add any of them to the active playlist.
 */
(function() {
    "use strict";
    /*global $ */ // SoundCloud has jQuery.

    var appUrl = window.__scPlaylistsAppUrl,
        appWindow;


    appWindow = open(appUrl + '?' + $.param({addTrack: ''+location}),
                    'scPlaylistsApp',
                    'left=20,top=20,width=600,height=600,toolbar=1,resizable=1');

    appWindow.focus();


    // // TODO: More advanced version:


    //     /**
    //      * Cached jQuery object with all Soundclound tracks found on a
    //      * Soundcloud page.
    //      */
    //     $$,

    //     /**
    //      * Remove leading and trailing whitespaces from a string.
    //      *
    //      * @param  {String} str
    //      * @return {String}
    //      */
    //     trim = function(str) {
    //         return str.replace(/^\s+|\s+$/g, '');
    //     },

    //     me = {
    //         tracks: undefined,

    //         findTrackInfo: function(selector) {
    //             return trim($$.find(selector).text());
    //         },

    //         init: function() {
    //             // Find all soundcloud tracks on the page, if possible (requires
    //             // that jQuery exists on the page).
    //             $$ = window.$ && $('.player[data-sc-track]:visible');

    //             if (!($$ && $$.length > 0)) {
    //                 window.alert('Cannot do anything on this page.');
    //                 return;
    //             }

    //             this.findTracks();
    //         },

    //         findTracks: function() {
    //             var re, scriptBody, json;
    //             try {
    //                 re = /bufferTracks\.push\(([^$]+)\);\s*$/;
    //                 scriptBody = $$.find('script').html();
    //                 json = scriptBody.match(re)[1];
    //                 me.extra = JSON.parse(json);
    //             } catch(e) {
    //                 me.extra = {};
    //             }
    //             me.mainTrack = {
    //                 author: me.findTrackInfo('.user-name'),
    //                 title: me.findTrackInfo('.info-header h1'),
    //                 duration: me.extra.duration,
    //                 id: me.extra.id
    //             };
    //         }
    //     };


    // me.init();


})();
