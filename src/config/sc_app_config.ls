# Configuration for SC.init (Soundcloud JS SDK).
define do
  # Development mode or production mode app?
  client_id: if location.hostname is \localhost then \a0d8ca659b47f50a1873b2e58cf12edd else \65ffd37ad466cc917f34ba2767b2458a
  redirect_uri: ("" + location).replace(/index.html.*/, "callback.html")
