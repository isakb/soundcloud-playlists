define(['underscore', 'jquery', 'backbone'],
function(_, $, Backbone){
    "use strict";
    var App,
        Track,
        Playlist,
        PlaylistView;

    App = _.extend(Backbone.Event);

    Track = Backbone.Model.extend({

        defaults: {
            name: 'Unknown track',
            length: 'Unknown length'
        },

        // The URL to the soundcloud track
        url: ''
    });

    Playlist = Backbone.Collection.extend({
        model: Track
    });

    PlaylistView = Backbone.View.extend({

        initialize: function() {
            this.template = $("#playlistTemplate").html();
            this.collection.bind('add', this.render, this);
            this.collection.bind('remove', this.render, this);
        },

        render: function() {
            // jQuery templates:
            var content = _.template(this.template);
            $(this.el).html(content);

            _.each(this.collection, function() {
                this.$('ul').append('<li>ok</li>');
            });
            return this;
        }
    });

    return {
        App: App,
        Track: Track,
        Playlist: Playlist,
        PlaylistView: PlaylistView
    };

});
