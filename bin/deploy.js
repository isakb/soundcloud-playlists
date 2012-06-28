/**
 * Deploy to rackspace cloudfiles
 * Dependency: just run npm install
 * Also needs a .rackspace-config.json with your account config
 */
/*jshint node:true */
"use strict";

var fs = require('fs'),
    _ = require('underscore'),
    cloudfiles = require('cloudfiles'),
    DIR = __dirname,
    MANIFEST = fs.readFileSync(DIR + '/../src/cache.manifest', 'utf8'),
    FILES = MANIFEST.split('\n').slice(1, -1),
    config,
    json,
    container,
    client,
    doneCallback;

try {
    json = fs.readFileSync(DIR + '/../.rackspace-config.json', 'utf8');
    config = JSON.parse(json);
} catch (e) {
    console.error('Please check your config file:');
    throw e;
}

client = cloudfiles.createClient(config);
container = config.container;

console.log('Rackspace Cloud Files container: %s', container);
console.log('These files will be deployed:');
console.log(' - ' + FILES.join('\n - '));
console.log('\nPress Ctrl+C to abort.\n');

console.log('Authenticating...');
client.setAuth(function() {
    var filesRemaining = FILES.length;

    console.log('Starting upload of %d files...', filesRemaining);
    _.each(FILES, function(file) {
        client.addFile(container, {
            remote: file,
            local: DIR + '/../build/' + file
        }, function (err, uploaded) {
            if (err) {
                console.error('ERROR:', err);
            } else if (uploaded) {
                console.log('OK: %s', file, uploaded );
                filesRemaining -= 1;
            } else {
                console.log("I don't know if this will happen.");
            }

            if (filesRemaining === 0) {
                doneCallback();
            }
        });
    });
});

doneCallback = function() {
    console.log('\nAll files uploaded.');
};
