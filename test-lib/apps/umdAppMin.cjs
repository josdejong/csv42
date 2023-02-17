const { json2csv } = require('../../lib/umd/csv42.min')

const json = [
  { id: 1, name: 'Joe' },
  { id: 2, name: 'Sarah' }
]

console.log(json2csv(json))
