import { describe, expect, test } from 'vitest'
import { json2csv } from './json2csv'
import { Parser } from 'json2csv'
import { readFileSync } from 'fs'
import { testCases } from './data/testCases'
// @ts-ignore
import spectrum from 'csv-spectrum'
import { getNestedFields } from './fields'

describe('json2csv', () => {
  testCases.forEach(({ description, json, csv, csvOptions }) => {
    test(description, () => {
      expect(json2csv(json, csvOptions)).toEqual(csv)
    })
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

// TODO: move into a separate benchmark file
test.skip('performance (events)', () => {
  console.time('events load')

  const file = 'C:\\Users\\wjosd\\data\\json\\events_2016-01.json'
  // const file = 'C:\\Users\\wjosd\\data\\json\\ships.json'
  const eventsText = readFileSync(file, { encoding: 'utf8' })
  console.timeEnd('events load')

  console.time('events parse')
  const events = JSON.parse(eventsText)
  console.timeEnd('events parse')

  console.time('events to csv (lib)')
  new Parser({ header: true }).parse(events)
  console.timeEnd('events to csv (lib)')

  console.time('events to csv (mine)')
  json2csv(events, {
    fields: getNestedFields(events)
  })
  console.timeEnd('events to csv (mine)')
})
