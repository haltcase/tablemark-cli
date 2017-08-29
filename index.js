'use strict'

const fs = require('fs')
const tablemark = require('tablemark')
const isValidPath = require('is-valid-path')

var jsonIsArray = /^\s*\[/
var isEmpty = /^\s*$/

module.exports = (path, input, options) => {
  options = Object.assign({}, options)

  if (path && !isValidPath(path)) {
    throw new TypeError('Invalid file path')
  }

  let json = path ? read(path) : input
  let data = parse(String(json))

  if (data.length === 0)
    return ''

  return tablemark(data, options)
}

function read (input) {
  let contents

  try {
    contents = fs.readFileSync(input)
  } catch (e) {
    throw new ReferenceError(
      `Error reading file at ${input} :: ${e.message}`
    )
  }

  return contents
}

function parse (input) {
  if (jsonIsArray.test(input)) {
    return parseJson(input)
  }

  return input
    .split('\n')
    .filter(l => !isEmpty.test(l))
    .map(parseJson)
}

function parseJson (input) {
  try {
    return JSON.parse(input)
  } catch (e) {
    throw new TypeError(
      `Could not parse input as JSON :: ${e.message}`
    )
  }
}
