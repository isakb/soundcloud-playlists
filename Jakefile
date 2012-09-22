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
    jake.exec([
        "npm install",
        "git submodule update --init"
    ], complete, {
        stdout: true,
        stderr: true
    });
}, {async: true});

/**
 * Run unit tests from console.
 */
desc('Run unit tests in phantomjs (first run jake:build and jake:server &)');
task('test', [], function() {
    jake.exec([
        "./vendor/qutest/run --show_details=true http://localhost:8888/test.html " + process.argv.slice(3)
    ], complete, {
        stdout: true,
        stderr: true
    });
}, {async: true});

/**
 * Start the static file server.
 */
desc('Start static file server');
task('server', function() {
    jake.exec([
        "node ./bin/server.js 8888"
    ], complete, {
        stdout: true,
        stderr: true
    });
}, {async: true});

/**
 * Building + optimizing code using r.js.
 */
desc('Build optimized code using r.js');
task('build', ['clean'], function() {
    console.log('Building optimized code');
    jake.exec([
        "coco -bc $(find src -name '*.coco')",
        "node node_modules/requirejs/bin/r.js -o bin/build.js",
        "mv build/index_prod.html build/index.html",

        // Remove a bunch of unnecessary files from build:
        "find build/* -type d | xargs rm -rf",
        "find build/ -name '*.coco' -delete"
    ], function() {
        console.log("Built files are found in the ./build folder");
        complete();
    }, {
        stdout: true,
        stderr: true,
        breakOnError: true
    });
}, {async: true});

/**
 * Clean up after build.
 */
desc("Clean up after build");
task('clean', [], function() {
    console.log("- Removing './build' directory and built .js files.");
    jake.exec([
        "rm -rf ./build/",
        "find src/ -name '*.js' -delete"
    ], complete);
}, {async: true});

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
