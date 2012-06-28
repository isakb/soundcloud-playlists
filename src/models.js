define(['underscore', 'jquery', 'backbone', 'localstorage', './sc_client'],
function(_, $, Backbone, Store, SC){
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
            sc_id: 0,               // e.g. 14426514
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

        /**
         * Calculate the duration of all tracks.
         *
         * @return {Number} total duration in milliseconds
         */
        getDuration: function() {
            return this.reduce(function(duration, track) {
                return duration + track.get('duration');
            }, 0);
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
            name: 'My New Playlist',
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
            _.bindAll(this);

            this.currentTrack = tracks.at(0);

            // Auto-save changes. TODO: Add support for undoing changes.
            this.bind('change',     this.save);

            // Auto-refresh playlist if tracks are added, removed, or changed:
            tracks.bind('add',      this.refresh);
            tracks.bind('remove',   this.refresh);
            tracks.bind('change',   this.refresh);
        },

        /**
         * Refresh the playlist after something has changed.
         *
         * Re-calculates total duration of tracks.
         */
        refresh: function() {
            var tracks = this.get('tracks');
            this.set('duration', tracks.length ? tracks.getDuration() : 0);
        },

        /**
         * Backbone's toJSON would not includ our tracks here. So let's override
         * it.
         *
         * @return {Object} Model attributes as JSON object
         */
        toJSON: function() {
            var json = Playlist.__super__.toJSON.call(this);
            json.tracks = this.get('tracks');
            if (!_.isArray(json.tracks)) {
                json.tracks = json.tracks.toJSON();
            }
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
            var tracks = this.get('tracks'),
                dfd = $.Deferred();

            SC.get('/resolve', { url: url }, function(track, error) {
                if (error) {
                    dfd.reject(error);
                }
                if (track.kind === 'track') {
                    // We don't use deep models in this project.
                    track.user_name = track.user.username;
                    delete track.user;
                    // If we keep the id field we can only have a track once per
                    // playlist, which is not so good. So let's rename it.
                    track.sc_id = track.id;
                    delete track.id;

                    track = new Track(track);
                    tracks.add(track);
                    dfd.resolve(track);
                } else {
                    dfd.reject({
                        message: "This URL does not go to a soundcloud track."
                    });
                }

            });

            return dfd.promise();
        }

    });

    // TODO:
    Playlists = Backbone.Collection.extend({
        model: Playlist,

        // Save all playlists in local store under this namespace:
        localStorage: new Store("my-soundcloud-playlists")
    });

    return {
        Track: Track,
        Tracks: Tracks,
        Playlist: Playlist,
        Playlists: Playlists
    };

});
