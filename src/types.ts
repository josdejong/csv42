// Note that a number in a Path has meaning: that means an array index and not an object key
export type Path = (string | number)[]

export type NestedObject = { [key: string]: NestedObject | unknown }

export type ValueGetter<T> = (item: T) => unknown
export type ValueSetter = (item: NestedObject, value: unknown) => void
export type ValueFormatter = (value: unknown) => string
export type ValueParser<T = unknown> = (value: string, quoted: boolean) => T

export type FlattenCallback = (value: unknown) => boolean

export interface CsvField<T> {
  name: string
  getValue: ValueGetter<T>
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

export type CsvFieldsParser<T> = (json: T[]) => CsvField<T>[]
export type JsonFieldsParser = (fieldNames: string[]) => JsonField[]

export interface CsvOptions<T> {
  header?: boolean
  delimiter?: string
  eol?: '\r\n' | '\n'
  flatten?: boolean | FlattenCallback
  fields?: CsvField<T>[] | CsvFieldsParser<T>
  formatValue?: ValueFormatter
}

export interface JsonOptions {
  header?: boolean
  delimiter?: string
  nested?: boolean
  fields?: JsonField[] | JsonFieldsParser
  parseValue?: ValueParser
}
