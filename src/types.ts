// Note that a number in a Path has meaning: that means an array index and not an object key
export type Path = (string | number)[]

/** @ts-ignore **/
export type NestedObject = Record<string, NestedObject>

export type ValueGetter = (object: NestedObject) => unknown
export type ValueSetter = (object: NestedObject, value: unknown) => void
export type ValueFormatter = (value: unknown) => string
export type ValueParser = (value: string) => unknown

export type FlattenCallback = (value: unknown) => boolean

export interface CsvField {
  name: string
  getValue: ValueGetter
}

export interface JsonFieldName {
  name: string
  setValue: ValueSetter
}
export interface JsonFieldIndex {
  index: number
  setValue: ValueSetter
}
export type JsonField = JsonFieldName | JsonFieldIndex

export type CsvFieldsParser = (json: NestedObject[]) => CsvField[]
export type JsonFieldsParser = (fieldNames: string[]) => JsonField[]

export interface CsvOptions {
  header?: boolean
  delimiter?: string
  eol?: '\r\n' | '\n'
  flatten?: boolean | FlattenCallback
  fields?: CsvField[] | CsvFieldsParser
  formatValue?: ValueFormatter
}

export interface JsonOptions {
  header?: boolean
  delimiter?: string
  nested?: boolean
  fields?: JsonField[] | JsonFieldsParser
  parseValue?: ValueParser
}
