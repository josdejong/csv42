import { Path } from './types.js'

/**
 * Stringify an array with a path in a JSON path like 'items[3].name'
 * Note that we allow all characters in a property name, like 'item with spaces[3].name'
 * Property names containing a special character like a dot . are escaped inside a string
 * like 'object.["prop with ."]'.
 * Double quotes inside a string are escaped by a backslash character,
 * like 'object.["prop with \" double quotes"]'
 */
export function stringifyPath(path: Path): string {
  return path
    .map((p, index) => {
      return typeof p === 'number'
        ? '[' + p + ']'
        : /[.\[\]]/.test(p) || p === '' // match any character . or [ or ] and handle an empty string
        ? '["' + escapeQuotes(p) + '"]'
        : (index > 0 ? '.' : '') + p
    })
    .join('')
}

function escapeQuotes(prop: string): string {
  return prop.replace(/"/g, '\\"')
}

/**
 * Parse a JSON path like 'items[3].name' into a Path.
 * See also function `stringifyPath`.
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
        path.push(parseProp((c) => c === '"', true))
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

  function parseProp(isEnd: (char: string) => boolean, unescape = false) {
    let prop = ''

    while (i < pathStr.length && !isEnd(pathStr[i])) {
      if (unescape && pathStr[i] === '\\' && pathStr[i + 1] === '"') {
        // escaped double quote
        prop += '"'
        i += 2
      } else {
        prop += pathStr[i]
        i++
      }
    }

    return prop
  }

  function eatCharacter(char: string) {
    if (pathStr[i] !== char) {
      throw new SyntaxError(`Invalid JSON path: ${char} expected at position ${i}`)
    }
    i++
  }

  return path
}
