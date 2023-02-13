import { Parser } from 'json2csv'
import { json2csv } from '../src/json2csv.js'
import { getNestedFields } from '../src/fields.js'

const count = 100_000
const data = generateData(count)

console.time('parse with json2csv')
const csv1 = new Parser({ header: true }).parse(data)
console.timeEnd('parse with json2csv')

console.time('parse with this library (flat)')
const csv2 = json2csv(data)
console.timeEnd('parse with this library (flat)')

console.time('parse with this library (nested)')
const csv3 = json2csv(data, {
  fields: getNestedFields(data)
})
console.timeEnd('parse with this library (nested)')

console.log('Number of items:           ', count)
console.log('json2csv library size:     ', csv1.length, 'bytes')
console.log('this library size (flat):  ', csv2.length, 'bytes')
console.log('this library size (nested):', csv3.length, 'bytes')

console.log()
console.log('csv1 preview:')
console.log(truncateLines(csv1))
console.log()

console.log()
console.log('csv2 preview:')
console.log(truncateLines(csv2))
console.log()

console.log()
console.log('csv3 preview:')
console.log(truncateLines(csv3))
console.log()

function generateData(count: number) {
  const data = []

  for (let i = 0; i < count; i++) {
    data.push({
      _type: 'item',
      name: 'Item ' + i,
      description: 'Item ' + i + ' description in text',
      location: {
        city: 'Rotterdam',
        street: 'Main street',
        geo: [51.9280712, 4.4207888]
      },
      speed: 5.4,
      heading: 128.3,
      size: [3.4, 5.1, 0.9],
      'field with , delimiter': 'value with , delimiter',
      'field with " double quote': 'value with " double quote'
    })
  }

  return data
}

function truncateLines(csvText: string, lines = 5): string {
  return csvText.split('\n').slice(0, lines).join('\n') + '\n...'
}
