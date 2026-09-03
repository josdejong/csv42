import { describe, expect, test } from 'vitest'
import { getIn, isObject, isObjectOrArray, setIn } from './object'

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

    test('should not allow polluting the object prototype via __proto__', () => {
      expect(() => setIn({}, ['__proto__', 'polluted'], 'yes')).toThrow()
      expect(({} as any).polluted).toEqual(undefined)
    })

    test('should not allow polluting the object prototype via constructor.prototype', () => {
      expect(() => setIn({}, ['constructor', 'prototype', 'polluted'], 'yes')).toThrow()
      expect(({} as any).polluted).toEqual(undefined)
    })

    test('should not allow __proto__ as the final path segment', () => {
      expect(() => setIn({}, ['a', '__proto__'], { polluted: 'yes' })).toThrow()
      expect(({} as any).polluted).toEqual(undefined)
    })
  })

  class CustomClass {
    name: string

    constructor(name: string) {
      this.name = name
    }
  }
  const customClass = new CustomClass('foo')

  test('isObjectOrArray', () => {
    expect(isObjectOrArray([])).toBe(true)
    expect(isObjectOrArray({})).toBe(true)
    expect(isObjectOrArray(null)).toBe(false)
    expect(isObjectOrArray('text')).toBe(false)
    expect(isObjectOrArray(42)).toBe(false)
    expect(isObjectOrArray(new Date())).toBe(false)
    expect(isObjectOrArray(customClass)).toBe(false)
  })

  test('isObject', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject('text')).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(new Date())).toBe(false)
    expect(isObject(customClass)).toBe(false)
  })
})
