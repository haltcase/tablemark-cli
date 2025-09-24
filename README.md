# tablemark-cli &middot; [![npm version](https://img.shields.io/npm/v/tablemark-cli?style=flat-square)](https://www.npmjs.com/package/tablemark-cli) [![license](https://img.shields.io/npm/l/tablemark-cli?style=flat-square)](https://www.npmjs.com/package/tablemark-cli) [![TypeScript](https://img.shields.io/badge/written%20in-TypeScript-294E80?style=flat-square&logo=TypeScript)](http://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/haltcase/tablemark-cli/test.yml?style=flat-square)

> Generate markdown tables from JSON data at the command line.

Render JSON input data as a markdown table from the command line,
powered by the [`tablemark`](https://github.com/haltcase/tablemark) module.

This utility supports:

- JSON file input from a provided path
- Data piped from `stdin`
- NDJSON formatted data ([newline delimited JSON](http://ndjson.org/))
- And most options supported by `tablemark`

## Installation

```shell
pnpm add --global tablemark-cli

# or
npm install --global tablemark-cli

# or
bun install --global tablemark-cli
```

You can also use `pnpx`/`pnpm dlx`, `npx`, `bunx`, etc. to run it without installing:

```sh
pnpx tablemark-cli input.json > output.md

# or
npx tablemark-cli input.json > output.md

# or
bunx tablemark-cli input.json > output.md
```

## Usage

```
tablemark 4.0.0
> Generate markdown tables from JSON data at the command line.

ARGUMENTS:
  <input-file> - Path to input file containing JSON data (use - for stdin)

OPTIONS:
  --align <Alignment>, -a=<Alignment>                 - Alignment, can be used multiple times [default: left]
  --align-all, -A <Alignment>                         - Default alignment for all columns [default: left]
  --column <str>, -c=<str>                            - Column name, can be used multiple times [default: infer from object key]
  --descriptors, -D <ColumnDescriptors>               - Column descriptors as a JSON array, overrides --align/--column [default: none] [optional]
  --header-case, -H <HeaderCase>                      - Control the casing of column names [default: sentenceCase]
  --line-break-strategy, -l <LineBreakStrategy>       - How to handle line breaks in cell content [default: preserve]
  --line-ending, -e <str>                             - End-of-line string [default: \n] [optional]
  --max-width, -w <number>                            - Maximum content width of each column [default: Infinity]
  --overflow-strategy, -o <OverflowStrategy>          - What to do when cell content exceeds max width [default: wrap]
  --overflow-header-strategy, -O <OverflowStrategy>   - What to do when header cell content exceeds max width [default: wrap]
  --unknown-key-strategy, -u <UnknownKeyStrategy>     - What to do when an unknown key is encountered [default: ignore]
  --text-handling-strategy, -t <TextHandlingStrategy> - Which text processing method to use [default: auto]
  --wrap-width <number>                               - (Deprecated) Alias for --max-width [default: Infinity]

FLAGS:
  --count-ansi                  - Count ANSI escape codes towards content width
  --no-case-headers, -N         - (Deprecated) Disable automatic sentence casing of inferred column names
  --no-pad-header-separator, -P - Omit padding on the header separator row
  --wrap-with-gutters, -G       - Add '|' characters to wrapped rows
  --help, -h                    - show help
  --version, -v                 - print the version
```

To apply the `align` and `column` options to multiple columns, supply the flag
multiple times, like this:

```sh
tablemark input.json > output.md -a left -a center -a right
```

... which will align the first three columns left, center, and right respectively.

## Piped input (`stdin`)

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

## NDJSON

[NDJSON](http://ndjson.org) is a form of JSON that delimits multiple JSON objects by newlines:

```js
{"name":"trilogy","repo":"[haltcase/trilogy](https://github.com/haltcase/trilogy)","desc":"No-hassle SQLite with type-casting schema models and support for native & pure JS backends."}
{"name":"strat","repo":"[haltcase/strat](https://github.com/haltcase/strat)","desc":"Functional-ish JavaScript string formatting, with inspirations from Python."}
{"name":"tablemark-cli","repo":"[haltcase/tablemark-cli](https://github.com/haltcase/tablemark-cli)","desc":"Generate markdown tables from JSON data at the command line."}
```

This input from a file or stdin is supported just as if it were
a JSON compatible array:

```sh
tablemark input.ndjson > output.md
```

## See also

- [`tablemark`](https://github.com/haltcase/tablemark) &ndash; the module used by this utility

## Contributing

Search the [issues](https://github.com/haltcase/tablemark-cli) if you come
across any trouble, open a new one if it hasn't been posted, or, if you're
able, open a [pull request](https://help.github.com/articles/about-pull-requests/).
Contributions of any kind are welcome in this project.

The following people have already contributed their time and effort:

- Thomas Jensen (**[@tjconcept](https://github.com/tjconcept)**)

Thank you!

## License

MIT © Bo Lingen / haltcase
