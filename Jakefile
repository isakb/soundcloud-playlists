/**
 * Install deps, build and test.
 */
desc('Default task - install deps, build and test.');
task("default", ['deps', 'build:clean', 'build', 'server', 'test'], function() {
    console.log('OK');
});

/**
 * Install all dependencies.
 */
desc('Install all dependencies');
task("deps", function() {
    console.log("- Checking/Installing dependencies ...\n");
    jake.exec(["npm install"], function() {}, {
        stdout: true,
        stderr: true
    });
    jake.exec(["git submodule update --init"], function() {}, {
        stdout: true,
        stderr: true
    });
});

/**
 * Run unit tests from console.
 */
desc('Run unit tests in phantomjs (assuming that you have started the server)');
task('test', [], function() {
    jake.exec(["./vendor/qutest/run http://localhost:8888/test.html"], function() {}, {
        stdout: true,
        stderr: true
    });
});

/**
 * JS Syntax check.
 */
desc('Check JS syntax (JSHint check)');
task("check", function() {
    jake.exec(['node_modules/.bin/jshint --show-non-errors --config ./.jshintrc .'], function() {}, {
        stdout: true,
        stderr: true
    });
});

/**
 * Start the static file server.
 */
desc('Start static file server');
task('server', function() {

    jake.exec(["node ./bin/server.js 8888"], function() {}, {
        stdout: true,
        stderr: true
    });

});

/**
 * Building + optimizing code using r.js.
 */
desc('Optimize code using r.js');
task('build', ['build:clean'], function() {
    jake.exec(["node node_modules/requirejs/bin/r.js -o bin/build.js"], function() {}, {
        stdout: false,
        stderr: true,
        breakOnError: true
    }, function() {
        console.log("Built files are found in the ./build folder");
    });
});

/**
 * Clean build.
 */
namespace('build', function() {
    desc("Clean build directory");
    task('clean', [], function() {
        console.log("- Removing './build' directory");
        jake.exec(["rm -rf ./build"]);
    });
});
