import { readFileSync } from "fs"
import tablemark, { InputData, TablemarkOptions } from "tablemark"

const jsonIsArrayRegex = /^\s*\[/
const isEmptyRegex = /^\s*$/

export const zip = <T, U>(listA: T[], listB: U[]): Array<[T, U]> => {
  const maxLength = Math.max(listA.length, listB.length)

  return Array.from(new Array(maxLength), (_, index) => [
    listA[index],
    listB[index]
  ])
}

export const read = (input: string): string => {
  try {
    return readFileSync(input, { encoding: "utf8" })
  } catch (e) {
    const detail = e instanceof Error ? ` :: ${e.message}` : ""
    throw new ReferenceError(`Error reading file at ${input} ${detail}`.trim())
  }
}

const parseJson = (input: string): InputData => {
  try {
    return JSON.parse(input)
  } catch (e) {
    const details = e instanceof Error ? ` :: ${e.message}` : ""
    throw new TypeError(
      `Could not parse input as JSON${details}, input:\n${input}`.trim()
    )
  }
}

export const parse = (input: string): InputData => {
  if (jsonIsArrayRegex.test(input)) {
    return parseJson(input)
  }

  // handle ndjson (see http://ndjson.org)
  return input
    .split("\n")
    .filter(line => !isEmptyRegex.test(line))
    .flatMap(parseJson)
}

export const convert = (
  input?: InputData,
  options?: TablemarkOptions
): string => {
  options = Object.assign({}, options)

  if (input == null || input.length === 0) {
    return ""
  }

  return tablemark(input, options)
}
