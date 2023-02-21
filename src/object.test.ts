import { describe, expect, test } from 'vitest'
import { getIn, isObjectOrArray, setIn } from './object'

describe('object', () => {
  describe('getIn', () => {
    test('get a nested property', () => {
      expect(getIn({ name: 'Joe' }, ['name'])).toEqual('Joe')
      expect(getIn({ name: 'Joe' }, ['foo'])).toEqual(undefined)
      expect(getIn({ nested: { name: 'Joe' } }, ['nested', 'name'])).toEqual('Joe')
      expect(getIn({ nested: { array: ['a', 'b'] } }, ['nested', 'array', '1'])).toEqual('b')
      expect(getIn({ nested: { array: ['a', 'b'] } }, ['nested', 'foo', 'bar'])).toEqual(undefined)
      expect(getIn({ nested: null }, ['nested', 'foo', 'bar'])).toEqual(undefined)
      expect(getIn({ nested: undefined }, ['nested', 'foo', 'bar'])).toEqual(undefined)
      expect(getIn({ nested: 123 }, ['nested', 'foo', 'bar'])).toEqual(undefined)
      expect(getIn({ nested: true }, ['nested', 'foo', 'bar'])).toEqual(undefined)
    })
  })

  describe('setInt', () => {
    test('set a nested property', () => {
      expect(setIn({}, ['name'], 'Joe')).toEqual({ name: 'Joe' })
      expect(setIn({}, ['address', 'city'], 'Rotterdam')).toEqual({
        address: { city: 'Rotterdam' }
      })
    })

    test('set a nested property with numeric index', () => {
      expect(setIn({}, ['values', 0], 42)).toEqual({ values: [42] })
    })
  })

  test('isObjectOrArray', () => {
    expect(isObjectOrArray([])).toBe(true)
    expect(isObjectOrArray({})).toBe(true)
    expect(isObjectOrArray(null)).toBe(false)
    expect(isObjectOrArray('text')).toBe(false)
    expect(isObjectOrArray(42)).toBe(false)
    expect(isObjectOrArray(new Date())).toBe(true) // hm. should this return true?
  })
})
