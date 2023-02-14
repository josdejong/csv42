import { describe, expect, test } from 'vitest'
import { csv2json } from './csv2json'
import { testCases } from './test/testCases'

describe('csv2json', () => {
  testCases.forEach(({ description, json, parsedJson, csv, jsonOptions }) => {
    test(description, () => {
      expect(csv2json(csv, jsonOptions)).toEqual(parsedJson || json)
    })
  })

  test('should throw an error when a field is not found', () => {
    expect(() => {
      csv2json('id,name\n42,Joe', {
        fields: [{ name: 'foo', setValue: (record, value) => (record.foo = value) }]
      })
    }).toThrow('Field "foo" not found in the csv data')
  })

  test('should throw an error when an end quote is missing', () => {
    expect(() => {
      csv2json('"text')
    }).toThrow('Unexpected end: end quote " missing')
  })

  test('should throw an error when passing an invalid delimiter', () => {
    expect(() => {
      csv2json('"text', { delimiter: 'foo' })
    }).toThrow('Invalid delimiter: must be a single character but is "foo"')
  })
})
