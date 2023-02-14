// TODO: unit test
// TODO: stringify array indices differently?
import { Path } from './types'

export function stringifyPath(path: Path, keySeparator: string): string {
  return path.map((text) => text.replaceAll(keySeparator, '\\' + keySeparator)).join(keySeparator)
}

// TODO: unit test
export function parsePath(pathStr: string, keySeparator: string): Path {
  return pathStr
    .split(new RegExp('(?<!\\\\)[' + keySeparator + ']'))
    .map((part) => part.replaceAll('\\' + keySeparator, keySeparator))
}
