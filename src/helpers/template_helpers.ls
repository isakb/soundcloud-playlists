_ <- define <[ underscore ]>

# Converts a postive number to an integer and returns it as a string,
# possibly padded with leading zeroes.
pad = (number) ->
  str = parseInt(number, 10)
  throw new Error("Negative numbers not supported.")  if number < 0
  str = "0" + str  if number < 10
  str


# Template helper function for converting track / playlist
# durations from milliseconds to a readable format.
formatDuration: (ms) ->
  x = ms / 1000
  s = x % 60
  m = x / 60
  h = m / 60
  m = m % 60
  _.map([h, m, s], pad).join ":"

# Format a time such as 362300 ms as minutes:seconds, e.g. 6:02.
formatShortTime: (ms) ->
  x = ms / 1000
  s = x % 60
  m = x / 60
  [m .|. 0, pad(s .|. 0)].join ":"
