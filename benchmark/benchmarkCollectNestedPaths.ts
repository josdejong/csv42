import { generateNestedJson } from './generateData.js'
import Benchmark from 'benchmark'
import { collectNestedPaths, isObject } from '../src/index.js'
import { humanSize } from './validate.js'

const data = generateNestedJson(10_000)

console.log('data: ' + humanSize(JSON.stringify(data).length))

const nestedPaths = collectNestedPaths(data, isObject)
console.log('nested paths:', nestedPaths)

new Benchmark.Suite('collectNestedPaths')
  .add('collectNestedPaths', () => collectNestedPaths(data, isObject))
  .on('cycle', function (event: Event) {
    console.log(event.target?.toString())
  })
  .run()
