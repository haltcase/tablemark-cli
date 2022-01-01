import { readFileSync } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

import test from "ava"
import { execaCommandSync } from "execa"

interface ExecutionResult {
  success: boolean
  stdout: string
  stderr: string
}

const joinLines = (lines: string[], lineEnding = "\n"): string =>
  lines.join(lineEnding) + lineEnding

const expected = joinLines([
  "| Name          | Repo                                                                | Desc                                                                                        |",
  "| :------------ | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------ |",
  "| trilogy       | [citycide/trilogy](https://github.com/citycide/trilogy)             | No-hassle SQLite with type-casting schema models and support for native & pure JS backends. |",
  "| strat         | [citycide/strat](https://github.com/citycide/strat)                 | Functional-ish JavaScript string formatting, with inspirations from Python.                 |",
  "| tablemark-cli | [citycide/tablemark-cli](https://github.com/citycide/tablemark-cli) | Generate markdown tables from JSON data at the command line.                                |"
])

const inputLongValue = JSON.stringify({
  "lots of ones": "1".repeat(50)
})

const inputThreeColumn = JSON.stringify({
  one: "one",
  two: "two",
  "three dog": "night"
})

const testDirectory = dirname(fileURLToPath(import.meta.url))
const cliPath = resolve(testDirectory, "../dist/cli.js")
const inputPath = resolve(testDirectory, "./fixtures/input.json")
const ndjsonInputPath = resolve(testDirectory, "./fixtures/input.ndjson")

const jsonContent = readFileSync(inputPath, "utf8")

const execute = (argString: string, stdin?: string): ExecutionResult => {
  const { stdout, stderr, failed } = execaCommandSync(
    `node ${cliPath} ${argString}`.trim(),
    {
      encoding: "utf8",
      input: stdin
    }
  )

  return {
    success: !failed,
    stdout,
    stderr
  }
}

test("renders JSON from file as a markdown table", async t => {
  const { success, stdout } = execute(inputPath)
  t.true(success)
  t.is(stdout, expected)
})

test("renders NDJSON from file as a markdown table", async t => {
  const { success, stdout } = execute(ndjsonInputPath)
  t.true(success)
  t.is(stdout, expected)
})

test("renders JSON content from stdin as a markdown table", async t => {
  const { success, stdout } = execute("-", jsonContent)
  t.true(success)
  t.is(stdout, expected)
})

test("fails when input file path does not exist", async t => {
  t.throws(() => execute("not-a-file.js"), {
    message: /no such file or directory/
  })
})

test("fails when input content is invalid", async t => {
  t.throws(() => execute("-", "not json"), {
    message: /Could not parse input as JSON/
  })
})

test("long values are not wrapped by default", async t => {
  const expected = joinLines([
    "| Lots of ones                                       |",
    "| :------------------------------------------------- |",
    "| 11111111111111111111111111111111111111111111111111 |"
  ])

  const { success, stdout } = execute("-", inputLongValue)

  t.true(success)
  t.is(stdout, expected)
})

test("long values are wrapped if `--wrap-width` is supplied", async t => {
  const expected = joinLines([
    "| Lots of ones              |",
    "| :------------------------ |",
    "| 1111111111111111111111111 |",
    "  1111111111111111111111111  "
  ])

  const { success, stdout } = execute("- --wrap-width 25", inputLongValue)

  t.true(success)
  t.is(stdout, expected)
})

test("gutters are included on wrapped rows when `--wrap-with-gutters` is supplied", async t => {
  const expected = joinLines([
    "| Lots of ones              |",
    "| :------------------------ |",
    "| 1111111111111111111111111 |",
    "| 1111111111111111111111111 |"
  ])

  const { success, stdout } = execute(
    "- --wrap-width 25 --wrap-with-gutters",
    inputLongValue
  )

  t.true(success)
  t.is(stdout, expected)
})

test("line ending can be customized using `--line-ending`", async t => {
  const lineEnding = "~@~"

  const expected = joinLines(
    [
      "| Lots of ones                                       |",
      "| :------------------------------------------------- |",
      "| 11111111111111111111111111111111111111111111111111 |"
    ],
    lineEnding
  )

  const { success, stdout } = execute(
    `- --line-ending ${lineEnding}`,
    inputLongValue
  )

  t.true(success)
  t.is(stdout, expected)
})

test("sentence casing can be disabled with `--no-case-headers`", async t => {
  const expected = joinLines([
    "| one   | two   | three dog |",
    "| :---- | :---- | :-------- |",
    "| one   | two   | night     |"
  ])

  const { success, stdout } = execute("- --no-case-headers", inputThreeColumn)

  t.true(success)
  t.is(stdout, expected)
})

test("column alignment can be customized using `--align`", async t => {
  const expected = joinLines([
    "| One   |  Two  | Three dog |",
    "| :---- | :---: | --------: |",
    "| one   |  two  |     night |"
  ])

  const { success, stdout } = execute(
    "- --align left --align center --align right",
    inputThreeColumn
  )

  t.true(success)
  t.is(stdout, expected)
})

test("column names can be customized using `--column`", async t => {
  const expected = joinLines([
    "| AAA   | BBB   | CCCCC |",
    "| :---- | :---- | :---- |",
    "| one   | two   | night |"
  ])

  const { success, stdout } = execute(
    "- --column AAA --column BBB --column CCCCC",
    inputThreeColumn
  )

  t.true(success)
  t.is(stdout, expected)
})

test("all options work together as expected", async t => {
  const lineEnding = "~@~"

  const expected = joinLines(
    [
      "| AAA   |  BBB  | three |",
      "|       |       |   dog |",
      "| :---- | :---: | ----: |",
      "| one   |  two  | night |"
    ],
    lineEnding
  )

  const columns = ["AAA", "BBB"].map(name => `-c ${name}`).join(" ")

  const alignments = ["left", "center", "right"]
    .map(align => `-a ${align}`)
    .join(" ")

  const { success, stdout } = execute(
    `- ${columns} ${alignments} --wrap-width 3 --wrap-with-gutters --line-ending ${lineEnding} --no-case-headers`,
    inputThreeColumn
  )

  t.true(success)
  t.is(stdout, expected)
})
