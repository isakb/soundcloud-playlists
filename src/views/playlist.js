/**
 * Active playlist View / Controller.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    '../models/models',
    '../helpers/template_helpers',
    'text!../templates/playlist.html',
    'text!../templates/playlist_edit.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    models,
    templateHelpers,
    playlistTemplate,
    editPlaylistTemplate
){
    "use strict";

    var PlaylistView,
        console = window.console;

    PlaylistView = Backbone.View.extend({
        el: '#playlist',
        template:       _.template(playlistTemplate),
        editTemplate:   _.template(editPlaylistTemplate),

        events: {
            'click .meta':              'onClickMeta',
            'click tbody tr':           'onClickTrack',
            'click .abort':             'onClickAbort',
            'click .delete':            'onClickDeleteTrack',
            'submit form.edit-meta':    'onEditPlaylist',
            'submit form.add-track':    'onAddTrack'
        },

        initialize: function() {
            _.bindAll(this);
            this.options._isEditingMeta = false;
            this.createModelBindings();
        },

        createModelBindings: function() {
            this.model.on('change', this.render);
            this.tracks = this.model.tracks;
            this.tracks.on('add remove', this.render);
        },

        destroyModelBindings: function() {
            this.model.off('change', this.render);
            delete this.tracks;
            this.model.tracks.off('add remove', this.render);
        },

        /**
         * Set the active track to another track.
         * @param  {models.Track} track
         */
        activateTrack: function(track) {
            this.model.setActiveTrack(track);
            this.render();
        },

        /**
         * Change the playlist model used in the view.
         * @param  {models.Playlist} playlist The new model
         */
        changeModel: function(playlist) {
            this.destroyModelBindings();
            this.model = playlist;
            this.createModelBindings();
            this.render();
        },

        render: function() {
            var activeElement,
                html,
                tplVars = _.extend({},
                                   this.model.toJSON(),
                                   { tracks: this.tracks.toJSON() },
                                   templateHelpers);

            html = (this.overrideTemplate || this.template)(tplVars);
            this.$el.html(html);

            activeElement = this.$('.tracks tr[data-track-index=' +
                this.model.activeTrackIndex +']');
            activeElement.addClass('active');

            return this;
        },

        // when user fills in a track URL and submits the form
        onAddTrack: function(e) {
            var url, $trackUrl;

            e.preventDefault();

            $trackUrl = this.$('form input[name=new_track]');
            url = $trackUrl.val();
            if (! /https?:\/\/.+/.test(url)) {
                $trackUrl
                    .val('Please enter the URL of the track here!')
                    .select();

                return;
            } else {
                this.model.addTrackFromUrl(url)
                .done(function(track){
                    console.log('Added track: %s to playlist', track.get('title'));
                })
                .fail(function(error) {
                    window.alert('Could not add that URL. ' + error.message);
                });
            }
            this.render();
        },

        // when user clicks on a track in the playlist
        onClickTrack: function(e) {
            var i = $(e.target).closest('tr').data('trackIndex'),
                track = this.tracks.at(i);

            if (track !== this.model.getActiveTrack()) {
                // If the track changed, we need to show the new active track.
                this.model.setActiveTrack(track);
                EventHub.trigger('playlist:change-track', track);
                this.render();
            }
        },

        // when user clicks on the playlist title or description
        onClickDeleteTrack: function(e) {
            var i;

            e.stopPropagation();

            i = $(e.target).closest('tr').data('trackIndex');
            this.tracks.at(i).destroy();
        },


        // when user cancels editing details
        onClickAbort: function(e) {
            delete this.overrideTemplate;
            this.render();
        },


        // when user clicks on the playlist title or description
        onClickMeta: function(e) {
            this.overrideTemplate = this.editTemplate;
            this.render();
            this.$('form [name=name]').select();
        },

        // when user is editing details of playlist and submits the form
        onEditPlaylist: function(e) {
            var name, description, cache;

            e.preventDefault();

            delete this.overrideTemplate;

            name = this.$('form [name=name]').val() || 'unnamed';
            description = this.$('form [name=description]').val();

            // Since I'm using a very lightweight templating library
            // I will have to take care of escaping HTML myself:
            name = $('<div/>').text(name).html();
            description = $('<div/>').text(description).html();

            cache = this.model.toJSON(); // To check if anything changed

            // This will trigger model change, which in turn re-renders this
            // view, if the user has modified any value in the form.
            this.model.set({
                description: description,
                name: name
            });

            // Hide the edit form also if no changes were made:
            if (_.isEqual(cache, this.model.toJSON())) {
                this.render();
            }
        }
    });


    return PlaylistView;

});
