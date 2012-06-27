define(['underscore', 'jquery', 'backbone', './sc_client'],
function(_, $, Backbone, SC){
    "use strict";
    var Track, Tracks, Playlist, Playlists;

    /**
     * A single Soundcloud track.
     *
     * @type {Backbone.Model}
     */
    Track = Backbone.Model.extend({
        urlRoot: location.protocol + '//api.soundcloud.com/tracks/',

        // These are the attributes we are interested in, although a soundcloud
        // track has even more attributes.
        defaults: {
            artwork_url: null,
            duration: 0,            // duration in milliseconds
            id: 0,                  // e.g. 14426514
            permalink_url: "",      // e.g. http://s..com/isakba/bravissimo-2001
            title: "",              // e.g. Bravissimo 2001
            uri: "",                // e.g. http://api.s..com/tracks/14426514
            user_id: null,          // e.g. 4446361
            user_name: ''           // e.g. isak-ba
        }

    });


    /**
     * A collection of Soundcloud tracks.
     *
     * In essence a playlist, except that a playlist also has a name and
     * description, and perhaps some other meta-data.
     *
     * @type {Backbone.Collection}
     */
    Tracks = Backbone.Collection.extend({
        model: Track,

        initialize: function() {
        }
    });

    /**
     * A playlist model wraps the Tracks object and some metadata about
     * a playlist.
     *
     * @type {Backbone.Model}
     */
    Playlist = Backbone.Model.extend({

        /**
         * @property {String} name         The name of the playlist
         * @property {String} description  A short description of the playlist
         * @property {Tracks} tracks       The tracks included in the playlist
         */
        defaults: {
            name: 'New playlist',
            description: '',
            duration: 0, // total playlist duration in milliseconds
            tracks: []
        },

        initialize: function() {
            var tracks = this.get('tracks');
            if (_.isArray(tracks)) {
                tracks = new Tracks(tracks);
                this.set('tracks', tracks);
            }
            tracks.bind('change', this.calculateDuration, this);
        },

        calculateDuration: function() {
            this.set('duration', this.get('tracks').reduce(function(sum, dur) {
                return sum + dur;
            }, 0));
        },

        toJSON: function() {
            var json = Playlist.__super__.toJSON.call(this);
            json.tracks = this.get('tracks').toJSON();
            return json;
        },

        /**
         * Add a track from the URL that you typically go to when you click
         * on a Soundcloud track link on Soundcloud.
         *
         * Example url: http://soundcloud.com/isakba/bravissimo-2001
         *
         * Our playlist cannot handle this URL out of the box, since we need
         * the unique track ID for the player.
         *
         * @param {String} url
         */
        addTrackFromUrl: function(url) {
            var tracks = this.get('tracks');
            SC.get('/resolve', { url: url }, function(track) {
                if (track.kind === 'track') {
                    // We don't use deep models in this project.
                    track.user_name = track.user.username;
                    delete track.user;

                    tracks.add(track);
                } else {
                    throw new Error('You can only add tracks to a playlist');
                }

            });
        }

    });

    // TODO:
    Playlists = Backbone.Collection.extend({
        model: Playlist
    });

    return {
        Track: Track,
        Tracks: Tracks,
        Playlist: Playlist,
        Playlists: Playlists
    };

});
