/**
 * All playlists View / Controller.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    '../models/models',
    '../helpers/template_helpers',
    'text!../templates/playlists.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    models,
    templateHelpers,
    playlistsTemplate
){
    "use strict";

    var PlaylistsView;

    PlaylistsView = Backbone.View.extend({
        el: '#playlists',
        template: _.template(playlistsTemplate),

        events: {
            'click .playlist':          'onClickPlaylist',
            'click .new-playlist':      'onClickNew',
            'click .delete':            'onClickDelete'
        },

        initialize: function() {
            this.activePlaylist = this.collection.where({ isActive: true })[0];
            _.bindAll(this);
            this.collection.on('playlists:activate', this.setActivePlaylist);
            this.collection.on('change add remove', this.render);
        },

        getActivePlaylist: function() {
            return this.activePlaylist;
        },

        setActivePlaylist: function(playlist) {
            if (this.activePlaylist) {
                this.activePlaylist.set('isActive', false);
            }
            this.activePlaylist = playlist;
            playlist.set('isActive', true);
            this.render();

            EventHub.trigger('playlists:change-playlist', playlist);
        },

        render: function() {
            var activeIndex = this.collection.indexOf(this.activePlaylist),
                activeElement;

            this.$el.html(this.template({
                playlists: this.collection.toJSON()
            }));

            activeElement = this.$('.playlist:nth-child(' + (1 + activeIndex) +')');
            activeElement.addClass('active');

            return this;
        },

        onClickPlaylist: function(e) {
            var index = $(e.target).data('index');
            this.setActivePlaylist(this.collection.at(index));
        },

        onClickNew: function(e) {
            this.collection.create();
        },

        onClickDelete: function(e) {
            var index, playlist, nextIndex;

            e.stopPropagation();

            index = $(e.target).closest('li').data('index');
            if (this.collection.length <= 1) {
                window.alert('You are not allowed to remove the last playlist');
            } else {
                playlist = this.collection.at(index);

                // If the active playlist is deleted, let's activate another.
                if (playlist === this.activePlaylist) {
                    nextIndex = (index + 1) % this.collection.length;
                    this.setActivePlaylist(this.collection.at(nextIndex));
                }

                playlist.destroy();
            }
        }
    });

    return PlaylistsView;

});
