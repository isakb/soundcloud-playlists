/**
 * Main App View / Controller.
 */
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

    var AppView,
        console = window.console;

    AppView = Backbone.View.extend({

        el: '#soundcloud-playlists',
        template: _.template(appTemplate),

        initialize: function() {
            // First render, so the components have elements.
            this.render();

            _.bindAll(this);

            this.initComponents();

            this.playlist.bind('tracks:clicked', this.player.playTrack, this.player);

            EventHub.on('playlist-activated', this.onChangePlaylist);

            // Assuming that fetch is done on a local storage, initialization
            // can take place already here.
            //this.initComponents();
        },

        initComponents: function() {
            this.playlists = new PlaylistsView({
                collection: new models.Playlists()
            }).render();

            this.playlist = new PlaylistView({
                model: this.playlists.getActivePlaylist()
            }).render();

            this.player = new PlayerView({
                startUrl:       this.options.playerStartUrl,
                widgetParams: {
                    auto_play:      true,
                    show_user:      true,
                    sharing:        false, // FB sharing code throws errors
                    start_track:    0
                }
            }).render();
        },


        render: function() {
            console.log('render app');
            this.$el.html(this.template(this.options));
            return this;
        },

        onChangePlaylist: function(playlist) {
            console.log('Changing to another playlist');
            this.playlist.changeModel(playlist);
        }

    });

    return AppView;

});
