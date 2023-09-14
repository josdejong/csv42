// @ts-ignore
import { csv2json, CsvField, json2csv, NestedObject, isObjectOrArray } from '../src/index.js'
import { Parser } from 'json2csv'
import { parse as csvParse, stringify as csvStringify } from 'csv/browser/esm/sync'
import flat from 'flat'
import Converter from 'json-2-csv'
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
    // flatToCsv: (json) => json2csv(json, flatOptions), // <-- This is optimized for a flat JSON object
    flatFromCsv: csv2json,
    nestedToCsv: (json) => json2csv(json, { flatten: isObjectOrArray }),
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
      Papa.parse(csv, { header: true, transform }).data.map(flat.unflatten as any) as NestedObject[]
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
    flatToCsv: Converter.json2csv,
    flatFromCsv: (csv) => Converter.csv2json(csv) as unknown as NestedObject[],
    nestedToCsv: Converter.json2csv,
    nestedFromCsv: (csv) => Converter.csv2json(csv) as unknown as NestedObject[]
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

// options for csv42 to optimize it for parsing flat JSON data
export const flatOptions = {
  flatten: () => false,

  fields: getFlatFields
}

function getFlatFields(json: NestedObject[]): CsvField<Record<string, unknown>>[] {
  const names = new Set<string>()

  for (let i = 0; i < json.length; i++) {
    for (const key in json[i]) {
      names.add(key)
    }
  }

  return [...names].map((name) => ({
    name,
    getValue: (item: Record<string, unknown>) => item[name]
  }))
}
