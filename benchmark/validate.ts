import { NestedObject } from '../src/index.js'
import { CsvLibrary } from './libraries.js'
import { isEqual } from 'lodash-es'

export async function validateAll(libraries: CsvLibrary[]): Promise<number> {
  let issueCount = 0

  for (let library of libraries) {
    issueCount += await validate(library)
  }

  return issueCount
}

export async function validate(library: CsvLibrary): Promise<number> {
  let issueCount = 0

  const flatToCsv = library.flatToCsv
  if (flatToCsv) {
    const jsonFlat = [
      { id: 1, name: 'Joe' },
      { id: 2, name: 'Sarah' }
    ]
    const csvExpected = [
      'id,name\r\n1,Joe\r\n2,Sarah\r\n',
      'id,name\r\n1,Joe\r\n2,Sarah',
      'id,name\n1,Joe\n2,Sarah\n',
      'id,name\n1,Joe\n2,Sarah',
      '"id","name"\r\n1,"Joe"\r\n2,"Sarah"',
      '"id","name"\n1,"Joe"\n2,"Sarah"'
    ]

    const actual = await flatToCsv(jsonFlat)
    if (!csvExpected.some((expected) => isEqual(expected, actual))) {
      console.error('Validation Error: CSV output not valid')
      console.error('Actual:         ', JSON.stringify(actual))
      console.error('Expected one of:', JSON.stringify(csvExpected[0]))
      csvExpected.slice(1).map((csv) => console.error('                ', JSON.stringify(csv)))
      console.error('Library: ' + library.name)
      console.error('Function: ' + 'flatToCsv')
      console.error()
      issueCount++
    }
  }

  const nestedToCsv = library.nestedToCsv
  if (nestedToCsv) {
    const jsonNested = [
      { name: 'Joe', address: { city: 'Rotterdam' } },
      { name: 'Sarah', address: { city: 'Amsterdam' } }
    ]
    const csvExpected = [
      'name,address.city\r\nJoe,Rotterdam\r\nSarah,Amsterdam\r\n',
      'name,address.city\r\nJoe,Rotterdam\r\nSarah,Amsterdam',
      'name,address.city\nJoe,Rotterdam\nSarah,Amsterdam\n',
      'name,address.city\nJoe,Rotterdam\nSarah,Amsterdam',
      '"name","address.city"\r\n"Joe","Rotterdam"\r\n"Sarah","Amsterdam"',
      '"name","address.city"\n"Joe","Rotterdam"\n"Sarah","Amsterdam"'
    ]

    const actual = await nestedToCsv(jsonNested)
    if (!csvExpected.some((expected) => isEqual(expected, actual))) {
      console.error('Validation Error: CSV output not valid')
      console.error('Actual:          ' + JSON.stringify(actual))
      console.error('Expected one of: ' + JSON.stringify(csvExpected[0]))
      csvExpected.slice(1).map((csv) => console.error('                 ' + JSON.stringify(csv)))
      console.error('Library: ' + library.name)
      console.error('Function: ' + 'nestedToCsv')
      console.error()
      issueCount++
    }
  }

  const flatFromCsv = library.flatFromCsv
  if (flatFromCsv) {
    const csvFlat = 'id,name\n1,Joe\n2,Sarah'

    const jsonExpected = [
      { id: 1, name: 'Joe' },
      { id: 2, name: 'Sarah' }
    ]

    const actual = await flatFromCsv(csvFlat)
    if (!isEqual(jsonExpected, actual)) {
      console.error('Validation Error: JSON output not valid')
      console.error('Actual:   ' + JSON.stringify(actual))
      console.error('Expected: ' + JSON.stringify(jsonExpected))
      console.error('Library:  ' + library.name)
      console.error('Function: ' + 'flatFromCsv')
      console.error()
      issueCount++
    }
  }

  const nestedFromCsv = library.nestedFromCsv
  if (nestedFromCsv) {
    const csvNested =
      // 'id,name,address.city,address.geo.0,address.geo.1\n' +
      'id,name,address.city,address.geo.longitude,address.geo.latitude\n' +
      '1,Joe,Rotterdam,4.4207888,51.9280712\n' +
      '2,Sarah,Amsterdam,4.8997357,52.378151'

    const jsonExpected = [
      {
        id: 1,
        name: 'Joe',
        address: { city: 'Rotterdam', geo: { longitude: 4.4207888, latitude: 51.9280712 } }
      },
      {
        id: 2,
        name: 'Sarah',
        address: { city: 'Amsterdam', geo: { longitude: 4.8997357, latitude: 52.378151 } }
      }
    ]

    const actual = await nestedFromCsv(csvNested)
    if (!isEqual(jsonExpected, actual)) {
      console.error('Validation Error: JSON output not valid')
      console.error('Actual:   ' + JSON.stringify(actual))
      console.error('Expected: ' + JSON.stringify(jsonExpected))
      console.error('Library:  ' + library.name)
      console.error('Function: ' + 'nestedFromCsv')
      console.error()
      issueCount++
    }
  }

  return issueCount
}

export function printJsonPreview(name: string, json: NestedObject[]) {
  console.log(`${name} preview:`)
  console.log(truncateJson(json))
  console.log()
}

export function printCsvPreview(name: string, csv: string) {
  console.log(`${name} preview:`)
  console.log(truncateCsv(csv))
  console.log()
}

function truncateJson(json: NestedObject[], lines = 3): string {
  return (
    '[\n  ' +
    json
      .slice(0, lines)
      .map((item) => JSON.stringify(item))
      .join(',\n  ') +
    ',\n  ...\n]'
  )
}

export function truncateCsv(csvText: string, lines = 4): string {
  return csvText.split('\n').slice(0, lines).join('\n') + '\n...'
}

export function humanSize(bytes: number): string {
  if (bytes > 1024 * 1024 * 10) {
    // output like 15 MB
    return Math.round(bytes / 1024 / 1024) + ' MB'
  }

  if (bytes > 1024 * 1024) {
    // one digit, like 1.4 MB
    return Math.round((bytes / 1024 / 1024) * 10) / 10 + ' MB'
  }

  if (bytes > 1024) {
    // output like 23 KB
    return Math.round(bytes / 1024) + ' KB'
  }

  // output like 159 B
  return bytes + ' B'
}
