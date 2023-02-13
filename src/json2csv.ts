import { getFields } from './fields.js'
import { createFormatValue } from './value.js'
import { CsvOptions, NestedObject } from './types.js'

export function json2csv(json: NestedObject[], options?: CsvOptions): string {
  const header = options?.header !== false // true when not specified
  const fields = options?.fields || getFields(json)
  const delimiter = options?.delimiter || ','
  const eol = options?.eol || '\r\n'
  const format = options?.formatValue || createFormatValue(delimiter)

  let output = ''

  if (header) {
    output += headerToCsv() + eol
  }

  for (let i = 0; i < json.length; i++) {
    output += rowToCsv(json[i]) + eol
  }

  return output

  function headerToCsv(): string {
    return fields
      .map((field) => field.name)
      .map(format)
      .join(delimiter)
  }

  function rowToCsv(item: NestedObject): string {
    return fields
      .map((field) => field.getValue(item))
      .map(format)
      .join(delimiter)
  }
}
