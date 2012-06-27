/**
 * Helper for a Souncloud App, that wishes to use the JS SDK.
 */
define(['sc_sdk', './sc_app_config'], function(SC, config) {
    "use strict";

    // initialize SC client with app credentials
    SC.initialize(config);

    return SC;

});
