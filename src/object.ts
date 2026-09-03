import { NestedObject, Path } from './types'

export function getIn(object: NestedObject, path: Path): unknown {
  let value: NestedObject | undefined = object
  let i = 0

  while (i < path.length && value !== undefined) {
    value = value?.[path[i]] as NestedObject | undefined
    i++
  }

  return value
}

// Path segments that would let setIn write through the prototype chain
// instead of onto the plain object it was given (path comes straight from
// CSV column names when nested field parsing is enabled, so it can't be
// trusted).
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

export function setIn(object: NestedObject, path: Path, value: unknown): NestedObject {
  let nested = object
  const iLast = path.length - 1
  let i = 0

  while (i < iLast) {
    const part = path[i]

    if (UNSAFE_KEYS.has(part as string)) {
      throw new Error(`Cannot set property "${part}": not allowed to change the object prototype`)
    }

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

  if (UNSAFE_KEYS.has(path[iLast] as string)) {
    throw new Error(
      `Cannot set property "${path[iLast]}": not allowed to change the object prototype`
    )
  }

  nested[path[iLast]] = value

  return object
}

export function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && value.constructor === Object // do not match on classes or Array
}

export function isObjectOrArray(value: unknown): boolean {
  return isObject(value) || Array.isArray(value)
}
