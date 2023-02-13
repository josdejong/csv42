import { JsonField, JsonOptions, NestedObject } from './types.js'
import { indexOfValueEnd, isEol, parseValue } from './value.js'
import { parseSimpleFieldName } from './fields'

export function csv2json(csv: string, options?: JsonOptions): NestedObject[] {
  const withHeader = options?.header !== false // true when not specified
  const delimiter = options?.delimiter || ','
  const parse = options?.parseValue || parseValue
  const parseFieldName = options?.parseFieldName || parseSimpleFieldName

  const json: NestedObject[] = []
  let i = 0

  const parsedHeader = parseHeader()
  const fields = options?.fields || parsedHeader

  while (i < csv.length) {
    const object = {}

    parseRecord((value, index) => {
      fields[index].setValue(object, value)
    })

    json.push(object)
  }

  return json

  function parseHeader(): JsonField[] {
    const fields: JsonField[] = []

    parseRecord((fieldName, index) => {
      const name = withHeader ? String(fieldName) : `Field ${index}`

      fields.push(parseFieldName(name))
    })

    if (!withHeader) {
      i = 0 // reset the pointer again: the first line contains data, not a header
    }

    return fields
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
    i = indexOfValueEnd(csv, delimiter, start)

    // console.log('parseField', csv.substring(start, i)) // FIXME: cleanup

    // note that it is possible that a field is empty
    return parse(csv.substring(start, i))
  }

  function eatEol() {
    if (!isEol(csv, i)) {
      throw new Error('End of line expected at pos ' + i)
    }

    if (csv[i] === '\n') {
      i++ // lf
    } else {
      i += 2 // crlf
    }
  }
}
