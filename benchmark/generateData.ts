import { json2csv } from '../src/json2csv.js'

export function generateNestedJson(count: number) {
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

export function generateFlatJson(count: number) {
  const data = []

  for (let i = 0; i < count; i++) {
    data.push({
      _type: 'item',
      name: 'Item ' + i,
      description: 'Item ' + i + ' description in text',
      city: 'Rotterdam',
      street: 'Main street',
      latitude: 51.9280712,
      longitude: 4.4207888,
      speed: 5.4,
      heading: 128.3,
      'field with , delimiter': 'value with , delimiter',
      'field with " double quote': 'value with " double quote'
    })
  }

  return data
}

export function generateNestedCsv(count: number) {
  return json2csv(generateNestedJson(count), { flatten: true, flattenArray: true })
}

export function generateFlatCsv(count: number) {
  return json2csv(generateFlatJson(count), { flatten: true, flattenArray: true })
}
