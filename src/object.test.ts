import { describe, expect, test } from 'vitest'
import { getIn } from './object'

describe('object', () => {
  describe('getIn', () => {
    test('get a nested property', () => {
      expect(getIn({ name: 'Joe' }, ['name'])).toEqual('Joe')
      expect(getIn({ name: 'Joe' }, ['foo'])).toEqual(undefined)
      expect(getIn({ nested: { name: 'Joe' } }, ['nested', 'name'])).toEqual('Joe')
      expect(getIn({ nested: { array: ['a', 'b'] } }, ['nested', 'array', '1'])).toEqual('b')
      expect(getIn({ nested: { array: ['a', 'b'] } }, ['nested', 'foo', 'bar'])).toEqual(undefined)
    })
  })
})
