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
        model: Track
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
            _.bindAll(this);

            this.currentTrack = tracks.at(0);

            tracks.bind('add', this.calculateDuration);
            tracks.bind('remove', this.calculateDuration);
            tracks.bind('change', this.calculateDuration);
        },

        calculateDuration: function() {
            var tracks = this.get('tracks');
            if (!tracks) {
                this.set('duration', 0);
                return;
            }
            console.log('calculating duration of tracks', tracks.length);
            this.set('duration', tracks.reduce(function(duration, track) {
                return duration + track.get('duration');
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
        model: Playlist
    });

    return {
        Track: Track,
        Tracks: Tracks,
        Playlist: Playlist,
        Playlists: Playlists
    };

});
