import { collectFields } from './fields.js'
import { createFormatValue } from './value.js'
import { CsvOptions, FlattenCallback, NestedObject } from './types.js'
import { validateDelimiter, validateEOL } from './validate.js'
import { isObject } from './object.js'

export function json2csv(json: NestedObject[], options?: CsvOptions): string {
  const header = options?.header !== false // true when not specified
  const delimiter = validateDelimiter(options?.delimiter || ',')
  const eol = validateEOL(options?.eol || '\r\n')
  const flatten: FlattenCallback =
    typeof options?.flatten === 'function'
      ? options?.flatten
      : options?.flatten === false
      ? () => false
      : isObject // options?.flatten is true or undefined
  const fields = options?.fields
    ? Array.isArray(options?.fields)
      ? options?.fields
      : options?.fields(json)
    : collectFields(json, flatten)
  const formatValue = options?.formatValue || createFormatValue(delimiter)

  let output = ''

  if (header) {
    output += headerToCsv() + eol
  }

  for (let i = 0; i < json.length; i++) {
    output += rowToCsv(json[i]) + eol
  }

  return output

  function headerToCsv(): string {
    return fields.map((field) => formatValue(field.name)).join(delimiter)
  }

  function rowToCsv(item: NestedObject): string {
    return fields.map((field) => formatValue(field.getValue(item))).join(delimiter)
  }
}
