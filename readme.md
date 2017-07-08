# tablemark-cli &middot; [![Version](https://img.shields.io/npm/v/tablemark-cli.svg?style=flat-square)](https://www.npmjs.com/package/tablemark-cli) [![License](https://img.shields.io/npm/l/tablemark-cli.svg?style=flat-square)](https://www.npmjs.com/package/tablemark-cli) [![Travis CI](https://img.shields.io/travis/citycide/tablemark-cli.svg?style=flat-square)](https://travis-ci.org/citycide/tablemark-cli) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

> Generate markdown tables from JSON data at the command line.

Parse a JSON input file into a markdown table from the command line,
powered by the [`tablemark`](https://github.com/citycide/tablemark) module.

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

## see also

- [`tablemark`](https://github.com/citycide/tablemark): the module used by this utility

## license

MIT © Bo Lingen / citycide
