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
            'click .meta': 'onClickMeta',
            'click tbody tr': 'onClickTrack'
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
            console.log('Rendering playlist view');
            this.$el.html(this.template(_.extend({},
                this.options,
                this.model.toJSON(),
                templateHelpers
            )));
            return this;
        },

        // when user clicks on a track in the playlist
        onClickTrack: function(e) {
            var id = $(e.target).closest('tr').data('scTrack');
            console.log("clicked on a track: %d", id);
            this.trigger('tracks:clicked', this.tracks.get(id));
        },

        // when user clicks on the playlist title or description
        onClickMeta: function(e) {
            this.options._isEditingMeta = !this.options._isEditingMeta;
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
