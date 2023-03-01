import { getIn, setIn } from './object.js'
import { parsePath, stringifyPath } from './path.js'
import { CsvField, FlattenValue, JsonField, NestedObject, Path, ValueGetter } from './types.js'

export function collectFields(records: NestedObject[], flatten: FlattenValue): CsvField[] {
  return collectNestedPaths(records, flatten).map((path) => ({
    name: stringifyPath(path),
    getValue: createGetValue(path)
  }))
}

export function toFields(names: string[], nested: boolean): JsonField[] {
  return names.map((name) => {
    const path = parsePath(name)

    return {
      name,
      setValue:
        path.length === 1 || !nested
          ? (record, value) => (record[name] = value)
          : (record, value) => setIn(record, path, value)
    }
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
    // const index = typeof field.index === 'number' ? field.index : fieldNames.indexOf(field.name)
    // @ts-ignore
    const index = field.index !== undefined ? field.index : fieldNames.indexOf(field.name)
    if (index === -1) {
      // @ts-ignores
      throw new Error(`Field "${field.name}" not found in the csv data`)
    }

    if (mappedFields[index]) {
      throw new Error(`Duplicate field for index ${index}`)
    }

    mappedFields[index] = field
  }

  return mappedFields
}

export function collectNestedPaths(records: NestedObject[], flatten: FlattenValue): Path[] {
  const merged: NestedObject = {}
  records.forEach((record) => _mergeRecord(record, merged, flatten))

  const paths: Path[] = []
  _collectPaths(merged, [], flatten, paths)

  return paths
}

// internal helper function for collectNestedPaths
// this function mutates the argument `merged`
function _mergeRecord(object: NestedObject, merged: NestedObject, flatten: FlattenValue) {
  for (const key in object) {
    const value = object[key]

    if (flatten(value)) {
      // if merged[key] === true we have mixed content, in that case we should not iterate deeper
      if (merged[key] !== true) {
        if (merged[key] === undefined) {
          merged[key] = Array.isArray(object[key]) ? [] : {}
        }

        _mergeRecord(value as NestedObject, merged[key] as NestedObject, flatten)
      }
    } else {
      if (merged[key] !== true) {
        merged[key] = true
      }
    }
  }
}

// internal helper function for collectNestedPaths
// this function mutates the argument `paths`
function _collectPaths(
  object: NestedObject,
  parentPath: Path,
  flatten: FlattenValue,
  paths: Path[]
) {
  for (const key in object) {
    const path = parentPath.concat(Array.isArray(object) ? parseInt(key) : key)
    const value = object[key]

    if (flatten(value)) {
      _collectPaths(value as NestedObject, path, flatten, paths)
    } else {
      paths.push(path)
    }
  }
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
