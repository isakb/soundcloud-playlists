/**
 * View / Controller for the SoundCloud track player widget.
 */
define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    'sc_sdk',
    '../models/models',
    '../helpers/template_helpers',
    'text!../templates/player.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    SC,
    models,
    templateHelpers,
    playerTemplate
){
    "use strict";
    var PlayerView;

    /**
     * The Soundcloud Widget (track player).
     */
    PlayerView = Backbone.View.extend({
        el: '#player',
        template: _.template(playerTemplate),

        // User actions:
        events: {
            'click .play':  'onClickPlay',
            'change .slider': 'onSeek'
        },

        /**
         * Events from SoundManager 2.
         * See http://www.schillmania.com/projects/soundmanager2/doc/
         *
         *  Unused events that might be useful later:
         *
         *  onload:         'onSoundLoad',
         *  onresume:       'onSoundResume',
         *  onsuspend:      'onSoundSuspend',
         *  onstop:         'onSoundStop',
         *  whileloading:   'whileSoundLoading',
         *
         * And the ones we actually need:
         */
        soundEvents: {
            onfinish:       'onSoundFinish',
            onpause:        'onSoundPause',
            onplay:         'onSoundPlay',
            whileplaying:   'whileSoundPlaying'
        },

        // Temporary placeholder picture.
        // Just to have something to look at, in case there is neither an
        // artwork_url or a user.avatar_url for the track.
        default_artwork_url: 'http://farm2.staticflickr.com/1165/644335254_4b8a712be5_s.jpg',

        initialize: function() {
            _.bindAll(this);
            this.changeModel(this.model);
        },

        render: function() {
            var tplVars;

            if (!this.track) {
                return this;
            }

            tplVars = this.track.toJSON();

            if (!tplVars.artwork_url) {
                tplVars.artwork_url =
                    tplVars.user_avatar_url || this.default_artwork_url;
            }
            _.extend(tplVars, templateHelpers);

            this.$el.html(this.template(tplVars));

            this.$interactive = this.$('.interactive');
            this.$slider = this.$('.slider');
            this.$currentTime = this.$('.current-time');
            this.$play = this.$('.play');

            this.isRendered = true;

            this.refresh();

            return this;
        },

        refresh: function() {
            this.track = this.model.getActiveTrack();
            if (!this.isRendered) {
                this.render();
            }
            this.$play.prop('disabled', !this.track);
            if (!this.sound) {
                this.$interactive.hide();
            } else {
                this.$interactive.show();
            }
            if (this.isPlaying()) {
                this.$play.addClass('playing');
            } else {
                this.$play.removeClass('playing');
            }
        },

        isPlaying: function() {
            return this.sound && !this.sound.paused;
        },

        /**
         * Play a track in the player.
         *
         * @param  {models.Track} track
         */
        playTrack: function(track) {
            if (this.sound) {
                this.sound.stop();
            }
            if (!track.get('streamable')) {
                throw new Error('Not a streamable track: ' + track.get('uri'));
            }
            SC.stream(track.get('stream_url'), this.onStreamReady);
        },

        // when the stream is ready
        onStreamReady: function(sound){
            var options = {};

            this.sound = sound;

            _.each(this.soundEvents, function(callback, eventName) {
                options[eventName] = this[callback];
            }, this);

            sound.play(options);
        },

        // when sound is loaded and starts to play
        onSoundPlay: function() {
            this.refresh();
            this.render();
        },

        onSoundPause: function() {
            this.refresh();
        },

        onSoundFinish: function() {
            EventHub.trigger('player:finished-track');
        },

        whileSoundPlaying: function() {
            // only update current location 10 times per second
            var ms = this.sound.position,
                tenthSeconds = (ms / 100)|0;

            if (tenthSeconds !== this._lastTenthSeconds) {
                this.$slider.val(ms);
                this.$currentTime.text(templateHelpers.formatShortTime(ms));
            }

            this._lastTenthSeconds = tenthSeconds;
        },

        onClickPlay: function() {
            if (!this.sound) {
                this.playTrack(this.model.getActiveTrack());
            } else {
                if (this.sound.paused) {
                    this.sound.play();
                } else {
                    this.sound.pause();
                }
                this.refresh();
            }
        },

        onSeek: function() {
            this.sound.setPosition(this.$slider.val());
        },

        /**
         * Change to another playlist.
         *
         * @param {models.Playlist} playlist
         */
        changeModel: function(playlist) {
            this.model = playlist;
            this.track = this.model.getActiveTrack();
            this.render(); // FIXME also done in app.js initialize
        }


    });


    return PlayerView;

});
