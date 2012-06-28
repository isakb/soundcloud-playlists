// see https://github.com/jrburke/r.js/blob/master/build/example.build.js

({
    appDir: '../src',

    //By default, all modules are located relative to this path. If baseUrl
    //is not explicitly set, then all modules are loaded relative to
    //the directory that holds the build file. If appDir is set, then
    //baseUrl should be specified as relative to the appDir.
    baseUrl: './', // src/js

    dir: '../build',

    //mainConfigFile: '../src/config.js',

    modules: [{
        name: 'main',
        exclude : [
            //"jquery"
        ]
    }],

    // wrap: {
    //     start: "(function(window){'use strict';",
    //     end: "}(this));"
    // },

    optimize: 'uglify',

    //See https://github.com/mishoo/UglifyJS for the possible values.
    uglify: {
        beautify: false
    },

    optimizeCss: "standard.keepLines"

    // // Include 'use strict' in all files
    // useStrict: true
})
