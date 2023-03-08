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
import { isObjectOrArray, json2csv, NestedObject } from '../src/index.js'

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
  benchmark: string
  data: string
  [name: string]: number | string
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

console.log('RESULTS TABLE CSV (1000x ROWS/SEC, HIGHER IS BETTER)')
console.log()
console.log(json2csv(results))
console.log()

function runBenchmark<T extends NestedObject[] | string>(
  name: string,
  data: T,
  getRunner: (library: CsvLibrary) => ((json: T) => void) | null
) {
  return new Promise<Result>(async (resolve) => {
    const rows = getItemCount(data)
    const size = humanSize(
      typeof data === 'string' ? data.length : json2csv(data, { flatten: isObjectOrArray }).length
    )

    console.log('benchmark:', { name, size, rows })

    const result: Result = {
      benchmark: name,
      data: `${rows} rows, ${size}`
    }
    const suite = new Benchmark.Suite(name)

    for (let library of libraries) {
      const runner = getRunner(library)

      if (runner) {
        // cold start: run once before actually benchmarking
        await runner(data)

        suite.add(padRight(`${library.id}:${library.name}`, maxNameLength), {
          defer: true,
          fn: async (deferred: any) => {
            await runner(data)
            deferred.resolve()
          }
        })
      }
    }

    suite.on('cycle', function (event: Event) {
      const summary = String(event.target)
      console.log(name.includes('flat') ? summary.replace('(+flat)', ' '.repeat(7)) : summary)

      // calculate rows per second per 1000 items
      // @ts-ignore
      result[event.target.name.trim()] = round((event.target.hz * getItemCount(data)) / 1000)
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

function getItemCount(data: NestedObject[] | string): number {
  if (typeof data === 'string') {
    return data.split('\n').length - 2 // minus 2 to remove the header and trailing newline
  } else {
    return data.length
  }
}
