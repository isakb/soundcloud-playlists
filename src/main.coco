/*!
 * Soundcloud Playlists application.
 *
 * https://github.com/isakb/soundcloud-playlists
 *
 * Copyright (c) 2012 Isak B
 * GPL Licensed (LICENSE.txt)
*/

# Configuration for RequireJS:
require.config do
  paths:
    # Backbone and its dependencies:
    underscore: 'vendor/underscore'
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
    backbone: 'vendor/backbone'
    localstorage: 'vendor/backbone_localstorage'
    # Soundcloud JavaScript SDK and Widget API:
    sc_sdk: 'http://connect.soundcloud.com/sdk'
    # RequireJS text plugin, used to load templates:
    text: 'vendor/require.text'
    # For the build process:
    requireLib: 'vendor/require'
  # Relevant RequireJS 2.0 documentation: http://tinyurl.com/bn4j9sx
  shim:
    backbone:
      deps: <[ underscore jquery ]>
      exports: \Backbone
    underscore:
      exports: \_
    localstorage:
      deps: <[ underscore backbone ]>
      exports: \Backbone.LocalStorage
    sc_sdk:
      exports: \SC

# MAIN dependencies and definition:
$, Backbone, AppView <- require <[ jquery backbone ./views/app ]>

# With jQuery hosted by CDN and the rest of the files concatenated in prod
# environment, Backbone doesn't yet know about jQuery. Solution:
Backbone.setDomLibrary $
new AppView()
