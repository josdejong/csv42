import { json2csv } from '../../lib/esm/index.js'

const json = [
  { id: 1, name: 'Joe' },
  { id: 2, name: 'Sarah' }
]

console.log(json2csv(json))
