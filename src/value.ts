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

export function unescapeValue(value: string): string {
  return value[0] === '"' ? value.substring(1, value.length - 1).replaceAll('""', '"') : value
}

function parseUnescapedValue(value: string): unknown {
  const number = Number(value)
  if (!isNaN(number) && !isNaN(parseFloat(value))) {
    return number
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
    return JSON.parse(value)
  }

  return value
}
