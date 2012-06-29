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

        initialize: function() {
            _.bindAll(this);

            this.render(); // creates DOM nodes that the components need

            this.renderComponents();

            this.playlist.on('tracks:clicked',
                _.bind(this.player.playTrack, this.player));

            EventHub.on('playlist-activated', this.onChangePlaylist);
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
         * When the user activates another playlist, let's also load that in the
         * playlist view and activate the same playlist in the player.
         *
         * @param  {models.Playlist} playlist
         */
        onChangePlaylist: function(playlist) {
            this.playlist.changeModel(playlist);
            this.player.changeModel(playlist);
        }

    });

    return AppView;

});
