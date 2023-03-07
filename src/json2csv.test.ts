import { describe, expect, test } from 'vitest'
import { json2csv } from './json2csv'
// @ts-ignore
import spectrum from 'csv-spectrum'
import { isObject, isObjectOrArray } from './object'

describe('json2csv', () => {
  const users = [
    { id: 1, name: 'Joe' },
    { id: 2, name: 'Sarah' }
  ]

  test('should convert all data types', () => {
    expect(
      json2csv(
        [
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
        ],
        { flatten: false }
      )
    ).toEqual(
      'string,empty,number,true,false,object,array,null,undefined\r\n' +
        'hi,"",42,true,false,"{""key"":""value""}","[""item1""]",,\r\n'
    )
  })

  test('should create a header', () => {
    expect(json2csv(users)).toEqual('id,name\r\n1,Joe\r\n2,Sarah\r\n')
    expect(json2csv(users, { header: true })).toEqual('id,name\r\n1,Joe\r\n2,Sarah\r\n')
  })

  test('should not create a header', () => {
    expect(json2csv(users, { header: false })).toEqual('1,Joe\r\n2,Sarah\r\n')
  })

  test('should use a custom delimiter', () => {
    expect(json2csv([{ a: 'containing;delimiter', b: 'text' }], { delimiter: ';' })).toEqual(
      'a;b\r\n"containing;delimiter";text\r\n'
    )
  })

  test('should use a custom eol', () => {
    expect(json2csv(users, { eol: '\n' })).toEqual('id,name\n1,Joe\n2,Sarah\n')
  })

  test('should use custom fields', () => {
    expect(
      json2csv(users, {
        fields: [{ name: 'name', getValue: (item) => item.name }]
      })
    ).toEqual('name\r\nJoe\r\nSarah\r\n')
  })

  test('should use a custom order of fields', () => {
    expect(
      json2csv(users, {
        fields: [
          { name: 'name', getValue: (item) => item.name },
          { name: 'id', getValue: (item) => item.id }
        ]
      })
    ).toEqual('name,id\r\nJoe,1\r\nSarah,2\r\n')
  })

  test('should use a custom order of fields, fields being a function', () => {
    expect(
      json2csv(users, {
        fields: () => [
          { name: 'name', getValue: (item) => item.name },
          { name: 'id', getValue: (item) => item.id }
        ]
      })
    ).toEqual('name,id\r\nJoe,1\r\nSarah,2\r\n')
  })

  test('should convert an empty field name', () => {
    expect(json2csv([{ '': 1 }, { '': 2 }, { '': 3 }])).toEqual('"[""""]"\r\n1\r\n2\r\n3\r\n')
  })

  test('should convert an array with arrays', () => {
    expect(
      json2csv(
        [
          [1, 2],
          [3, 4]
        ],
        { flatten: (item) => isObject(item) || Array.isArray(item) }
      )
    ).toEqual('0,1\r\n1,2\r\n3,4\r\n')
  })

  test('should convert a list with values instead of objects', () => {
    expect(json2csv([1, 2, 3])).toEqual('""\r\n1\r\n2\r\n3\r\n')
  })

  test('should flatten items with conflicting structures (mixed object and string)', () => {
    expect(json2csv([{ address: 'Amsterdam' }, { address: { city: 'Rotterdam' } }])).toEqual(
      'address\r\nAmsterdam\r\n"{""city"":""Rotterdam""}"\r\n'
    )

    expect(json2csv([{ address: { city: 'Rotterdam' } }, { address: 'Amsterdam' }])).toEqual(
      'address\r\n"{""city"":""Rotterdam""}"\r\nAmsterdam\r\n'
    )
  })

  test('should flatten items with conflicting structures (mixed null and an object)', () => {
    expect(
      json2csv([
        { id: 1, address: null },
        { id: 2, address: { city: 'Rotterdam' } }
      ])
    ).toEqual('id,address.city\r\n1,\r\n2,Rotterdam\r\n')

    expect(
      json2csv([
        { id: 1, address: { city: 'Rotterdam' } },
        { id: 2, address: null }
      ])
    ).toEqual('id,address.city\r\n1,Rotterdam\r\n2,\r\n')

    expect(
      json2csv([
        { id: 1, address: null },
        { id: 2, address: null }
      ])
    ).toEqual('id,address\r\n1,\r\n2,\r\n')
  })

  test('should flatten items with conflicting structures (array and object)', () => {
    expect(
      json2csv([
        { id: 1, address: { city: 'Rotterdam' } },
        { id: 2, address: [1, 2, 3] }
      ])
    ).toEqual('id,address\r\n1,"{""city"":""Rotterdam""}"\r\n2,"[1,2,3]"\r\n')

    expect(
      json2csv([
        { id: 1, address: [1, 2, 3] },
        { id: 2, address: { city: 'Rotterdam' } }
      ])
    ).toEqual('id,address\r\n1,"[1,2,3]"\r\n2,"{""city"":""Rotterdam""}"\r\n')
  })

  test('should flatten items with conflicting structures (null and string)', () => {
    expect(json2csv([{ name: null }, { name: 'Joe' }])).toEqual('name\r\n\r\nJoe\r\n')
    expect(json2csv([{ name: undefined }, { name: 'Joe' }])).toEqual('name\r\n\r\nJoe\r\n')
    expect(json2csv([{ name: 'Joe' }, { name: null }])).toEqual('name\r\nJoe\r\n\r\n')
    expect(json2csv([{ name: 'Joe' }, { name: undefined }])).toEqual('name\r\nJoe\r\n\r\n')
  })

  test('should flatten items being null', () => {
    expect(json2csv([{ id: 1, address: null }])).toEqual('id,address\r\n1,\r\n')
  })

  test('should escape control character "', () => {
    expect(json2csv([{ name: '"Big" Joe' }])).toEqual('name\r\n"""Big"" Joe"\r\n')
  })

  test('should escape control character ,', () => {
    expect(json2csv([{ name: 'Joe,Jones' }])).toEqual('name\r\n"Joe,Jones"\r\n')
  })

  test('should escape control character \\n', () => {
    expect(json2csv([{ name: 'Joe\nJones' }])).toEqual('name\r\n"Joe\nJones"\r\n')
  })

  test('should escape control character \\r', () => {
    expect(json2csv([{ name: 'Joe\rJones' }])).toEqual('name\r\n"Joe\rJones"\r\n')
  })

  test('should escape control character " in the header', () => {
    expect(json2csv([{ '"Big" Joe': 1 }])).toEqual('"""Big"" Joe"\r\n1\r\n')
  })

  test('should escape control character , in the header', () => {
    expect(json2csv([{ 'Joe,Jones': 1 }])).toEqual('"Joe,Jones"\r\n1\r\n')
  })

  test('should escape control character \\n in the header', () => {
    expect(json2csv([{ 'Joe\nJones': 1 }])).toEqual('"Joe\nJones"\r\n1\r\n')
  })

  test('should escape control character \\r in the header', () => {
    expect(json2csv([{ 'Joe\rJones': 1 }])).toEqual('"Joe\rJones"\r\n1\r\n')
  })

  test('should flatten nested fields if configured', () => {
    const json = [
      {
        name: 'Joe',
        details: {
          address: { city: 'Rotterdam' },
          location: [51.9280712, 4.4207888]
        }
      }
    ]

    const csvFlat =
      'name,details.address.city,details.location\r\n' +
      'Joe,Rotterdam,"[51.9280712,4.4207888]"\r\n'

    const csvNested =
      'name,details\r\n' +
      'Joe,"{""address"":{""city"":""Rotterdam""},""location"":[51.9280712,4.4207888]}"\r\n'

    expect(json2csv(json)).toEqual(csvFlat)
    expect(json2csv(json, { flatten: true })).toEqual(csvFlat)
    expect(json2csv(json, { flatten: false })).toEqual(csvNested)
  })

  test('should flatten nested arrays when configured', () => {
    const json = [
      {
        name: 'Joe',
        details: {
          address: { city: 'Rotterdam' },
          location: [51.9280712, 4.4207888]
        }
      }
    ]

    const csvFlatObjects =
      'name,details.address.city,details.location[0],details.location[1]\r\n' +
      'Joe,Rotterdam,51.9280712,4.4207888\r\n'

    // flatten objects but not arrays
    expect(json2csv(json, { flatten: isObjectOrArray })).toEqual(csvFlatObjects)
  })

  test('should flatten classes when configured', () => {
    class User {
      id: number
      name: string

      constructor(id: number, name: string) {
        this.id = id
        this.name = name
      }
    }

    function isUser(value: unknown): boolean {
      return (
        typeof value === 'object' &&
        value !== null &&
        // @ts-ignore
        typeof value.id === 'number' &&
        // @ts-ignore
        typeof value.name === 'string'
      )
    }

    const user1 = new User(1, 'Joe')
    const json = [
      {
        user: user1
      }
    ]

    expect(json2csv(json)).toEqual('user\r\n"{""id"":1,""name"":""Joe""}"\r\n')
    expect(json2csv(json, { flatten: (value) => isObject(value) || isUser(value) })).toEqual(
      'user.id,user.name\r\n1,Joe\r\n'
    )
  })

  test('should flatten nested fields containing the key separator', () => {
    expect(json2csv([{ nested: { 'field.name': 42 } }])).toEqual(
      '"nested[""field.name""]"\r\n42\r\n'
    )
  })

  test('should flatten nested fields containing the key separator and control characters', () => {
    expect(json2csv([{ nested: { 'field.,name': 42 } }])).toEqual(
      '"nested[""field.,name""]"\r\n42\r\n'
    )
  })

  test('should convert an empty array', () => {
    expect(json2csv([])).toEqual('\r\n')
  })

  test('should convert a Date', () => {
    // a date is simply stringified via JSON
    expect(
      json2csv([
        {
          date: new Date('2023-02-03T10:00:00.000Z')
        }
      ])
    ).toEqual('date\r\n"""2023-02-03T10:00:00.000Z"""\r\n')
  })

  test('should throw an error when passing an invalid delimiter', () => {
    expect(() => {
      json2csv([], { delimiter: 'foo' })
    }).toThrow('Invalid delimiter: must be a single character but is "foo"')
  })

  test('should throw an error when passing an invalid EOL', () => {
    expect(() => {
      // @ts-ignore
      json2csv([], { eol: 'foo' })
    }).toThrow('Invalid EOL character: choose "\\n" or "\\r\\n"')
  })
})

describe('spectrum-test-suite', () => {
  return new Promise((resolve, reject) => {
    spectrum(function (err: Error, data: Array<{ name: string; json: Buffer; csv: Buffer }>) {
      if (err) {
        reject(err)
      }

      data.forEach(({ name, json, csv }) => {
        test(name, () => {
          const parsedJson = JSON.parse(String(json))
          const csvString = String(csv).trim()
          const eol = name.includes('crlf') ? '\r\n' : '\n'
          expect(json2csv(parsedJson, { eol }).trim()).toEqual(csvString)
        })
      })

      resolve()
    })
  })
})
