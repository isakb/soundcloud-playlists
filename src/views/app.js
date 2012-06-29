/**
 * Main App View / Controller.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    '../models/models',
    './playlists',
    './playlist',
    './player',
    'text!../templates/app.html'
], function(
    _,
    $,
    Backbone,
    models,
    PlaylistsView,
    PlaylistView,
    PlayerView,
    appTemplate
){
    "use strict";

    var AppView = Backbone.View.extend({

        el: '#soundcloud-playlists',
        template: _.template(appTemplate),

        initialize: function() {
            // First render, so the components have elements.
            this.render();

            this.playlists = new models.Playlists();

            // Create the components:
            this.playlists = new PlaylistsView({
                collection: this.playlists
            });
            this.playlist = new PlaylistView({
                model: this.playlists.getActivePlaylist()
            });

            this.player = new PlayerView({
                startUrl:       this.options.playerStartUrl,
                widgetParams: {
                    auto_play:      true,
                    // buying:         true,
                    // liking:         true,
                    // download:       true,
                    // sharing:        true,
                    // show_artwork:   true,
                    // show_comments:  true,
                    // show_playcount: false,
                    show_user:      true,
                    start_track:    0
                }
            });

            this.playlist.bind('tracks:clicked', this.player.playTrack, this.player);
        },

        render: function() {
            this.$el.html(this.template(this.options));
            return this;
        }

    });

    return AppView;

});
