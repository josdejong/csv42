import { getIn } from './object'
import { CsvField, Path, NestedObject, ValueGetter } from './types'

export function getFields(records: NestedObject[]): CsvField[] {
  return collectAllKeys(records).map((key) => ({
    name: key,
    getValue: (item) => item[key]
  }))
}

export function getNestedFields(records: NestedObject[], keySeparator: string = '.'): CsvField[] {
  return collectNestedPaths(records).map((path) => {
    return {
      name: stringifyPath(path, keySeparator),
      getValue: createGetValue(path)
    }
  })
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

function stringifyPath(path: string[], keySeparator: string): string {
  return (
    path
      // .map((key) => key.replaceAll(keySeparator, keySeparator + keySeparator)) // FIXME: how to escape keySeparators used in the path?
      .join(keySeparator)
  )
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
