import { ValueFormatter } from './types'

export function createFormatValue(delimiter: string): ValueFormatter {
  // match at least one occurrence of a control character in a string:
  // a delimiter (comma by default), double quote, return, or newline
  const controlCharactersRegex = new RegExp('[' + delimiter + '"\r\n]')
  const quoteRegex = /"/g

  function formatString(value: string): string {
    const needToEscape = controlCharactersRegex.test(value) || value.length === 0

    return needToEscape ? `"${value.replaceAll(quoteRegex, '""')}"` : value
  }

  return function formatValue(value: unknown): string {
    if (typeof value === 'string') {
      return formatString(value)
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value + ''
    }

    if (value === undefined || value === null) {
      return ''
    }

    // object, array, classes
    return formatValue(JSON.stringify(value))
  }
}

export function parseValue(value: string): unknown {
  if (value.length === 0) {
    return null
  }

  return parseUnescapedValue(unescapeValue(value))
}

const escapedQuoteRegex = /""/g

export function unescapeValue(value: string): string {
  return value[0] === '"'
    ? value.substring(1, value.length - 1).replaceAll(escapedQuoteRegex, '"')
    : value
}

function parseUnescapedValue(value: string): unknown {
  if (value[0] >= '-' && value[0] <= '9') {
    // a number can start with one of the following characters: 01234567890.-
    // the range above contains these characters, but also the forward slash /.
    // That is not a problem though: parsing as number will fail
    const number = Number(value)
    return !isNaN(number) ? number : value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  if (value === 'null') {
    return null
  }

  if (value[0] === '{' || value[0] === '[') {
    try {
      return JSON.parse(value)
    } catch (_) {
      // ignore the error: this value looked like a JSON array or object but isn't. No problem
    }
  }

  return value
}
