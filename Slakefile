require! {
  fs
  child_process
}

{log, error} = console

run = (name, ...args) ->
  child_process.spawn(name, args)
    .stdout.on 'data', (buffer) -> log buffer  if buffer .= toString().trim()
    .stderr.on 'data', (buffer) -> error buffer  if buffer .= toString().trim()
    .on 'exit', (status) -> process.exit(1)  if status != 0


shell = (cmds, callback) ->
  cmds = [cmds]  unless Array.isArray(cmds)
  child_process.exec cmds.join(' && '), (err, stdout, stderr) ->
    log trimStdout  if trimStdout = stdout.trim()
    error stderr.trim()  if err
    process.exit(1)  if err
    callback() if callback

#
# Tasks
#

task "default", "Default task - show available tasks", ->
  run "slake -T"


task "deps", "Install all dependencies", ->
  log "- Checking/Installing dependencies ...\n"
  shell [
    "npm install",
    "git submodule update --init"
  ]


task "test", "Run unit tests in phantomjs (first run slake:build and slake:server &)", ->
  run "./vendor/qutest/run", "--show_details=true", "file://`pwd`/test.html " + process.argv.slice(3)


task "server", "Start static file server", ->
  run "node",  "./bin/server.js", "8888"


task "build", "Build optimized code using r.js", ->
  invoke "clean"
  log "Building optimized code"
  # Remove a bunch of unnecessary files from build:
  shell [
    "livescript -bc $(find src -name '*.ls')",
    "node node_modules/requirejs/bin/r.js -o bin/build.js",
    "mv build/index_prod.html build/index.html",
    "find build/* -type d | xargs rm -rf", "find build/ -name '*.ls' -delete"
  ]


task "clean", "Clean up after build", ->
  log "- Removing './build' directory and built .js files."
  shell [
    "rm -rf ./build/",
    "find src/ -name '*.js' -delete"
  ]


task "deploy", "Deploy to cloud file hosting", ->
  run "node", "bin/deploy.js"
