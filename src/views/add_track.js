define([
    'underscore',
    'backbone',
    '../events',
    'text!../templates/add_track.html'
], function(
     _,
    Backbone,
    EventHub,
    addTrackTemplate
){
    "use strict";

    var AddTrackView;


    /**
     * View / Controller for the "add track to playlist" form.
     */
    AddTrackView = Backbone.View.extend({
        el: '#playlist-add-track',
        template: _.template(addTrackTemplate),

        events: {
            'click .submit': 'onAddTrack'
        },

        initialize: function() {
            _.bindAll(this);
        },

        /**
         * Change the playlist model used
         *
         * @param  {models.Playlist} playlist The new model
         */
        changeModel: function(playlist) {
            this.model = playlist;
        },

        render: function() {
            var tplVars = this.model.toJSON();

            tplVars.appUrl =
                location.protocol + '//' + location.hostname +
                (location.port === '80' ? '' : (':' + location.port)) +
                location.pathname;

            tplVars.bookmarkletUrl =
                tplVars.appUrl.replace('index.html', 'bookmarklet.js');

            this.$el.html(this.template(tplVars));

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
                this.addTrackFromUrl(url);
            }
            this.render();
        },

        /**
         * Add a track from a typical Soundcloud track URL, e.g.:
         * http://soundcloud.com/isakba/mahadatest6
         *
         * @param {String} trackUrl
         */
        addTrackFromUrl: function(trackUrl) {
            this.model.addTrackFromUrl(trackUrl)
            .done(function(track){
                EventHub.trigger('add-track-form:track-added', track);
            })
            .fail(function(error) {
                window.alert('Sorry! Not a valid track URL: ' + trackUrl);
            });
        }

    });


    return AddTrackView;

});
