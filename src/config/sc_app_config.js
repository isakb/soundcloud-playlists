/**
 * Configuration for SC.init (Soundcloud JS SDK).
 */
define({
    // The id of my soundcloud app:
	client_id: '65ffd37ad466cc917f34ba2767b2458a',

    // If we want to be able to play ALL tracks (even non-public), we actually
    // need to auth first.
    redirect_uri: ('' + location).replace(/index.html.*/, 'callback.html')
});
