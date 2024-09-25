import { getIn, isObject, setIn } from './object.js'
import { parsePath, stringifyPath } from './path.js'
import { CsvField, FlattenCallback, JsonField, NestedObject, Path, ValueGetter } from './types.js'

export function collectFields<T>(records: T[], flatten: FlattenCallback): CsvField<T>[] {
  return collectNestedPaths(records, flatten).map((path) => ({
    name: stringifyPath(path),
    getValue: createGetValue(path)
  }))
}

export function toFields(names: string[], nested: boolean): JsonField[] {
  return toUniqueNames(names).map((name) => {
    const path = parsePath(name)
    const first = path[0]

    return {
      name,
      setValue:
        path.length === 0 || !nested
          ? (record, value) => (record[name] = value)
          : path.length === 1
            ? (record, value) => (record[first] = value)
            : (record, value) => setIn(record, path, value)
    }
  })
}

function toUniqueNames(names: string[]): string[] {
  const uniqueNames = new Set()

  return names.map((name) => {
    let uniqueName = name
    let i = 0
    while (uniqueNames.has(uniqueName)) {
      i++
      uniqueName = name + '_' + i
    }
    uniqueNames.add(uniqueName)

    return uniqueName
  })
}

/**
 * Create an array which has an entry for every column in a CSV file, which is:
 * - undefined when the column is not needed in the generated JSON output
 * - JsonField otherwise, where the field can be configured by index, or by name
 *   In the latter case, the index will be resolved by looking the field name up in the
 *   list with fieldNames (containing all available fields)
 */
export function mapFields(fieldNames: string[], fields: JsonField[]): (JsonField | undefined)[] {
  const mappedFields: (JsonField | undefined)[] = []

  for (let field of fields) {
    // an indexOf inside a for loop is inefficient, but it's ok since we're not dealing with a large array
    // @ts-ignore
    const index = field.index !== undefined ? field.index : fieldNames.indexOf(field.name)
    if (index === -1) {
      // @ts-ignore
      throw new Error(`Field "${field.name}" not found in the csv data`)
    }

    if (mappedFields[index]) {
      throw new Error(`Duplicate field for index ${index}`)
    }

    mappedFields[index] = field
  }

  return mappedFields
}

const leaf = Symbol()

type MergedObject = {
  [key: string]: MergedObject
  [leaf]?: boolean | null
}

export function collectNestedPaths<T>(array: T[], recurse: FlattenCallback): Path[] {
  const merged: MergedObject = {}
  array.forEach((item) => {
    if (recurse(item) || isObject(item)) {
      _mergeObject(item as NestedObject, merged, recurse)
    } else {
      _mergeValue(item, merged)
    }
  })

  const paths: Path[] = []
  _collectPaths(merged, [], paths)

  return paths
}

// internal function for collectNestedPaths
// mutates the argument `merged`
function _mergeObject(object: NestedObject, merged: MergedObject, recurse: FlattenCallback): void {
  for (const key in object) {
    const value = object[key]
    const valueMerged =
      merged[key] || (merged[key] = (Array.isArray(value) ? [] : {}) as MergedObject)

    if (recurse(value)) {
      _mergeObject(value as NestedObject, valueMerged as MergedObject, recurse)
    } else {
      _mergeValue(value, valueMerged)
    }
  }
}

// internal function for collectNestedPaths
// mutates the argument `merged`
function _mergeValue(value: unknown, merged: MergedObject) {
  if (merged[leaf] === undefined) {
    merged[leaf] = value === null || value === undefined ? null : true
  }
}

// internal function for collectNestedPaths
// mutates the argument `paths`
function _collectPaths(merged: MergedObject, parentPath: Path, paths: Path[]): void {
  if (merged[leaf] === true || (merged[leaf] === null && isEmpty(merged))) {
    paths.push(parentPath)
  } else if (Array.isArray(merged)) {
    merged.forEach((item, index) => _collectPaths(item, parentPath.concat(index), paths))
  } else if (isObject(merged)) {
    for (const key in merged) {
      _collectPaths(merged[key], parentPath.concat(key), paths)
    }
  }
}

function createGetValue<T>(path: Path): ValueGetter<T> {
  if (path.length === 1) {
    const key = path[0]
    return (item) => (item as NestedObject)[key]
  }

  // Note: we could also create optimized functions for 2 and 3 keys,
  // a rough benchmark showed that does not have a significant performance improvement
  // (like only 2% faster or so, and depending a lot on the data structure)

  return (item) => getIn(item as NestedObject, path)
}

function isEmpty(object: NestedObject): boolean {
  return Object.keys(object).length === 0
}
