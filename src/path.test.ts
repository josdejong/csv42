import { describe, expect, test } from 'vitest'
import { parsePath, stringifyPath } from './path'

describe('path', () => {
  test('stringifyPath', () => {
    expect(stringifyPath([])).toEqual('')
    expect(stringifyPath(['name'])).toEqual('name')
    expect(stringifyPath(['address', 'location', 0])).toEqual('address.location[0]')
    expect(stringifyPath([0, 'name'])).toEqual('[0].name')
    expect(stringifyPath(['prop.with.dot'])).toEqual('["prop.with.dot"]')
    expect(stringifyPath(['prop with space'])).toEqual('["prop with space"]')
  })

  test('parsePath', () => {
    expect(parsePath('')).toEqual([])
    expect(parsePath('name')).toEqual(['name'])
    expect(parsePath('address.location[0]')).toEqual(['address', 'location', 0])
    expect(parsePath('[0].name')).toEqual([0, 'name'])
    expect(parsePath('[90].name')).toEqual([90, 'name'])
    expect(parsePath('["prop.with.dot"]')).toEqual(['prop.with.dot'])
    expect(parsePath('["prop with space"]')).toEqual(['prop with space'])

    // The following is a bit odd.
    // We allow it because (a) we want a forgiving parser
    // and (b) we want to keep parsePath as small as possible (number of bytes)
    expect(parsePath('[hello]')).toEqual(['hello'])
    expect(parsePath('[123a]')).toEqual(['123a'])
    expect(parsePath('[  123 ]')).toEqual([123])
  })

  test('throw an error when parsing an invalid path', () => {
    expect(() => parsePath('[12')).toThrow('Invalid JSON path: ] expected at position 3')
    expect(() => parsePath('["hello')).toThrow('Invalid JSON path: " expected at position 7')
  })
})
