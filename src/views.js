define(['underscore', 'jquery', 'backbone', 'sc_api', './models', './all_templates'],
function(_, $, Backbone, SC, models, T){
    "use strict";
    var console = window.console,
        AppView,
        PlaylistView,
        PlayerView;

    PlaylistView = Backbone.View.extend({
        el: '#playlist',
        template: T.playlist,

        events: {
            'click li': 'onClickTrack'
        },

        initialize: function() {
            this.tracks = this.model.get('tracks');

            _.bindAll(this);

            this.model.bind('change', this.render);
            this.tracks.bind('add', this.render);
            this.tracks.bind('remove', this.render);
        },

        render: function() {
            console.log('Rendering playlist view');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onClickTrack: function(e) {
            var id = $(e.target).data('scTrack');
            console.log("clicked on a track: %d", id);
            this.trigger('tracks:clicked', this.tracks.get(id));
        }
    });

    PlayerView = Backbone.View.extend({
        el: '#sc-player',
        template: T.player,

        initialize: function() {
            var widget;
            this.options = _.extend({
                baseUrl: "http://w.soundcloud.com/player/?url=" +
                    encodeURIComponent(this.options.firstTrack)
            });
            this.render();
            this.widgetIframe = this.$('iframe')[0];
            widget = SC.Widget(this.widgetIframe);

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
            widget.load(track.url());



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
            this.playlist = new PlaylistView({ model: this.playlist });
            this.player = new PlayerView();

            this._renderComponents();

            this.playlist.bind('tracks:clicked', this.player.playTrack, this.player);
        },

        render: function() {
            this.$el.html(this.template(this.options));
            return this;
        },

        _renderComponents: function() {
            this.playlist.render();
            this.player.render();
        }

    });

    return {
        AppView: AppView
    };

});
