/**
 * Show available tasks by default.
 */
desc('Default task - show available tasks');
task("default", [], function() {
    jake.exec(["jake -T"], function() {}, {
        stdout: true,
        stderr: true
    });
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
desc('Run unit tests in phantomjs (first run jake:build and jake:server &)');
task('test', [], function() {
    jake.exec(["./vendor/qutest/run http://localhost:8888/test.html " + process.argv.slice(3)], function() {}, {
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
desc('Build optimized code using r.js');
task('build', ['clean'], function() {
    console.log('Building optimized code');
    jake.exec(["node node_modules/requirejs/bin/r.js -o bin/build.js",
                "mv build/index_prod.html build/index.html",
                // Let's just remove a bunch of unnecessary files from build:
                "find build/* -type d | xargs rm -rf"], function() {}, {
        stdout: true,
        stderr: true,
        breakOnError: true
    }, function() {
        console.log("Built files are found in the ./build folder");
    });
});

/**
 * Clean build.
 */
desc("Clean build directory");
task('clean', [], function() {
    console.log("- Removing './build' directory");
    jake.exec(["rm -rf ./build/"]);
});

/**
 * Deploy relevant build files to the cloud
 */
desc('Deploy to cloud file hosting');
task("deploy", function() {
    jake.exec(['node bin/deploy.js'], function() {}, {
        stdout: true,
        stderr: true
    });
});
