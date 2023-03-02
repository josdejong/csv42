import assert from 'assert'
import {
  generateFlatCsv,
  generateFlatJson,
  generateNestedCsv,
  generateNestedJson
} from './generateData.js'
import Benchmark from 'benchmark'
import { CsvLibrary, libraries } from './libraries.js'
import { humanSize, printCsvPreview, printJsonPreview, validateAll } from './validate.js'
import { NestedObject } from '../src'

// for nicely aligning the library names in the console output:
const maxNameLength = 20

// specify different number of items to run all tests multiple times,
// so you can compare the effect of small vs large amounts of rows
const itemCounts = [100, 1000, 10_000, 100_000]
// const itemCounts = [100]

console.log('PREVIEW')
console.log()
printPreviews()

const issueCount = await validateAll(libraries)
assert(issueCount === 0, 'There must be zero validation issues in order to continue')
console.log('VALIDATION')
console.log()
console.log('All CSV libraries are successfully validated')
console.log()

interface Result {
  [name: string]: string
}

const results: Result[] = []

console.log('SECTION 1: FLAT JSON to CSV')
console.log()

for (let count of itemCounts) {
  results.push(
    await runBenchmark('flat json to csv', generateFlatJson(count), (library) => library.flatToCsv)
  )
}

console.log('SECTION 2: NESTED JSON to CSV')
console.log()

for (let count of itemCounts) {
  results.push(
    await runBenchmark(
      'nested json to csv',
      generateNestedJson(count),
      (library) => library.nestedToCsv
    )
  )
}

console.log('SECTION 3: FLAT CSV to JSON')
console.log()

for (let count of itemCounts) {
  results.push(
    await runBenchmark('flat csv to json', generateFlatCsv(count), (library) => library.flatFromCsv)
  )
}

console.log('SECTION 4: NESTED CSV to JSON')
console.log()

for (let count of itemCounts) {
  results.push(
    await runBenchmark(
      'nested csv to json',
      generateNestedCsv(count),
      (library) => library.nestedFromCsv
    )
  )
}

console.log('RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)')
console.table(results)
console.log()

function runBenchmark<T extends NestedObject[] | string>(
  name: string,
  data: T,
  getRunner: (library: CsvLibrary) => ((json: T) => void) | null
) {
  return new Promise<Result>((resolve) => {
    const desc = description(name, data)
    console.log(desc)

    const result: Result = {}
    const suite = new Benchmark.Suite(name)

    libraries.forEach((library) => {
      const runner = getRunner(library)

      if (runner) {
        suite.add(padRight(`${library.id}:${library.name}`, maxNameLength), {
          defer: true,
          fn: async (deferred: any) => {
            await runner(data)
            deferred.resolve()
          }
        })
      }
    })

    suite.on('cycle', function (event: Event) {
      const summary = String(event.target)
      console.log(name.includes('flat') ? summary.replace('(+flat)', ' '.repeat(7)) : summary)

      result.test = desc

      // calculate ops per second per 1000 items
      // @ts-ignore
      result[event.target.name] = round((event.target.hz * getItemCount(data)) / 1000)
    })
    suite.on('complete', () => {
      console.log()
      resolve(result)
    })
    suite.run()
  })
}

function printPreviews() {
  const count = 10
  printJsonPreview('flat json', generateFlatJson(count))
  printCsvPreview('flat csv', generateFlatCsv(count))
  printJsonPreview('nested json', generateNestedJson(count))
  printCsvPreview('nested csv', generateNestedCsv(count))
}

function round(value: number): number {
  return value < 100 ? Math.round(value * 100) / 100 : Math.round(value)
}

function padRight(text: string, length: number, fill = ' '): string {
  return text + (length > text.length ? fill.repeat(length - text.length) : '')
}

function description(name: string, data: NestedObject[] | string): string {
  if (typeof data === 'string') {
    return `benchmark ${name} (${getItemCount(data)} rows, ${humanSize(data.length)})`
  } else {
    return `benchmark ${name} (${getItemCount(data)} items, ${humanSize(
      JSON.stringify(data).length
    )})`
  }
}

function getItemCount(data: NestedObject[] | string): number {
  if (typeof data === 'string') {
    return data.split('\n').length - 2 // minus 2 to remove the header and trailing newline
  } else {
    return data.length
  }
}
