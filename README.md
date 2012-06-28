Soundcloud Playlists
====================

A fully client-based web app that allows you to create playlists of ANY tracks on SoundCloud.

Features
========
- Store, edit and delete playlists.
- Play all the tracks in a playlist with one click or tap.
- A playlist can have a title and a description.
- Should work on latest Opera/Opera Mobile.
- A bookmarklet helps you add tracks to the playlist from SoundCloud pages.


Dependencies
============

You should be able to simply open the index.html file and use the app like that. (Preferably serve it with a web server.) However you need node.js and npm to build and deploy the project.

Typing `npm install` from a Bash prompt should take care of everything.

Typing `node deploy.js` should deploy the project into the cloud.


Tech used
=========

- JavaScript, HTML5, CSS3
- Backbone.js for the bulk of the app.
- Backbone.Localstorage for storing playlists in the browser.
- HTML5 boilerplate's CSS.
- RequireJS (http://requirejs.org/) is used for dependency management.
- Node.js (for dev. scripts and dev. server).
- Rackspace Cloud Files for hosting.


TODO
====

- Make it possible to undo actions.


Known issues
============

- The Soundcloud Widget does not work in Chromium, see:
https://getsatisfaction.com/soundcloud/topics/soundcloud_widget_wont_play_in_chrome_help



