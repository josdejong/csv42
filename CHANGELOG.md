# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
