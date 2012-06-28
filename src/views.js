define(['underscore', 'jquery', 'backbone', 'sc_api',
        './models', './all_templates', './template_helpers'],
function(_, $, Backbone, SC_API,
         models, T, templateHelpers){
    "use strict";
    var console = window.console,
        AppView,
        PlaylistView,
        PlayerView;

    PlaylistView = Backbone.View.extend({
        el: '#playlist',
        template: T.playlist,

        events: {
            'click .meta':              'onClickMeta',
            'click tbody tr':           'onClickTrack',
            'click a.abort':            'onClickAbort',
            'submit form.edit-meta':    'onEditPlaylist',
            'submit form.add-track':    'onAddTrack'
        },

        initialize: function() {
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
                this.model.addTrackFromUrl(url);
            }
            this.render();
        },

        // when user clicks on a track in the playlist
        onClickTrack: function(e) {
            var id = $(e.target).closest('tr').data('scTrack');
            console.log("clicked on a track: %d", id);
            this.trigger('tracks:clicked', this.tracks.get(id));
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
        },

        // when user is editing details of playlist and submits the form
        onEditPlaylist: function(e) {
            var name, description;

            e.preventDefault();

            delete this.overrideTemplate;

            name = this.$('form [name=name]').val() || 'no-name';
            description = this.$('form [name=description]').val()

            // Since I'm using a very lightweight templating library
            // I will have to take care of escaping HTML myself:
            name = $('<div/>').text(name).html();
            description = $('<div/>').text(description).html();

            this.model.set('description', description);
            this.model.set('name', name);
            this.model.save();

            this.render();
        }
    });

    PlayerView = Backbone.View.extend({
        el: '#sc-player',
        template: T.player,

        initialize: function() {
            var widget;

            this.options = _.extend({
                baseUrl: "http://w.soundcloud.com/player/?url=" +
                    encodeURIComponent(this.options.startUrl) +
                    '&' + $.param(this.options.widgetParams)
            }, this.options);
            this.render();
            this.widgetIframe = this.$('iframe')[0];
            widget = SC_API.Widget(this.widgetIframe);

            // widget.bind(SC.Widget.Events.READY, function() {
            //     console.log('widget ready event');
            //     widget.bind(SC.Widget.Events.FINISH, function() {
            //         console.log('widget finish event');
            //         widget.load(nextTrackUrl);
            //     });
            // });
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
            widget.load(track.url(), this.options.widgetParams);



        }
    });

    AppView = Backbone.View.extend({
        el: 'body',
        template: T.app,

        initialize: function() {
            // First render, so the components have elements.
            this.render();

            this.playlist = this.options.playlist;

            // Create the components:
            this.playlist = new PlaylistView({
                model: this.playlist
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
