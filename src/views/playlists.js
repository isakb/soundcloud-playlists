/**
 * All playlists View / Controller.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    '../models/models',
    '../helpers/template_helpers',
    'text!../templates/playlists.html'
], function(
    _,
    $,
    Backbone,
    models,
    templateHelpers,
    playlistsTemplate
){
    "use strict";

    var PlaylistsView;

    /**
     * All of the user's playlists.
     */
    PlaylistsView = Backbone.View.extend({
        el: '#playlists',
        template: _.template(playlistsTemplate),

        initialize: function() {
            if (this.collection.size() === 0) {
                this.collection.add(new models.Playlist());
            }
            this.activePlaylist = this.collection.at(0);
            this.render();
        },

        getActivePlaylist: function() {
            return this.activePlaylist;
        },

        render: function() {
            this.$el.html(this.template({
                playlists: this.collection.toJSON(),
                activePlaylist: this.activePlaylist
            }));
            return this;
        }
    });

    return PlaylistsView;

});
