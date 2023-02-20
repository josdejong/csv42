import { csv2json, json2csv, NestedObject } from '../src/index.js'
import { Parser } from 'json2csv'
import { stringify as csvStringify } from 'csv/browser/esm/sync'
import { parse as csvParse } from 'csv/browser/esm/sync'
import flat from 'flat'
import converter from 'json-2-csv'
import Papa from 'papaparse'
import { format, parse } from 'fast-csv'

export interface CsvLibrary {
  id: number
  name: string
  flatToCsv: ((json: NestedObject[]) => string) | ((json: NestedObject[]) => Promise<string>) | null
  flatFromCsv: ((csv: string) => NestedObject[]) | ((csv: string) => Promise<NestedObject[]>) | null
  nestedToCsv:
    | ((json: NestedObject[]) => string)
    | ((json: NestedObject[]) => Promise<string>)
    | null
  nestedFromCsv:
    | ((csv: string) => NestedObject[])
    | ((csv: string) => Promise<NestedObject[]>)
    | null
}

export const libraries: CsvLibrary[] = [
  {
    id: 1,
    name: 'csv42',
    flatToCsv: json2csv,
    flatFromCsv: csv2json,
    nestedToCsv: json2csv,
    nestedFromCsv: csv2json
  },
  {
    id: 2,
    name: 'json2csv (+flat)',
    flatToCsv: (json: NestedObject[]) => new Parser({ header: true }).parse(json),
    flatFromCsv: null,
    nestedToCsv: (json: NestedObject[]) =>
      new Parser({ header: true }).parse(json.map(flat.flatten as any)),
    nestedFromCsv: null
  },
  {
    id: 3,
    name: 'csv (+flat)',
    flatToCsv: (json) => csvStringify(json, { header: true }),
    flatFromCsv: (csv) => csvParse(csv, { columns: true, cast: true }),
    nestedToCsv: (json) => csvStringify(json.map(flat.flatten as any), { header: true }),
    nestedFromCsv: (csv) => csvParse(csv, { columns: true, cast: true }).map(flat.unflatten)
  },
  {
    id: 4,
    name: 'papaparse (+flat)',
    flatToCsv: (json) => Papa.unparse(json),
    flatFromCsv: (csv) => Papa.parse(csv, { header: true, transform }).data as NestedObject[],
    nestedToCsv: (json) => Papa.unparse(json.map(flat.flatten as any)),
    nestedFromCsv: (csv) =>
      flat.unflatten(
        Papa.parse(csv, { header: true, transform }).data.map(flat.unflatten as any)
      ) as NestedObject[]
  },
  {
    id: 5,
    name: 'fast-csv (+flat)',
    flatToCsv: (json) => fastCsvFormat(json, false),
    flatFromCsv: (csv) => fastCsvParse(csv, false),
    nestedToCsv: (json) => fastCsvFormat(json, true),
    nestedFromCsv: (csv) => fastCsvParse(csv, true)
  },
  {
    id: 6,
    name: 'json-2-csv',
    flatToCsv: converter.json2csvAsync,
    flatFromCsv: converter.csv2jsonAsync,
    nestedToCsv: converter.json2csvAsync,
    nestedFromCsv: converter.csv2jsonAsync
  }
]

function fastCsvFormat(json: NestedObject[], flatten: boolean): Promise<string> {
  return new Promise<string>((resolve) => {
    let csv = ''
    const stream = format({ headers: true })
    stream.on('data', (chunk) => (csv += chunk))
    stream.on('end', () => resolve(csv))
    if (flatten) {
      json.forEach((item) => {
        stream.write(flat.flatten(item))
      })
    } else {
      json.forEach((item) => {
        stream.write(item)
      })
    }
    stream.end()
  })
}

function fastCsvParse(csv: string, unflatten: boolean): Promise<NestedObject[]> {
  return new Promise<NestedObject[]>((resolve) => {
    const data: any[] = []
    const stream = parse({ headers: true })
      .on('error', (error) => console.error(error))
      .on(
        'data',
        unflatten
          ? (row) => {
              // TODO: can transforming numbers be done in a faster way?
              Object.keys(row).forEach((key) => (row[key] = transform(row[key])))
              data.push(flat.unflatten(row))
            }
          : (row) => {
              // TODO: can transforming numbers be done in a faster way?
              Object.keys(row).forEach((key) => (row[key] = transform(row[key])))
              data.push(row)
            }
      )
      // .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))

    stream.write(csv)
    stream.end()
  })
}

function transform(value: string): unknown {
  const number = Number(value)
  if (!isNaN(number) && !isNaN(parseFloat(value))) {
    return number
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  if (value === 'null' || value === '') {
    return null
  }

  if (value[0] === '{' || value[0] === '[') {
    return JSON.parse(value)
  }

  return value
}
