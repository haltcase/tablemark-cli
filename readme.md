# tablemark-cli &middot; [![Version](https://img.shields.io/npm/v/tablemark-cli.svg?style=flat-square)](https://www.npmjs.com/package/tablemark-cli) [![License](https://img.shields.io/npm/l/tablemark-cli.svg?style=flat-square)](https://www.npmjs.com/package/tablemark-cli) [![Travis CI](https://img.shields.io/travis/citycide/tablemark-cli.svg?style=flat-square)](https://travis-ci.org/citycide/tablemark-cli) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

> Generate markdown tables from JSON data at the command line.

Parse JSON input data into a markdown table from the command line,
powered by the [`tablemark`](https://github.com/citycide/tablemark) module.

## features

This utility supports:

- JSON file input from a provided path
- data piped from `stdin`
- NDJSON formatted data ([newline delimited JSON](http://ndjson.org/)).

## installation

```console
npm i -g tablemark-cli
```

## usage

```console
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

```console
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

```console
tablemark input.ndjson > output.md
```

## see also

- [`tablemark`](https://github.com/citycide/tablemark): the module used by this utility

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
