import { Path } from './types.js'

/**
 * Stringify an array with a path in a JSON path like 'items[3].name'
 * Note that we allow all characters in a property name, like "item with spaces[3].name"
 */
export function stringifyPath(path: Path): string {
  return path
    .map((p, index) => {
      return typeof p === 'number'
        ? '[' + p + ']'
        : /[.\[\]]/.test(p) || p === '' // match any character . or [ or ] and handle an empty string
        ? '["' + p + '"]'
        : (index > 0 ? '.' : '') + p
    })
    .join('')
}

/**
 * Parse a JSON path like 'items[3].name' into a Path
 */
export function parsePath(pathStr: string): Path {
  const path: Path = []
  let i = 0

  while (i < pathStr.length) {
    if (pathStr[i] === '.') {
      i++
    }

    if (pathStr[i] === '[') {
      i++

      if (pathStr[i] === '"') {
        i++
        path.push(parseProp((c) => c === '"'))
        eatCharacter('"')
      } else {
        const prop = parseProp((c) => c === ']')
        const index = Number(prop)

        path.push(isNaN(index) ? prop : index)
      }
      eatCharacter(']')
    } else {
      path.push(parseProp((c) => c === '.' || c === '['))
    }
  }

  function parseProp(isEnd: (char: string) => boolean) {
    const start = i

    while (i < pathStr.length && !isEnd(pathStr[i])) {
      i++
    }

    return pathStr.substring(start, i)
  }

  function eatCharacter(char: string) {
    if (pathStr[i] !== char) {
      throw new SyntaxError(`Invalid JSON path: ${char} expected at position ${i}`)
    }
    i++
  }

  return path
}
