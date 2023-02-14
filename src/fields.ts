import { getIn, setIn } from './object.js'
import { parsePath, stringifyPath } from './path.js'
import { CsvField, JsonField, NestedObject, Path, ValueGetter } from './types.js'

export function getFieldsFromJson(records: NestedObject[]): CsvField[] {
  return collectAllKeys(records).map((key) => ({
    name: key,
    getValue: (item) => item[key]
  }))
}

export function getNestedFieldsFromJson(records: NestedObject[], keySeparator = '.'): CsvField[] {
  return collectNestedPaths(records).map((path) => {
    return {
      name: stringifyPath(path, keySeparator),
      getValue: createGetValue(path)
    }
  })
}

export function getFieldsFromCsv(fieldNames: string[]): JsonField[] {
  return fieldNames.map(parseSimpleFieldName)
}

export function getNestedFieldsFromCsv(names: string[], keySeparator = '.'): JsonField[] {
  return names.map((name) => parseNestedFieldName(name, keySeparator))
}

export function mapFieldsByName(
  fieldNames: string[],
  fields: JsonField[]
): (JsonField | undefined)[] {
  const mappedFields: (JsonField | undefined)[] = []

  for (let field of fields) {
    // an indexOf inside a for loop is inefficient, but it's ok since we're not dealing with a large array
    const index = fieldNames.indexOf(field.name)
    if (index === -1) {
      throw new Error(`Field "${field.name}" not found in the csv data`)
    }

    mappedFields[index] = field
  }

  return mappedFields
}

function parseSimpleFieldName(name: string): JsonField {
  return {
    name,
    setValue: (record, value) => {
      record[name] = value
    }
  }
}

function parseNestedFieldName(name: string, keySeparator = '.'): JsonField {
  const path = parsePath(name, keySeparator)

  if (path.length === 1) {
    // this is no nested field
    return parseSimpleFieldName(path[0])
  }

  return {
    name,
    setValue: (record, value) => {
      setIn(record, path, value)
    }
  }
}

function collectAllKeys(records: NestedObject[]): string[] {
  const keys = new Set<string>()

  records.forEach((record) => {
    Object.keys(record).forEach((key) => keys.add(key))
  })

  return [...keys]
}

function collectNestedPaths(records: NestedObject[]): Path[] {
  const merged: NestedObject = {}

  function mergeRecord(object: NestedObject, merged: NestedObject) {
    for (const key in object) {
      const value = object[key]

      if (isObjectOrArray(value)) {
        if (merged[key] === undefined) {
          merged[key] = {}
        }

        mergeRecord(value as NestedObject, merged[key] as NestedObject)
      } else {
        merged[key] = true
      }
    }
  }

  records.forEach((record) => mergeRecord(record, merged))

  const paths: Path[] = []
  function collectPaths(object: NestedObject, parentPath: string[]) {
    for (const key in object) {
      const path = parentPath.concat(key)
      const value = object[key]

      if (isObjectOrArray(value)) {
        collectPaths(value as NestedObject, path)
      } else {
        paths.push(path)
      }
    }
  }

  collectPaths(merged, [])

  return paths
}

function isObjectOrArray(value: unknown): boolean {
  return typeof value === 'object' && value !== null
}

function createGetValue(path: Path): ValueGetter {
  if (path.length === 1) {
    const key = path[0]
    return (item) => item[key]
  }

  // Note: we could also create optimized functions for 2 and 3 keys,
  // a rough benchmark showed that does not have a significant performance improvement
  // (like only 2% faster or so, and depending a lot on the data structure)

  return (item) => getIn(item, path)
}
