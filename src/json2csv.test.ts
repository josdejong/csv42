import { describe, expect, test } from 'vitest'
import { json2csv } from './json2csv'
import { testCases } from './data/testCases'
// @ts-ignore
import spectrum from 'csv-spectrum'

describe('json2csv', () => {
  testCases.forEach(({ description, json, csv, csvOptions }) => {
    test(description, () => {
      expect(json2csv(json, csvOptions)).toEqual(csv)
    })
  })

  test('should throw an error when passing an invalid delimiter', () => {
    expect(() => {
      json2csv([], { delimiter: 'foo' })
    }).toThrow('Delimiter must be a single character (got: foo)')
  })
})

describe('spectrum-test-suite', () => {
  return new Promise((resolve, reject) => {
    spectrum(function (err: Error, data: Array<{ name: string; json: Buffer; csv: Buffer }>) {
      if (err) {
        reject(err)
      }

      data.forEach(({ name, json, csv }) => {
        test(name, () => {
          const parsedJson = JSON.parse(String(json))
          const csvString = String(csv).trim()
          const eol = name.includes('crlf') ? '\r\n' : '\n'
          expect(json2csv(parsedJson, { eol }).trim()).toEqual(csvString)
        })
      })

      resolve()
    })
  })
})
