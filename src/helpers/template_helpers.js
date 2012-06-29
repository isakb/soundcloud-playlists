define(['underscore'], function(_) {
    "use strict";
    var pad;

    /**
     * Converts a postive number to an integer and returns it as a string,
     * possibly padded with leading zeroes.
     *
     * @param  {Number} number A number >= 0
     * @return {String}
     */
    pad = function(number) {
        var str = parseInt(number, 10);
        if (number < 0) {
            throw new Error('Negative numbers not supported.');
        }
        if (number < 10) {
            str = '0' + str;
        }
        return str;
    };

    return {
        // template helper function for converting track / playlist
        // durations from milliseconds to a readable format.
        formatDuration: function(ms) {
            var h, m, s, x;

            x = ms / 1000;
            s = x % 60;
            m = x / 60;
            h = m / 60;
            m = m % 60;

            return _.map([h, m, s], pad).join(':');
        }
    };
});
