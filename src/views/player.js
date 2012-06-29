/**
 * View / Controller for the SoundCloud track player widget.
 *
 * NB: Using SC Widget API here, not SC JS SDK.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    'sc_api',
    '../models/models',
    'text!../templates/player.html'
], function(
    _,
    $,
    Backbone,
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
        template: _.template(playerTemplate),

        initialize: function() {
            this.options = _.extend({
                baseUrl: "http://w.soundcloud.com/player/?url=" +
                    encodeURIComponent(this.options.startUrl) +
                    '&' + $.param(this.options.widgetParams)
            }, this.options);
        },

        onReady: function() {
            var widget,
                that = this;

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


    return PlayerView;

});
