import { isObjectOrArray, json2csv } from '../src/index.js'

// note that `csv42` and `flat` supports nested arrays, but for example json-2-csv
// does not. Therefor we will not use nested arrays in the benchmark.
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
        geo: { latitude: 51.9280712, longitude: 4.4207888 }
      },
      speed: 5.4,
      heading: 128.3,
      sizes: { small: 0.9, medium: 3.4, large: 5.1 },
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
  return json2csv(generateNestedJson(count), {
    flatten: isObjectOrArray
  })
}

export function generateFlatCsv(count: number) {
  return json2csv(generateFlatJson(count), {
    flatten: isObjectOrArray
  })
}
