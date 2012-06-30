define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    '../models/models',
    './playlists',
    './playlist',
    './player',
    'text!../templates/app.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    models,
    PlaylistsView,
    PlaylistView,
    PlayerView,
    appTemplate
){
    "use strict";

    var AppView;

    /**
     * Main App View / Controller.
     */
    AppView = Backbone.View.extend({
        el: '#soundcloud-playlists',
        template: _.template(appTemplate),

        // Bind to a global EventHub's events:
        onEventHub: {
            'playlists:change-playlist':    'onChangedPlaylist',
            'playlist:change-track':        'onChangedTrack',
            'player:finished-track':        'onPlayerFinishedTrack'

        },

        initialize: function() {
            var trackUrl;

            _.bindAll(this);

            this.render(); // creates DOM nodes that the components need

            this.renderComponents();

            _.each(this.onEventHub, function(callbackName, event) {
                EventHub.on(event, this[callbackName]);
            }, this);

            // Allow to add tracks with the bookmarklet:
            try {
                trackUrl = decodeURIComponent(
                    location.search.match(/\baddTrack=([^&]+)/)[1]);
                this.playlist.addTrackFromUrl(trackUrl);
            } catch (e) {
                console.error(e);
            }

        },

        /**
         * Render the layout of the app.
         */
        render: function() {
            this.$el.html(this.template(this.options));
            return this;
        },

        /**
         * Initialize and render the player, playlist, and playlists nav bar.
         */
        renderComponents: function() {
            this.playlists = new PlaylistsView({
                collection: new models.Playlists()
            }).render();

            this.playlist = new PlaylistView({
                model: this.playlists.getActivePlaylist()
            }).render();

            this.player = new PlayerView({
                model: this.playlists.getActivePlaylist(),
                widgetParams: {
                    auto_play: true,
                    show_user: true,
                    sharing: false // FB sharing code throws annoying errors.
                }
            }).render();
        },

        /**
         * The user clicked on another track in the playlist. Play it.
         *
         * @param  {models.Track} track
         */
        onChangedTrack: function(track) {
            this.player.playTrack(track);
        },

        /**
         * The player has played the whole track. Start playing next track,
         * indicate the change also in the playlist view.
         *
         * @param  {models.Track} track
         */
        onPlayerFinishedTrack: function() {
            var track = this.playlist.model.getNextTrack();

            if (track) {
                this.player.playTrack(track);
                this.playlist.activateTrack(track);
            }
        },

        /**
         * When the user activates another playlist, let's also load that in the
         * playlist view and activate the same playlist in the player.
         *
         * @param  {models.Playlist} playlist
         */
        onChangedPlaylist: function(playlist) {
            this.playlist.changeModel(playlist);
            this.player.changeModel(playlist);
        }

    });

    return AppView;

});
