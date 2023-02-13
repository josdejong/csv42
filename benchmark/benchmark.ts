import { Parser } from 'json2csv'
import { readFileSync } from 'fs'
import { json2csv } from '../src'
import { getNestedFields } from '../src/fields'

console.time('events load')

const file = 'C:\\Users\\wjosd\\data\\json\\events_2016-01.json'
// const file = 'C:\\Users\\wjosd\\data\\json\\ships.json'
const eventsText = readFileSync(file, { encoding: 'utf8' })
console.timeEnd('events load')

console.time('events parse')
const events = JSON.parse(eventsText)
console.timeEnd('events parse')

console.time('events to csv (lib)')
new Parser({ header: true }).parse(events)
console.timeEnd('events to csv (lib)')

console.time('events to csv (mine)')
json2csv(events, {
  fields: getNestedFields(events)
})
console.timeEnd('events to csv (mine)')
