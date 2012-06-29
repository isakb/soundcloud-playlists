define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    'localstorage',
    '../helpers/sc_client'
], function(
    _,
    $,
    Backbone,
    EventHub,
    Store,
    SC
){
    "use strict";
    var Track, Tracks, Playlist, Playlists, App;


    /**
     * A single Soundcloud track.
     *
     * @type {Backbone.Model}
     */
    Track = Backbone.Model.extend({

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
         * @property {String}  name         The name of the playlist
         * @property {String}  description  A short description of the playlist
         * @property {Number}  duration     Total playlist duration (ms)
         * @property {Boolean} isActive     True if this playlist is in use now
         */
        defaults: {
            name: 'New Playlist',
            description: '',
            duration: 0,
            isActive: true
        },

        initialize: function() {
            var name, count = 0;

            _.bindAll(this);
            this.activeTrackIndex = 0;

            // Ugly but works:
            if (this.isNew()) {
                // Try not to reuse the "New Playlist" name.
                name = this.get('name');
                while (this.collection.where({name: this.get('name')}).length) {
                    count += 1;
                    this.set('name', name + ' (' + count + ')', { silent: true});
                }
                this.save();
            }
            this.tracks = new Tracks();
            this.tracks.localStorage = new Store('sc-tracks-' + this.id);
            this.tracks.fetch();

            // Auto-save changes. TODO: Add support for undoing changes.
            this.on('change', this.save);

            // Auto-refresh playlist if tracks are added, removed, or changed:
            this.tracks.on('add remove change', this.refresh);
        },

        /**
         * Set the active track to another track.
         * @param  {models.Track} track
         */
        setActiveTrack: function(track) {
            this.activeTrackIndex = this.tracks.indexOf(track);
        },

        /**
         * Get the currently active track (defaults to the first track or null).
         */
        getActiveTrack: function() {
            console.log('get active track');
            return this.tracks.at(this.activeTrackIndex) || this.getNextTrack();
        },

        /**
         * Get the next active track (currently assuming that playlist will be
         * repeated).
         *
         * Also updates the activeTrackIndex.
         */
        getNextTrack: function() {
            var nextIndex = (this.activeTrackIndex + 1) % this.tracks.length;

            this.activeTrackIndex = nextIndex;

            return this.tracks.at(nextIndex);
        },


        /**
         * Refresh the playlist after something has changed.
         *
         * Re-calculates total duration of tracks.
         */
        refresh: function() {
            var tracks = this.tracks,
                numTracks = this.tracks.length,
                i = this.activeTrackIndex;

            this.set('duration', numTracks > 0 ? tracks.getDuration() : 0);

            // // If the currently active track was deleted, let's activate the
            // // previous track in the playlist, so that the next playing track
            // // will be the expected track.
            // while (!tracks.at(i)) {
            //     i = (numTracks + i - 1) % numTracks;
            // }
            // if (i !== this.activeTrackIndex) {
            //     console.log('Changing the active track in the playlist');
            //     this.trigger('tracks:active:changed');
            // }
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
            var dfd = $.Deferred();

            SC.get('/resolve', { url: url }, _.bind(function(track, error) {
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

                    dfd.resolve(this.tracks.create(track));
                } else {
                    dfd.reject({
                        message: "This URL does not go to a soundcloud track."
                    });
                }

            }, this));

            return dfd.promise();
        }

    });

    /**
     * A collection of Playlists.
     *
     * @type {Backbone.Collection}
     */
    Playlists = Backbone.Collection.extend({
        model: Playlist,
        localStorage: new Store("sc-playlists"),

        initialize: function() {
            _.bindAll(this);

            this.fetch();

            // Always have at least one playlist.
            if (this.length === 0) {
                this.create();
            }
        },

        /**
         * Create a new playlist and set it as active.
         * @type {[type]}
         */
        create: function() {
            var newPlaylist = Playlists.__super__.create.call(this);
            this.trigger('playlists:activate', newPlaylist);
        }

    });

    return {
        Track: Track,
        Tracks: Tracks,
        Playlist: Playlist,
        Playlists: Playlists,
        App: App
    };

});
