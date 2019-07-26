'use strict'

const { readFileSync } = require('fs')
const tablemark = require('tablemark')
const isValidPath = require('is-valid-path')

const jsonIsArrayRegex = /^\s*\[/
const isEmptyRegex = /^\s*$/

const read = input => {
  let contents

  try {
    contents = readFileSync(input)
  } catch (e) {
    throw new ReferenceError(
      `Error reading file at ${input} :: ${e.message}`
    )
  }

  return contents
}

const parse = input => {
  if (jsonIsArrayRegex.test(input)) {
    return parseJson(input)
  }

  return input
    .split('\n')
    .filter(line => !isEmptyRegex.test(line))
    .map(parseJson)
}

const parseJson = input => {
  try {
    return JSON.parse(input)
  } catch (e) {
    throw new TypeError(
      `Could not parse input as JSON :: ${e.message}`
    )
  }
}

module.exports = (path, input, options) => {
  options = Object.assign({}, options)

  if (path && !isValidPath(path)) {
    throw new TypeError('Invalid file path')
  }

  const json = path ? read(path) : input
  const data = parse(String(json))

  if (data.length === 0) return ''

  return tablemark(data, options)
}
