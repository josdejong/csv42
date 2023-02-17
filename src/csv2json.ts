import { JsonField, JsonOptions, NestedObject } from './types.js'
import { parseValue } from './value.js'
import { toFields, mapFields } from './fields.js'
import { isCRLF, isEol, isLF, validateDelimiter } from './validate.js'

export function csv2json(csv: string, options?: JsonOptions): NestedObject[] {
  const withHeader = options?.header !== false // true when not specified
  const delimiter: number = validateDelimiter(options?.delimiter || ',').charCodeAt(0)
  const quote = '"'.charCodeAt(0)
  const parse = options?.parseValue || parseValue

  const json: NestedObject[] = []
  let i = 0

  const fieldNames = parseHeader()

  const fields: (JsonField | undefined)[] = options?.fields
    ? mapFields(
        fieldNames,
        Array.isArray(options?.fields) ? options?.fields : options?.fields(fieldNames)
      )
    : toFields(fieldNames, options?.nested !== false)

  while (i < csv.length) {
    const object = {}

    parseRecord((value, index) => {
      fields[index]?.setValue(object, value)
    })

    json.push(object)
  }

  return json

  function parseHeader(): string[] {
    const names: string[] = []

    parseRecord((fieldName, index) => {
      names.push(withHeader ? String(fieldName) : `Field ${index}`)
    })

    if (!withHeader) {
      i = 0 // reset the pointer again: the first line contains data, not a header
    }

    return names
  }

  function parseRecord(onField: (field: unknown, fieldIndex: number) => void) {
    let index = 0

    while (i < csv.length && !isEol(csv, i)) {
      onField(parseField(), index)

      index++

      if (csv.charCodeAt(i) === delimiter) {
        i++
      }
    }

    eatEol()
  }

  function parseField(): unknown {
    const start = i

    if (csv.charCodeAt(i) === quote) {
      // parse a quoted value
      do {
        i++

        if (csv.charCodeAt(i) === quote && csv.charCodeAt(i + 1) === quote) {
          // skip over escaped quote (two quotes)
          i += 2
        }
      } while (i < csv.length && csv.charCodeAt(i) !== quote)

      // eat end quote
      if (csv.charCodeAt(i) !== quote) {
        throw new Error('Unexpected end: end quote " missing')
      }
      i++
    } else {
      // parse an unquoted value
      while (i < csv.length && csv.charCodeAt(i) !== delimiter && !isEol(csv, i)) {
        i++
      }
    }

    // note that it is possible that a field is empty
    return parse(csv.substring(start, i))
  }

  function eatEol() {
    if (isLF(csv, i)) {
      i++
    } else if (isCRLF(csv, i)) {
      i += 2
    }
  }
}
