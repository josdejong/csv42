import { generateNestedJson } from './generateData.js'
import Benchmark from 'benchmark'
import { collectNestedPaths } from '../src/fields.js'
import { humanSize } from './validate.js'

const data = generateNestedJson(10_000)

console.log('data: ' + humanSize(JSON.stringify(data).length))

new Benchmark.Suite('collectNestedPaths')
  .add('collectNestedPaths', () => collectNestedPaths(data, true, false))
  .on('cycle', function (event: Event) {
    console.log(event.target?.toString())
  })
  .run()
