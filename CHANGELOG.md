# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.2](https://github.com/josdejong/csv42/compare/v3.0.1...v3.0.2) (2023-03-09)


### Bug Fixes

* make the build-in `parseValue` robust against invalid json arrays and objects ([4faa963](https://github.com/josdejong/csv42/commit/4faa9633ec9048abefbd460c8af5c8ccbbb5b0d7))

### [3.0.1](https://github.com/josdejong/csv42/compare/v3.0.0...v3.0.1) (2023-03-08)


### Bug Fixes

* negative values not being parsed into numbers when converting a csv file to json ([8a99af7](https://github.com/josdejong/csv42/commit/8a99af7ab34368cb3eb7ae0b09f1026e844562bc))

## [3.0.0](https://github.com/josdejong/csv42/compare/v2.0.0...v3.0.0) (2023-03-07)


### ⚠ BREAKING CHANGES

* Dropped the `flattenArray` option, use `flatten: isObjectOrArray` instead.
Also, the utility function `isObjectOrArray` is now strict and does not return true for classes.

### Features

* change `flatten` into a boolean or callback again and make it strict, not matching classes ([5d99eb6](https://github.com/josdejong/csv42/commit/5d99eb6e6b4f9f1627ff7763e67f6447fe0d05f0))
* export utility functions `isObject` and `isObjectAndArray` ([ecdf273](https://github.com/josdejong/csv42/commit/ecdf273065a7f7f2f1d947e776b6a33dd1a448f2))
* performance improvement ([b6b2528](https://github.com/josdejong/csv42/commit/b6b2528083cb01e3ca53c16bc1cefd743f158d8e))
* performance improvement in parsing a CSV file ([baef63a](https://github.com/josdejong/csv42/commit/baef63aea2482b9dbcd609fa41b6695ad12a685b))
* use the esm output instead of src in the benchmarks (is faster) ([cefeeb6](https://github.com/josdejong/csv42/commit/cefeeb6fa2c92962b426d6ee43263f5b70db349a))

## [2.0.0](https://github.com/josdejong/csv42/compare/v1.0.0...v2.0.0) (2023-03-06)


### ⚠ BREAKING CHANGES

* you can no longer pass a callback value to `flatten`. Use `flattenArray` instead.

* chore: enable benchmarking multiple file sizes again

* chore: a bit more refactoring in collectNestedPaths

* chore: add a unit test for Date

### Features

* more robust flattening ([#1](https://github.com/josdejong/csv42/issues/1)) ([22a8ee7](https://github.com/josdejong/csv42/commit/22a8ee7ca27970a9e95efead29efe9dcda6b96d8))


### Bug Fixes

* benchmark validation on linux (some libraries output `\n` on linux and `\r\n` on windows) ([aa1bcfa](https://github.com/josdejong/csv42/commit/aa1bcfad682ff0f0d25543fac066c4d67165d56b))
* flattening not always working when having mixed contents ([15b97b0](https://github.com/josdejong/csv42/commit/15b97b005fb974ce60609ba174e2ac7b22f28410))
* getting a nested property failing when iterating over a `null` value ([759f199](https://github.com/josdejong/csv42/commit/759f1996037f5f804160877c98fe8774ce3daee3))

## 1.0.0 (2023-02-21)


### Features

* first version
