define(['underscore', 'jquery', 'backbone'],
function(_, $, Backbone){
    "use strict";
    var Track, Tracks, Playlist, Playlists;

    /**
     * A single Soundcloud track.
     *
     * @type {Backbone.Model}
     */
    Track = Backbone.Model.extend({
        urlRoot: location.protocol + '//api.soundcloud.com/tracks/',

        defaults: {
            id: 0,
            title: 'Unknown track',
            duration: 0
        },

        initialize: function() {}
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
            duration: 0,
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
            var that = this;

            url += '/properties';

            // There doesn't seem to be any JSONP or CORS support at these
            // soundcloud resources (at least not when running from localhost),
            // so let's make a workaround, using YQL as a proxy (since I am
            // not planning to make my own backend for this project).
            url = "http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20html%20where%20url%3D%22"+
                encodeURIComponent(url)+ "%22&format=json";

            $.ajax({
                dataType: 'jsonp',
                url: url
            })
            .done(function(result) {
                var json, trackDetails;

                try {
                    json = result.query.results.body.p;
                    trackDetails = JSON.parse(json);
                } catch(e) {
                    // FIXME: indicate error
                    console.error('Could not find track properties.', e);
                    return;
                }

                that.get('tracks').add(trackDetails);
            })
            .fail(function() {
                // FIXME: indicate error
                console.error('YQL request failed');
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
