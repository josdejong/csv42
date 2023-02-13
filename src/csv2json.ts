import { JsonField, JsonOptions, NestedObject } from './types.js'
import { parseValue } from './value.js'

export function csv2json(csv: string, options?: JsonOptions): NestedObject[] {
  const header = options?.header !== false // true when not specified
  const delimiter = options?.delimiter || ','
  const parse = options?.parseValue || parseValue

  const json: NestedObject[] = []
  let i = 0

  // FIXME: if there is no header, parse the records as an Array instead of an object
  const parsedHeader = parseHeader()
  const fields = options?.fields || parsedHeader

  while (i < csv.length) {
    // FIXME: create a parseRecordInto which skips the step of first creating an array
    const record = parseRecord()
    const object = {}

    fields.forEach((field, index) => {
      field.setValue(object, record[index])
    })

    json.push(object)

    eatEol()
  }

  return json

  function parseHeader(): JsonField[] {
    // TODO: rewrite this code, it is quite verbose and contains duplication
    if (header) {
      const record = parseRecord().map(String)
      eatEol()

      return record.map((name) => {
        return {
          name,
          setValue: (record: NestedObject, value: unknown) => {
            record[name] = value
          }
        }
      })
    } else {
      const record = parseRecord()
      i = 0 // reset, the first line contains data, not a header

      return record.map((_, index) => {
        const name = `Field ${index}`
        return {
          name,
          setValue: (record: NestedObject, value: unknown) => {
            record[name] = value
          }
        }
      })
    }
  }

  function parseRecord(): unknown[] {
    const record: unknown[] = []

    while (i < csv.length && !isEol(i)) {
      record.push(parseField())

      if (csv[i] === delimiter) {
        i++
      }
    }

    return record
  }

  function parseField(): unknown {
    const start = i

    if (csv[i] === '"') {
      // parse a quoted value
      do {
        i++

        if (csv[i] === '"' && csv[i + 1] === '"') {
          // skip over escaped quote: two double quotes
          i += 2
        }
      } while (i < csv.length && csv[i] !== '"')

      eatEndQuote()
    } else {
      // parse an unquoted value
      while (i < csv.length && csv[i] !== delimiter && !isEol(i)) {
        i++
      }
    }

    // console.log('parseField', csv.substring(start, i)) // FIXME: cleanup

    // note that it is possible that a field is empty
    return parse(csv.substring(start, i))
  }

  function isEol(index: number): boolean {
    return isLF(index) || isCRLF(index)
  }

  function eatEol() {
    if (isLF(i)) {
      i++
    } else if (isCRLF(i)) {
      i += 2
    } else {
      throw new Error('End of line expected at pos ' + i)
    }
  }

  function isLF(index: number) {
    return csv[index] === '\n'
  }

  function isCRLF(index: number) {
    return csv[index] === '\r' && csv[index + 1] === '\n'
  }

  function eatEndQuote() {
    if (csv[i] !== '"') {
      throw new Error('End quote " expected at pos ' + i)
    }

    i++
  }
}
