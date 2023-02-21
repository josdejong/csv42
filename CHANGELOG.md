# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2023-02-21)


### Features

* allow customizing flattening behavior with `flatten` being a callback ([7c1a711](https://github.com/josdejong/csv42/commit/7c1a7111d8dcf4328472080955807c637d022f26))
* implement a setIn function to restore nested objects (WIP) ([308e145](https://github.com/josdejong/csv42/commit/308e14579cdc7a6e6338a50eb5858eb95d1f935b))
* implement options `flatten` and `nested` ([14defe0](https://github.com/josdejong/csv42/commit/14defe0ceb7cb9b359e715e121264ef14cc8ff21))
* implement parsing nested field names with control characters ([a1d30c7](https://github.com/josdejong/csv42/commit/a1d30c74934f1994005495cac8466c364c51cd49))
* implement passing a function to resolve fields ([b8bfc92](https://github.com/josdejong/csv42/commit/b8bfc922166c48463f836659d20ca5e41550f2dc))
* implement support for specifying a JsonField with an index instead of a name ([0f2c645](https://github.com/josdejong/csv42/commit/0f2c645789213742f013ca350ae1e55edd718f92))
* improve parsePath and stringifyPath to support nested arrays ([3618dcc](https://github.com/josdejong/csv42/commit/3618dccca407e421f0d754b33d18916dd8bab0b3))
* improve the performance of `csv2json` ([b6d7480](https://github.com/josdejong/csv42/commit/b6d748092bbe0118d8dd9b591511bb6cf374d1d8))
* initial commit with a `json2csv` and `csv2json` function (WIP) ([ad01de2](https://github.com/josdejong/csv42/commit/ad01de29634f28c23d8ce6e95f5a01c92eaa029f))
* introduce option `parseFieldName` (WIP) ([26e1856](https://github.com/josdejong/csv42/commit/26e1856dc1a4e0bed271c931f067e4763b0f0e8c))
* map fields by name in csv2json ([3773e4d](https://github.com/josdejong/csv42/commit/3773e4d609423d45bc012852186e62dc5eb1ef38))
* some performance improvement ([cd9d669](https://github.com/josdejong/csv42/commit/cd9d66995148cf783e1029e69f7de4ecb0a71534))
* validate EOL character ([377759d](https://github.com/josdejong/csv42/commit/377759de70a29492ca92c619343e3a1c33e117ff))


### Bug Fixes

* mapping fields too when `fields` is a function ([b2da4b0](https://github.com/josdejong/csv42/commit/b2da4b0750c17e128635428c60713dc41f01eff8))
* more specific type definition for the `eol` option ([54088a8](https://github.com/josdejong/csv42/commit/54088a887be99eef2c81ceb48bb435b9131ef764))

## 1.0.0 (2023-02-21)


### Features

* allow customizing flattening behavior with `flatten` being a callback ([7c1a711](https://github.com/josdejong/csv42/commit/7c1a7111d8dcf4328472080955807c637d022f26))
* implement a setIn function to restore nested objects (WIP) ([308e145](https://github.com/josdejong/csv42/commit/308e14579cdc7a6e6338a50eb5858eb95d1f935b))
* implement options `flatten` and `nested` ([14defe0](https://github.com/josdejong/csv42/commit/14defe0ceb7cb9b359e715e121264ef14cc8ff21))
* implement parsing nested field names with control characters ([a1d30c7](https://github.com/josdejong/csv42/commit/a1d30c74934f1994005495cac8466c364c51cd49))
* implement passing a function to resolve fields ([b8bfc92](https://github.com/josdejong/csv42/commit/b8bfc922166c48463f836659d20ca5e41550f2dc))
* implement support for specifying a JsonField with an index instead of a name ([0f2c645](https://github.com/josdejong/csv42/commit/0f2c645789213742f013ca350ae1e55edd718f92))
* improve parsePath and stringifyPath to support nested arrays ([3618dcc](https://github.com/josdejong/csv42/commit/3618dccca407e421f0d754b33d18916dd8bab0b3))
* improve the performance of `csv2json` ([b6d7480](https://github.com/josdejong/csv42/commit/b6d748092bbe0118d8dd9b591511bb6cf374d1d8))
* initial commit with a `json2csv` and `csv2json` function (WIP) ([ad01de2](https://github.com/josdejong/csv42/commit/ad01de29634f28c23d8ce6e95f5a01c92eaa029f))
* introduce option `parseFieldName` (WIP) ([26e1856](https://github.com/josdejong/csv42/commit/26e1856dc1a4e0bed271c931f067e4763b0f0e8c))
* map fields by name in csv2json ([3773e4d](https://github.com/josdejong/csv42/commit/3773e4d609423d45bc012852186e62dc5eb1ef38))
* some performance improvement ([cd9d669](https://github.com/josdejong/csv42/commit/cd9d66995148cf783e1029e69f7de4ecb0a71534))
* validate EOL character ([377759d](https://github.com/josdejong/csv42/commit/377759de70a29492ca92c619343e3a1c33e117ff))


### Bug Fixes

* mapping fields too when `fields` is a function ([b2da4b0](https://github.com/josdejong/csv42/commit/b2da4b0750c17e128635428c60713dc41f01eff8))
* more specific type definition for the `eol` option ([54088a8](https://github.com/josdejong/csv42/commit/54088a887be99eef2c81ceb48bb435b9131ef764))
