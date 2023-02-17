import Benchmark from 'benchmark'
import { Parser } from 'json2csv'
import converter from 'json-2-csv'
import { stringify as csvStringify } from 'csv-stringify/browser/esm/sync'
import { parse as csvParse } from 'csv-parse/browser/esm/sync'
// @ts-ignore
import csvParser from 'csv-parser'
import Papa from 'papaparse'
import { json2csv, csv2json } from '../src/index.js'
import flat from 'flat'
import { format, parse } from 'fast-csv'

const count = 10_000
const data = generateData(count)

const csv1 = json2csv(data, { flatten: true })
console.log(`2) csv42 preview, flatten=true (${csv1.length} bytes):`)
console.log(truncateLines(csv1))
console.time('json1')
const json1 = csv2json(csv1)
console.timeEnd('json1')
console.log(json1[1])
console.log()

const csv2 = json2csv(data, { flatten: false })
console.log(`1) csv42 preview, flatten=false (${csv2.length} bytes):`)
console.log(truncateLines(csv2))
console.time('json2')
const json2 = csv2json(csv2)
console.timeEnd('json2')
console.log(json2[1])
console.log()

const csv3 = new Parser({ header: true }).parse(data)
console.log(`3) json2csv preview (${csv3.length} bytes):`)
console.log(truncateLines(csv3))
console.log()

const csv4 = await converter.json2csvAsync(data)
console.log(`4) json-2-csv preview (${csv4.length} bytes):`)
console.log(truncateLines(csv4))
console.time('json4')
const json4 = await converter.csv2jsonAsync(csv4)
console.timeEnd('json4')
console.log(json4[1])
console.log()

const csv5 = csvStringify(data)
console.log(`5) csv preview (${csv5.length} bytes):`)
console.log(truncateLines(csv5))
console.log()

const csv6 = Papa.unparse(data.map(flat.flatten as any))
console.log(`6) papaparse+flat preview (${csv6.length} bytes):`)
console.log(truncateLines(csv6))
console.time('json6')
const json6 = Papa.parse(csv6).data.map(flat.unflatten as any) // FIXME: must parse into an object instead of array
console.log(json6[1])
console.timeEnd('json6')
console.log()

const csv7 = await fastCsvFormat(data)
console.log(`7) fast-csv+flat preview (${csv7.length} bytes):`)
console.log(truncateLines(csv7))
console.time('json7')
const json7 = await fastCsvParse(csv7)
console.log(json7[1])
console.timeEnd('json7')
console.log()

const suite = new Benchmark.Suite('JSON -> CSV benchmark')
suite
  // Section 1: JSON to CSV
  .add('1) JSON to CSV: csv42 (flatten=true)  ', () => json2csv(data, { flatten: true }))
  .add('2) JSON to CSV: csv42 (flatten=false) ', () => json2csv(data, { flatten: false }))
  .add('3) JSON to CSV: json2csv              ', () => new Parser({ header: true }).parse(data))
  .add('4) JSON to CSV: json-2-csv            ', {
    defer: true,
    fn(deferred: any) {
      converter.json2csvAsync(data).then(() => deferred.resolve())
    }
  })
  .add('5) JSON to CSV: csv                   ', () => csvStringify(data))
  .add('6) JSON to CSV: papaparse+flat        ', () => Papa.unparse(data.map(flat.flatten as any)))
  .add('7) JSON to CSV: fast-csv+flat         ', {
    defer: true,
    fn(deferred: any) {
      fastCsvFormat(data).then(() => deferred.resolve())
    }
  })

  // Section 2: CSV to JSON
  .add('1) CSV to JSON: csv42 (flatten=true)  ', () => csv2json(csv1))
  .add('2) CSV to JSON: csv42 (flatten=false) ', () => csv2json(csv2))
  .add('4) CSV to JSON: json-2-csv            ', {
    defer: true,
    fn(deferred: any) {
      converter.csv2jsonAsync(csv4).then(() => deferred.resolve())
    }
  })
  .add('5) CSV to JSON: csv                   ', () => csvParse(csv5))
  .add(
    '6) CSV to JSON: papaparse+flat (!FIXME) ',
    () =>
      // FIXME: the returned data are array items, no JSON objects and no nested json objects
      Papa.parse(csv6).data
  )
  .add('7) CSV to JSON: fast-csv (!flatten?)            ', {
    defer: true,
    fn(deferred: any) {
      fastCsvParse(csv7).then(() => deferred.resolve())
    }
  })

  .on('cycle', function (event: Event) {
    console.log(String(event.target))
  })
  .run()

function fastCsvFormat(data: any[]) {
  return new Promise<string>((resolve) => {
    let csv = ''
    const stream = format({ headers: true })
    stream.on('data', (chunk) => (csv += chunk))
    stream.on('end', () => resolve(csv))
    data.forEach((item) => {
      stream.write(flat.flatten(item))
    })
    stream.end()
  })
}

function fastCsvParse(csv: string) {
  return new Promise<any[]>((resolve) => {
    const data: any[] = []
    const stream = parse({ headers: true })
      .on('error', (error) => console.error(error))
      // .on('data', (row) => data.push(flat.unflatten(row)))
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))

    stream.write(csv)
    stream.end()
  })
}

function generateData(count: number) {
  const data = []

  for (let i = 0; i < count; i++) {
    data.push({
      _type: 'item',
      name: 'Item ' + i,
      description: 'Item ' + i + ' description in text',
      location: {
        city: 'Rotterdam',
        street: 'Main street',
        geo: [51.9280712, 4.4207888]
      },
      speed: 5.4,
      heading: 128.3,
      size: [3.4, 5.1, 0.9],
      'field with , delimiter': 'value with , delimiter',
      'field with " double quote': 'value with " double quote'
    })
  }

  return data
}

function truncateLines(csvText: string, lines = 5): string {
  return csvText.split('\n').slice(0, lines).join('\n') + '\n...'
}
