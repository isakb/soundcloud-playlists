/**
 * View / Controller for the SoundCloud track player widget.
 *
 * NB: Using SC Widget API here, not SC JS SDK.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    'sc_api',
    '../models/models',
    'text!../templates/player.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    SC,
    models,
    playerTemplate
){
    "use strict";
    var PlayerView,
        console = window.console;

    /**
     * The Soundcloud Widget (track player).
     */
    PlayerView = Backbone.View.extend({
        el: '#sc-player',

        initialize: function() {
            _.bindAll(this);
            // Create the iframe, not attached to DOM yet.
            this.$iframe = $(playerTemplate);
            this.changeModel(this.model);
        },

        render: function() {
            this.$el.html('');
            return this;
        },

        /**
         * Create the widget if not already created, and load first track in
         * playlist.
         *
         * Should not be called before we have at least one track to play.
         */
        initWidget: function() {
            var src, config, track;

            if (this.widget) {
                return; // FIXME: probably unnecessary defensive programming
            }

            track = this.model.getActiveTrack();

            if (!track) {
                return;
            }
            config = _.extend({
                url:  track.get('uri')
            }, this.options.widgetParams);
            src = "http://w.soundcloud.com/player/?" + $.param(config);

            this.$iframe.attr('src', src);
            this.$el.replaceWith(this.$iframe);
            this.widget = SC.Widget(this.$iframe[0]);
        },

        initWidgetEvents: function() {
            if (!this.widget) {
                return;
            }
            _.each(this.onWidget, function(callback, eventName) {
                this.widget.bind(SC.Widget.Events[eventName], _.bind(callback, this));
            }, this);
        },


        // see: http://developers.soundcloud.com/docs/api/html5-widget#events
        onWidget: {

            // fired when the widget has loaded its data and is ready to accept
            // external calls.
            READY: function(player, data) {
                console.log('wiget:player:ready');
            },

            // fired when the sound begins to play.
            PLAY: function() {
                console.log('Starting to play track.');
            },

            // fired when the sound finishes.
            FINISH: function() {
                EventHub.trigger('player:finished-track');
                debugger
                // var nextTrack = this.model.getNextTrack();

                // if (nextTrack) {
                //     this.playTrack(nextTrack);

                // }
            }
        },

        /**
         * Play a track in the player.
         *
         * @param  {models.Track} track
         */
        playTrack: function(track) {
            var widget = this.widget;

            widget.load(track.get('uri'), this.options.widgetParams);
        },

        /**
         * Change to another playlist.
         *
         * @param {models.Playlist} playlist
         */
        changeModel: function(playlist) {
            playlist.on('change', this.maybeRefreshWidget);

            this.model = playlist;
            if (this.widget) {
                this.maybeRefreshWidget();
            } else {
                this.initWidget();
            }
            this.initWidgetEvents();
        },

        /**
         * In case the widget was hidden because the playlist had no tracks,
         * we may need to refresh the widget as the playlist changes.
         *
         */
        maybeRefreshWidget: function() {
            var activeTrack;

            if (!this.widget) {
                console.log('asdf');
                return;
            }

            activeTrack = this.model.getActiveTrack();

            if (activeTrack) {
                this.widget.load(activeTrack.get('uri'));
                this.$iframe.slideDown({duration: 50});
                this.$iframe.show();
            }
        }

    });


    return PlayerView;

});
