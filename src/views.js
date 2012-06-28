/**
 * NB: Using SC Widget API here, not SC JS SDK.
 */
define(['underscore', 'jquery', 'backbone', 'sc_api',
        './models', './all_templates', './template_helpers'],
function(_, $, Backbone, SC,
         models, T, templateHelpers){
    "use strict";
    var console = window.console,
        AppView,
        PlaylistView,
        PlaylistsView,
        PlayerView;

    /**
     * All of the user's playlists.
     */
    PlaylistsView = Backbone.View.extend({
        el: '#playlists',
        template: T.playlists,

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

    /**
     * The active playlist.
     */
    PlaylistView = Backbone.View.extend({
        el: '#playlist',
        template: T.playlist,

        events: {
            'click .meta':              'onClickMeta',
            'click tbody tr':           'onClickTrack',
            'click .abort':             'onClickAbort',
            'click .delete':            'onClickDeleteTrack',
            'submit form.edit-meta':    'onEditPlaylist',
            'submit form.add-track':    'onAddTrack'
        },

        initialize: function() {
            if (!this.model) {
                this.model = new models.Playlist();
            }
            this.tracks = this.model.get('tracks');

            _.bindAll(this);

            this.options._isEditingMeta = false;
            this.model.bind('change', this.render);
            this.tracks.bind('add', this.render);
            this.tracks.bind('remove', this.render);

            this.render();
        },

        render: function() {
            var html,
                tplVars = _.extend({},
                                   this.model.toJSON(),
                                   templateHelpers);

            html = (this.overrideTemplate || this.template)(tplVars);
            this.$el.html(html);
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
            var i = $(e.target).closest('tr').data('trackIndex');
            this.trigger('tracks:clicked', this.tracks.at(i));
        },

        // when user clicks on the playlist title or description
        onClickDeleteTrack: function(e) {
            var i, track;

            e.preventDefault();
            e.stopPropagation();

            i = $(e.target).closest('tr').data('trackIndex');
            track = this.tracks.at(i);

            this.tracks.remove(track);
        },


        // when user cancels editing details
        onClickAbort: function(e) {
            delete this.overrideTemplate;
            this.render();
        },


        // when user clicks on the playlist title or description
        onClickMeta: function(e) {
            this.overrideTemplate = T.playlist_edit;
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


    /**
     * The Soundcloud Widget (track player).
     */
    PlayerView = Backbone.View.extend({
        el: '#sc-player',
        template: T.player,

        initialize: function() {
            var widget,
                that = this;

            this.options = _.extend({
                baseUrl: "http://w.soundcloud.com/player/?url=" +
                    encodeURIComponent(this.options.startUrl) +
                    '&' + $.param(this.options.widgetParams)
            }, this.options);

            this.render();

            this.widgetIframe = this.$('iframe')[0];
            widget = SC.Widget(this.widgetIframe);

            widget.bind(SC.Widget.Events.READY, function() {
                console.log('widget ready event');
                that.trigger('widget:ready');
                widget.bind(SC.Widget.Events.FINISH, function() {
                    console.log('widget finish event');
                    that.trigger('widget:finish');
                    // widget.load(nextTrackUrl);
                });
            });
            this.widget = widget;
        },

        render: function() {
            this.$el.html(this.template(this.options));
            return this;
        },

        /**
         * Play a track in the player.
         * @param  {models.Track} track
         */
        playTrack: function(track) {
            var widget = this.widget;

            console.log('Widget is loading track:', track);
            widget.load(track.get('uri'), this.options.widgetParams);
        }
    });

    AppView = Backbone.View.extend({
        el: 'body',
        template: T.app,

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

    return {
        AppView: AppView
    };

});
