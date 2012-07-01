/**
 * This bookmarklet script is supposed to run from Soundcloud.com.
 *
 * The purpose of this script is to find all sound cloud songs on the active
 * page, and allow the user to add any of them to the active playlist.
 */
(function(window) {
    "use strict";
    /*global $ */ // SoundCloud has jQuery.

    var

        /**
         * Soundcloud has jQuery on their pages.
         *
         * @type {jQuery}
         */
        $ = window.$,

        /**
         * The URL of the plalists app.
         * @type {String}
         */
        appUrl = window.__scPlaylistsAppUrl,

        /**
         * Find all links to soundtrack tracks on the current page:
         *
         * @return {Array} an array with paths of tracks (not full URL)
         */
        findTracksOnPage = function() {
            return $('.player[data-sc-track]:visible h3 a[href]').map(function() {
                return this.getAttribute('href');
            });
        },

        /**
         * A reference to the popup window that we will open.
         *
         * Will prevent us from opening a new popup every time the user clicks
         * on the bookmarklet.
         *
         * @type {DOMWindow}
         */
        appWindow,

        /**
         * All the tracks that we find on the page.
         */
        tracks;

    if (!$) {
        return window.alert('This only works on Soundcloud pages.');
    }

    tracks = findTracksOnPage();

    if (!tracks) {
        return window.alert('No tracks found on this page.');
    }

    appWindow = open(appUrl + '?' + $.param({tracks: tracks}),
                    'scPlaylistsApp',
                    'left=20,top=20,width=600,height=600,toolbar=1,resizable=1');

    appWindow.focus();

})(this);
