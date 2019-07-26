# tablemark-cli &middot; [![Version](https://flat.badgen.net/npm/v/tablemark-cli)](https://www.npmjs.com/package/tablemark-cli) [![License](https://flat.badgen.net/npm/license/tablemark-cli)](https://www.npmjs.com/package/tablemark-cli) [![Travis CI](https://flat.badgen.net/travis/citycide/tablemark-cli)](https://travis-ci.org/citycide/tablemark-cli) [![JavaScript Standard Style](https://flat.badgen.net/badge/code%20style/standard/green)](https://standardjs.com)

> Generate markdown tables from JSON data at the command line.

Parse JSON input data into a markdown table from the command line,
powered by the [`tablemark`](https://github.com/citycide/tablemark) module.

## features

This utility supports:

- JSON file input from a provided path
- data piped from `stdin`
- NDJSON formatted data ([newline delimited JSON](http://ndjson.org/)).

## installation

```sh
yarn global add tablemark-cli
```

## usage

```sh
Usage: tablemark <input-file> > <output-file> [options]

Commands:

  help  Display help

Options:

  -a, --align <list>    List of alignment types, applied in order to columns. (defaults to [])
  -c, --columns <list>  List of column names, defaults to object keys. (defaults to [])
  -h, --help            Output usage information
  -v, --version         Output the version number
```

To use the `align` and `column` options, you can use the `-a` or
`-c` flags multiple times, like this:

````console
tablemark input.json > output.md -a left -a center
````

... which will align the first two columns left and center respectively.

## stdin

```sh
tablemark < input.json > output.md
```

## ndjson

NDJSON is a form of JSON that delimits multiple JSON objects by newlines:

```js
{"name":"trilogy","repo":"[citycide/trilogy](https://github.com/citycide/trilogy)","desc":"No-hassle SQLite with type-casting schema models and support for native & pure JS backends."}
{"name":"strat","repo":"[citycide/strat](https://github.com/citycide/strat)","desc":"Functional-ish JavaScript string formatting, with inspirations from Python."}
{"name":"tablemark-cli","repo":"[citycide/tablemark-cli](https://github.com/citycide/tablemark-cli)","desc":"Generate markdown tables from JSON data at the command line."}
```

This input from a file or stdin is supported just as if it were
a JSON compatible array:

```sh
tablemark input.ndjson > output.md
```

## see also

- [`tablemark`](https://github.com/citycide/tablemark) &ndash; the module used by this utility

## contributing

Search the [issues](https://github.com/citycide/tablemark-cli) if you come
across any trouble, open a new one if it hasn't been posted, or, if you're
able, open a [pull request](https://help.github.com/articles/about-pull-requests/).
Contributions of any kind are welcome in this project.

The following people have already contributed their time and effort:

* Thomas Jensen (**[@tjconcept](https://github.com/tjconcept)**)

Thank you!

## license

MIT © Bo Lingen / citycide
