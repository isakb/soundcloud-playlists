Soundcloud Playlists [![Build Status](https://secure.travis-ci.org/isakb/soundcloud-playlists.png?branch=master)](http://travis-ci.org/isakb/soundcloud-playlists)
====================

A fully client-based web app that allows you to create playlists of any tracks
on SoundCloud.

[Try it!](http://play.isakb.com/index.html)

Features
========
- Store, edit and delete playlists.
- Play all the tracks in a playlist with one click or tap.
- A playlist can have a title and a description.
- Should work in e.g. Chrome and Opera/Opera Mobile, partial support for Firefox.
- A bookmarklet helps you add tracks to the playlist from SoundCloud pages.


Dependencies
============

You should in theory be able to simply open the index.html file and use the app
like that (except for problems that occur when using the file: protocol).

For developing you need to have node.js > 0.8 and npm.

Then you only have to run `npm install && slake deps` in order to get everything you need.

Typing `slake` will list the tasks available.
Typing `slake deploy` should deploy the project into the cloud.


Tech used
=========
- Soundcloud's JS SDK
- LiveScript
- HTML5
- CSS3
- Backbone.js
- Backbone.Localstorage for storing playlists in the browser
- HTML5 boilerplate's CSS
- RequireJS
- Node.js (for dev. scripts and dev. server)
- The Cloud
- Travis CI for testing
