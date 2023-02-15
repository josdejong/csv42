// Note that a number in a Path has meaning: that means an array index and not an object key
export type Path = (string | number)[]

export type NestedObject = { [key: string]: NestedObject | unknown }

export type ValueGetter = (object: NestedObject) => unknown
export type ValueSetter = (object: NestedObject, value: unknown) => void
export type ValueFormatter = (value: unknown) => string
export type ValueParser = (value: string) => unknown

export interface CsvField {
  name: string
  getValue: ValueGetter
}

export interface JsonField {
  name: string
  setValue: ValueSetter
}

export type CsvFieldsParser = (json: NestedObject[]) => CsvField[]
export type JsonFieldsParser = (fieldNames: string[]) => JsonField[]

export interface CsvOptions {
  header?: boolean
  delimiter?: string
  eol?: '\r\n' | '\n'
  fields?: CsvField[] | CsvFieldsParser
  formatValue?: ValueFormatter
}

export interface JsonOptions {
  header?: boolean
  delimiter?: string
  fields?: JsonField[] | JsonFieldsParser
  parseValue?: ValueParser
}
