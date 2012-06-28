Soundcloud Playlists
====================

A fully client-based web app that allows you to create playlists of ANY tracks
on SoundCloud.

Temporary Demo at: http://c1299476.r76.cf3.rackcdn.com/index.html

Features
========
- Store, edit and delete playlists.
- Play all the tracks in a playlist with one click or tap.
- A playlist can have a title and a description.
- Should work on latest Opera/Opera Mobile.
- A bookmarklet helps you add tracks to the playlist from SoundCloud pages.


Dependencies
============

You should in theory be able to simply open the index.html file and use the app
like that (except for problems that occur when using the file: protocol).

In order to get the dependencies need for development, you need ot have node.js
installed, as well as npm, and `npm install -g jake`.

Then you only have to run `jake deps` in order to get everything you need.

Typing `jake -T` will list the tasks available.
Typing `jake deploy` should deploy the project into the cloud.


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
- Make more unit tests.


Known issues
============

- The Soundcloud Widget does not work in Chromium, see:
https://getsatisfaction.com/soundcloud/topics/soundcloud_widget_wont_play_in_chrome_help
- There are very few unit tests.

