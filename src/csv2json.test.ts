import { describe, expect, test } from 'vitest'
import { csv2json } from './csv2json'

describe('csv2json', () => {
  test('should convert all data types', () => {
    expect(
      csv2json(
        'string,empty,number,true,false,object,array,null,undefined\r\n' +
          'hi,"",42,true,false,"{""key"":""value""}","[""item1""]",,\r\n'
      )
    ).toEqual([
      {
        string: 'hi',
        empty: '',
        number: 42,
        true: true,
        false: false,
        object: { key: 'value' },
        array: ['item1'],
        null: null,
        undefined: undefined
      }
    ])
  })

  test('should parse a CSV with header', () => {
    const csv = 'id,name\r\n1,Joe\r\n2,Sarah\r\n'
    const expected = [
      { id: 1, name: 'Joe' },
      { id: 2, name: 'Sarah' }
    ]

    expect(csv2json(csv)).toEqual(expected)
    expect(csv2json(csv, { header: true })).toEqual(expected)
  })

  test('should parse a CSV without header', () => {
    expect(csv2json('1,Joe\r\n2,Sarah\r\n', { header: false })).toEqual([
      { 'Field 0': 1, 'Field 1': 'Joe' },
      { 'Field 0': 2, 'Field 1': 'Sarah' }
    ])
  })

  test('should parse a custom delimiter', () => {
    expect(csv2json('a;b\r\n"containing;delimiter";text\r\n', { delimiter: ';' })).toEqual([
      { a: 'containing;delimiter', b: 'text' }
    ])
  })

  test('should parse a custom eol', () => {
    expect(csv2json('id,name\n1,Joe\n2,Sarah\n')).toEqual([
      { id: 1, name: 'Joe' },
      { id: 2, name: 'Sarah' }
    ])
  })

  test('should parse custom fields', () => {
    expect(
      csv2json('id,name\r\n1,Joe\r\n2,Sarah\r\n', {
        fields: [{ name: 'name', setValue: (item, value) => (item.name = value) }]
      })
    ).toEqual([{ name: 'Joe' }, { name: 'Sarah' }])
  })

  test('should parse custom fields, fields being a function', () => {
    expect(
      csv2json('id,name\r\n1,Joe\r\n2,Sarah\r\n', {
        fields: () => [{ name: 'name', setValue: (item, value) => (item.name = value) }]
      })
    ).toEqual([{ name: 'Joe' }, { name: 'Sarah' }])
  })

  test('should throw an error when a field is not found', () => {
    expect(() => {
      csv2json('id,name\n42,Joe', {
        fields: [{ name: 'foo', setValue: (record, value) => (record.foo = value) }]
      })
    }).toThrow('Field "foo" not found in the csv data')
  })

  test('should unescape control character "', () => {
    expect(csv2json('name\r\n"""Big"" Joe"\r\n')).toEqual([{ name: '"Big" Joe' }])
  })

  test('should unescape control character ,', () => {
    expect(csv2json('name\r\n"Joe,Jones"\r\n')).toEqual([{ name: 'Joe,Jones' }])
  })

  test('should unescape control character \\n', () => {
    expect(csv2json('name\r\n"Joe\nJones"\r\n')).toEqual([{ name: 'Joe\nJones' }])
  })

  test('should unescape control character \\r', () => {
    expect(csv2json('name\r\n"Joe\rJones"\r\n')).toEqual([{ name: 'Joe\rJones' }])
  })

  test('should unescape control character " in the header', () => {
    expect(csv2json('name\r\n"""Big"" Joe"\r\n')).toEqual([{ name: '"Big" Joe' }])
  })

  test('should unescape control character , in the header', () => {
    expect(csv2json('name\r\n"Joe,Jones"\r\n')).toEqual([{ name: 'Joe,Jones' }])
  })

  test('should unescape control character \\n in the header', () => {
    expect(csv2json('name\r\n"Joe\nJones"\r\n')).toEqual([{ name: 'Joe\nJones' }])
  })

  test('should unescape control character \\r in the header', () => {
    expect(csv2json('name\r\n"Joe\rJones"\r\n')).toEqual([{ name: 'Joe\rJones' }])
  })

  test('should parse nested fields', () => {
    const csv =
      'name,details.address.city,details.location[0],details.location[1]\r\n' +
      'Joe,Rotterdam,51.9280712,4.4207888\r\n'

    const jsonNested = [
      {
        name: 'Joe',
        details: {
          address: { city: 'Rotterdam' },
          location: [51.9280712, 4.4207888]
        }
      }
    ]

    const jsonFlat = [
      {
        name: 'Joe',
        'details.address.city': 'Rotterdam',
        'details.location[0]': 51.9280712,
        'details.location[1]': 4.4207888
      }
    ]

    expect(csv2json(csv)).toEqual(jsonNested)
    expect(csv2json(csv, { nested: true })).toEqual(jsonNested)
    expect(csv2json(csv, { nested: false })).toEqual(jsonFlat)
  })

  test('should parse stringified JSON', () => {
    const csv =
      'name,details\r\n' +
      'Joe,"{""address"":{""city"":""Rotterdam""},""location"":[51.9280712,4.4207888]}"\r\n'

    expect(csv2json(csv)).toEqual([
      {
        name: 'Joe',
        details: {
          address: { city: 'Rotterdam' },
          location: [51.9280712, 4.4207888]
        }
      }
    ])
  })

  test('should parser nested fields containing the key separator', () => {
    expect(csv2json('"nested[""field.name""]"\r\n42\r\n')).toEqual([
      { nested: { 'field.name': 42 } }
    ])
  })

  test('should parser nested fields containing the key separator and a control character', () => {
    expect(csv2json('"nested[""field.,name""]"\r\n42\r\n')).toEqual([
      { nested: { 'field.,name': 42 } }
    ])
  })

  test('should parse empty data', () => {
    expect(csv2json('')).toEqual([])
    expect(csv2json('\r\n')).toEqual([])
  })

  test('should throw an error when an end quote is missing', () => {
    expect(() => {
      csv2json('"text')
    }).toThrow('Unexpected end: end quote " missing')
  })

  test('should throw an error when passing an invalid delimiter', () => {
    expect(() => {
      csv2json('"text', { delimiter: 'foo' })
    }).toThrow('Invalid delimiter: must be a single character but is "foo"')
  })
})
