# tablemark-cli &middot; [![Version](https://flat.badgen.net/npm/v/tablemark-cli)](https://www.npmjs.com/package/tablemark-cli) [![License](https://flat.badgen.net/npm/license/tablemark-cli)](https://www.npmjs.com/package/tablemark-cli) [![Travis CI](https://flat.badgen.net/travis/citycide/tablemark-cli)](https://travis-ci.org/citycide/tablemark-cli) [![JavaScript Standard Style](https://flat.badgen.net/badge/code%20style/standard/green)](https://standardjs.com)

> Generate markdown tables from JSON data at the command line.

Render JSON input data as a markdown table from the command line,
powered by the [`tablemark`](https://github.com/citycide/tablemark) module.

## features

This utility supports:

* JSON file input from a provided path
* data piped from `stdin`
* NDJSON formatted data ([newline delimited JSON](http://ndjson.org/))

## installation

```sh
yarn global add tablemark-cli

# or

npm install --global tablemark-cli
```

## usage

```sh
tablemark 3.0.0
> Generate markdown tables from JSON data at the command line.

ARGUMENTS:
  <input-file> - Path to input file containing JSON data (use - for stdin)

OPTIONS:
  --column <str>, -c=<str>    - Custom column name, can be used multiple times (default: infer from object keys)
  --align <value>, -a=<value> - Custom alignments, can be used multiple times, applied in order to columns (default: left)
  --line-ending, -e <str>     - End-of-line string (default: \n) [optional]
  --wrap-width, -w <number>   - Width at which to hard wrap cell content [default: Infinity]

FLAGS:
  --no-case-headers, -N   - Disable automatic sentence casing of inferred column names [default: false]
  --wrap-with-gutters, -G - Add '|' characters to wrapped rows [default: false]
  --help, -h              - show help
  --version, -v           - print the version
```

To apply the `align` and `column` options to multiple columns, supply the flag
multiple times, like this:

```sh
tablemark input.json > output.md -a left -a center -a right
```

... which will align the first three columns left, center, and right respectively.

## stdin

In bash-like shells:

```sh
# stdin -> stdout
echo '{ "one": 1 }' | tablemark -

# redirect input file content into stdin, then to a file
tablemark - < input.json > output.md
```

In PowerShell:

```powershell
# stdin -> stdout
'{ "one": 1 }' | tablemark -

# redirect input file content into stdin, then to a file
cat input.json | tablemark - > output.md
```

## ndjson

[NDJSON](http://ndjson.org) is a form of JSON that delimits multiple JSON objects by newlines:

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

* [`tablemark`](https://github.com/citycide/tablemark) &ndash; the module used by this utility

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
