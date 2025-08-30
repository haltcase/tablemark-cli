## [`3.0.0`](https://github.com/haltcase/tablemark-cli/compare/v2.0.0...v3.0.0) (2022-04-30)


###### FEATURES

* require node >= 14.18 ([3bd02ca](https://github.com/haltcase/tablemark-cli/commit/3bd02ca))
* rewrite in TypeScript / ESM ([1c45f86](https://github.com/haltcase/tablemark-cli/commit/1c45f86))


###### BREAKING CHANGES

* support for node 8, 10, 12, and < 14.18 has been dropped.
* the `--columns` option long name is now `--column`.
* to pass input as stdin, `-` must be provided as the input file parameter.

---

## [`2.0.0`](https://github.com/haltcase/tablemark-cli/compare/v1.1.0...v2.0.0) (2019-07-26)


###### FEATURES

* require node >= 8.10 ([4d12e35](https://github.com/haltcase/tablemark-cli/commit/4d12e35))


###### BREAKING CHANGES

* support for node 4, 6, and < 8.10 has been dropped.

---

## [`1.1.0`](https://github.com/haltcase/tablemark-cli/compare/360eaef...v1.1.0) (2017-09-14)


###### BUG FIXES

* actually support node 4 ([360eaef](https://github.com/haltcase/tablemark-cli/commit/360eaef))


###### FEATURES

* case header row by default, add disable flag ([a1bdf51](https://github.com/haltcase/tablemark-cli/commit/a1bdf51))
* prettier markdown output ([eb85d82](https://github.com/haltcase/tablemark-cli/commit/eb85d82))
* support ndjson ([#4](https://github.com/haltcase/tablemark-cli/issues/4)) ([46f412e](https://github.com/haltcase/tablemark-cli/commit/46f412e)), closes [#4](https://github.com/haltcase/tablemark-cli/issues/4)
* support stdin ([#3](https://github.com/haltcase/tablemark-cli/issues/3)) ([f0d41d8](https://github.com/haltcase/tablemark-cli/commit/f0d41d8)), closes [#3](https://github.com/haltcase/tablemark-cli/issues/3)


---
