define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    '../models/models',
    './auth',
    './playlists',
    './playlist',
    './player',
    './add_track',
    'text!../templates/app.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    models,
    AuthView,
    PlaylistsView,
    PlaylistView,
    PlayerView,
    AddTrackView,
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
            'add-track-form:track-added':   'onAddedTrack',
            'player:finished-track':        'onPlayerFinishedTrack'

        },

        initialize: function() {
            _.bindAll(this);

            this.render(); // creates DOM nodes that the components need

            this.renderComponents();

            _.each(this.onEventHub, function(callbackName, event) {
                EventHub.on(event, this[callbackName]);
            }, this);
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
            var user = new models.User(),
                playlists = new models.Playlists(),
                playlist;

            this.auth = new AuthView({
                model: user
            }).render();

            this.playlists = new PlaylistsView({
                collection: playlists
            }).render();

            // FIXME: getActivePlaylist should be a method of the model, not
            // the view.
            playlist = this.playlists.getActivePlaylist();

            this.playlist = new PlaylistView({
                model: playlist
            }).render();

            this.addTrack = new AddTrackView({
                model: playlist
            }).render();

            // TODO: Maybe the player should only have the track as a model, not
            // a whole playlist...
            this.player = new PlayerView({
                model: playlist,
                widgetParams: {
                    auto_play: true,
                    show_user: true,
                    sharing: false // FB sharing code throws annoying errors.
                }
            }).render();
        },

        /**
         * The user added a track in the playlist. Show the player if invisible.
         *
         * @param  {models.Track} track
         */
        onAddedTrack: function() {
            this.player.refresh();
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
            this.addTrack.changeModel(playlist);
        }

    });

    return AppView;

});
