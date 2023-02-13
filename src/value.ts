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

  if (value === 'null' || value === '') {
    return null
  }

  if (value[0] === '{' || value[0] === '[') {
    return JSON.parse(value)
  }

  return value
}

// TODO: move this function back inside parseField?
export function indexOfValueEnd(text: string, delimiter: string, start: number): number {
  let i = start

  if (text[start] === '"') {
    // parse a quoted value
    do {
      i++

      if (text[i] === '"' && text[i + 1] === '"') {
        // skip over escaped quote (two quotes)
        i += 2
      }
    } while (i < text.length && text[i] !== '"')

    // eat end quote
    if (text[i] !== '"') {
      throw new Error('Unexpected end: end quote " missing')
    }
    i++

    return i
  } else {
    // parse an unquoted value

    while (i < text.length && text[i] !== delimiter && !isEol(text, i)) {
      i++
    }
  }

  return i
}

export function isEol(text: string, index: number): boolean {
  return (
    text[index] === '\n' || // LF
    (text[index] === '\r' && text[index + 1] === '\n') // CRLF
  )
}
