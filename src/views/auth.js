define([
    'underscore',
    'jquery',
    'backbone',
    '../events',
    '../helpers/sc_client',
    'text!../templates/auth.html'
], function(
    _,
    $,
    Backbone,
    EventHub,
    SC,
    authTemplate
){
    "use strict";

    var AuthView;

    /**
     * Auth View / Controller.
     */
    AuthView = Backbone.View.extend({
        el: '#auth',
        template: _.template(authTemplate),

        events: {
            'click .login':     'onClickLoginOrLogout',
            'click .logout':    'onClickLoginOrLogout'
        },

        initialize: function() {
            _.bindAll(this);
            this.model.bind('change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        isLoggedIn: function() {
            return !!this.model.get('user_id');
        },

        logIn: function() {
            var that = this;

            SC.connect(function(){
                SC.get('/me', function(user) {
                    // Since id is a special field in Backbone.
                    user.user_id = user.id;
                    delete user.id;

                    that.model.set(user);
                    EventHub.trigger('sc:connected', user);
                });
            });
        },

        logOut: function() {
            SC.disconnect();
            this.model.clear({silent: true});
            this.model.set(this.model.defaults);
        },

        /**
         * When clicking on the login (connect) or logout link.
         */
        onClickLoginOrLogout: function(e) {
            if (!this.isLoggedIn()) {
                this.logIn();
            } else {
                this.logOut();
            }
        }

    });

    return AuthView;

});
