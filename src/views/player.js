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
    var PlayerView;

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

            track = this.model.getActiveTrack();

            if (this.widget || !track) {
                return;
            }

            config = _.extend({
                url:  track.get('uri')
            }, this.options.widgetParams);
            src = "http://w.soundcloud.com/player/?" + $.param(config);

            this.$iframe.attr('src', src);
            this.$el.replaceWith(this.$iframe);
            this.widget = SC.Widget(this.$iframe[0]);

            _.each(this.onWidget, function(callback, eventName) {
                this.widget.bind(SC.Widget.Events[eventName], _.bind(callback, this));
            }, this);
        },


        // see: http://developers.soundcloud.com/docs/api/html5-widget#events
        onWidget: {

            // fired when the widget has loaded its data and is ready to accept
            // external calls.
            READY: function() {},

            // fired when the sound begins to play.
            PLAY: function() {},

            // fired when the sound finishes.
            FINISH: function() {
                EventHub.trigger('player:finished-track');
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
            this.model = playlist;
            this.initWidget();
        }


    });


    return PlayerView;

});
