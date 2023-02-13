import { NestedObject } from './types'

export function getIn(object: NestedObject, path: string[]): unknown {
  let value: NestedObject | undefined = object
  let i = 0

  while (i < path.length && value !== undefined) {
    value = value[path[i]] as NestedObject | undefined
    i++
  }

  return value
}
