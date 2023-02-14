import { JsonField, JsonOptions, NestedObject } from './types.js'
import { parseValue } from './value.js'
import { getFieldsFromCsv, mapFieldsByName } from './fields'
import { isCRLF, isEol, isLF, validateDelimiter } from './validate.js'

export function csv2json(csv: string, options?: JsonOptions): NestedObject[] {
  const withHeader = options?.header !== false // true when not specified
  const delimiter = validateDelimiter(options?.delimiter || ',')
  const parse = options?.parseValue || parseValue

  const json: NestedObject[] = []
  let i = 0

  const fieldNames = parseHeader()

  const fields: (JsonField | undefined)[] = options?.fields
    ? mapFieldsByName(
        fieldNames,
        Array.isArray(options?.fields) ? options?.fields : options?.fields(fieldNames)
      )
    : getFieldsFromCsv(fieldNames)

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

      if (csv[i] === delimiter) {
        i++
      }
    }

    eatEol()
  }

  function parseField(): unknown {
    const start = i

    if (csv[i] === '"') {
      // parse a quoted value
      do {
        i++

        if (csv[i] === '"' && csv[i + 1] === '"') {
          // skip over escaped quote (two quotes)
          i += 2
        }
      } while (i < csv.length && csv[i] !== '"')

      // eat end quote
      if (csv[i] !== '"') {
        throw new Error('Unexpected end: end quote " missing')
      }
      i++
    } else {
      // parse an unquoted value
      while (i < csv.length && csv[i] !== delimiter && !isEol(csv, i)) {
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
