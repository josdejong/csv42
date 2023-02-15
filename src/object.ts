import { NestedObject, Path } from './types'

export function getIn(object: NestedObject, path: Path): unknown {
  let value: NestedObject | undefined = object
  let i = 0

  while (i < path.length && value !== undefined) {
    value = value[path[i]] as NestedObject | undefined
    i++
  }

  return value
}

export function setIn(object: NestedObject, path: Path, value: unknown): NestedObject {
  let nested = object
  const iLast = path.length - 1
  let i = 0

  while (i < iLast) {
    const part = path[i]

    if (nested[part] === undefined) {
      if (typeof path[i + 1] === 'number') {
        nested[part] = []
      } else {
        nested[part] = {}
      }
    }

    nested = nested[part] as NestedObject
    i++
  }

  nested[path[iLast]] = value

  return object
}
