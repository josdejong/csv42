import { ValueFormatter } from './types'

export function createFormatValue(delimiter: string): ValueFormatter {
  // match at least one occurrence of a control character in a string:
  // a delimiter (comma by default), double quote, return, or newline
  if (delimiter.length !== 1) {
    throw new Error(`Delimiter must be a single character (got: ${delimiter})`)
  }
  const controlCharactersRegex = new RegExp('[' + delimiter + '"\r\n]')

  function formatString(value: string): string {
    const needToEscape = controlCharactersRegex.test(value) || value.length === 0

    return needToEscape ? '"' + value.replaceAll('"', '""') + '"' : value
  }

  return function formatValue(value: unknown): string {
    if (typeof value === 'string') {
      return formatString(value)
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }

    if (value === undefined || value === null) {
      return ''
    }

    // object, array, classes
    return formatValue(JSON.stringify(value))
  }
}

export function parseValue(value: string): unknown {
  if (value[0] === '"') {
    const unescapedValue = value.substring(1, value.length - 1).replaceAll('""', '"')
    return unescapedValue === '' ? unescapedValue : parseUnescapedValue(unescapedValue)
  }

  return parseUnescapedValue(value)
}

function parseUnescapedValue(value: string): unknown {
  // TODO: parse numbers, booleans, array, object
  const number = Number(value)
  if (!isNaN(number) && !isNaN(parseFloat(value))) {
    return number
  }

  if (
    value[0] === '{' ||
    value[0] === '[' ||
    value === 'true' ||
    value === 'false' ||
    value === 'null'
  ) {
    return JSON.parse(value)
  }

  if (value === '') {
    return null
  }

  return value
}
