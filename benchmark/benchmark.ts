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

console.log('SECTION 1: JSON to CSV')
console.log()

for (let count of itemCounts) {
  results.push(
    await runBenchmark('flatToCsv', generateFlatJson(count), (library) => library.flatToCsv)
  )
}

for (let count of itemCounts) {
  results.push(
    await runBenchmark('nestedToCsv', generateNestedJson(count), (library) => library.nestedToCsv)
  )
}

console.log('SECTION 2: CSV to JSON')
console.log()

for (let count of itemCounts) {
  results.push(
    await runBenchmark('flatFromCsv', generateFlatCsv(count), (library) => library.flatFromCsv)
  )
}

for (let count of itemCounts) {
  results.push(
    await runBenchmark(
      'nestedFromCsv',
      generateNestedCsv(count),
      (library) => library.nestedFromCsv
    )
  )
}

console.log('RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)')
console.table(results)
console.log()

console.log('REMARKS')
console.log(`1. The performance depends of course on what kind of data a single
   row contains and how much. This benchmark generates test data that contains
   a bit of everything: string, numbers, strings that need escaping.`)
console.log(`2. Not all libraries do support flattening nested JSON objects.
   This has been tested by flattening the data using the library "flat".
   When the flat library is used, this is added to the name of the library.
   However, flattening is only applied in the nested JSON benchmarks
   "nestedToCsv" and "nestedFromCsv", and NOT to "flatToCsv" and "flatFromCsv".
   From what I've seen, the "flat" step adds something like 20% to the duration: 
   significant, but not the largest part of the work.`)
console.log(`3. The CSV libraries have different defaults when parsing values. 
   In these benchmarks, numeric values are being parsed into numbers. 
   That is slower than leaving all values a string, but is a more realistic test.`)
console.log(`4. For example the library "fast-csv" has a stream based API, 
   meant to read/write to disk or network. It may be that this benchmark is 
   not ideal for such a library.`)
console.log(`5. A library like "json2csv" is very fast for small amounts of data, 
   but the performance degrades a lot with large amounts of data.`)

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
