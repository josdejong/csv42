import { CsvOptions, JsonOptions, NestedObject } from '../types'
import { getNestedFieldsFromCsv, getNestedFieldsFromJson } from '../fields'

interface TestCase {
  description: string
  json: NestedObject[]
  csv: string
  csvOptions?: CsvOptions
  jsonOptions?: JsonOptions
  parsedJson?: NestedObject[]
}

const users = [
  { id: 1, name: 'Joe' },
  { id: 2, name: 'Sarah' }
]

export const testCases: TestCase[] = [
  {
    description: 'all data types',
    json: [
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
    csv:
      'string,empty,number,true,false,object,array,null,undefined\r\n' +
      'hi,"",42,true,false,"{""key"":""value""}","[""item1""]",,\r\n'
  },
  {
    description: 'with header (default)',
    json: users,
    csv: 'id,name\r\n1,Joe\r\n2,Sarah\r\n'
  },
  {
    description: 'without header',
    json: users,
    csv: '1,Joe\r\n2,Sarah\r\n',
    parsedJson: [
      { 'Field 0': 1, 'Field 1': 'Joe' },
      { 'Field 0': 2, 'Field 1': 'Sarah' }
    ],
    csvOptions: { header: false },
    jsonOptions: { header: false }
  },
  {
    description: 'with custom delimiter',
    json: [{ a: 'containing;delimiter', b: 'text' }],
    csv: 'a;b\r\n"containing;delimiter";text\r\n',
    csvOptions: { delimiter: ';' },
    jsonOptions: { delimiter: ';' }
  },
  {
    description: 'with custom eol',
    json: users,
    csv: 'id,name\n1,Joe\n2,Sarah\n',
    csvOptions: { eol: '\n' }
  },
  {
    description: 'with custom fields',
    json: users,
    csv: 'name\r\nJoe\r\nSarah\r\n',
    parsedJson: users.map((user) => ({ name: user.name })),
    csvOptions: { fields: [{ name: 'name', getValue: (item) => item.name }] },
    jsonOptions: { fields: [{ name: 'name', setValue: (item, value) => (item.name = value) }] }
  },
  {
    description: 'with custom order of fields',
    json: users,
    csv: 'name,id\r\nJoe,1\r\nSarah,2\r\n',
    parsedJson: users.map((user) => ({ id: user.id })),
    csvOptions: {
      fields: [
        { name: 'name', getValue: (item) => item.name },
        { name: 'id', getValue: (item) => item.id }
      ]
    },
    jsonOptions: { fields: [{ name: 'id', setValue: (item, value) => (item.id = value) }] }
  },
  {
    description: 'with custom order of fields, fields being a function',
    json: users,
    csv: 'name,id\r\nJoe,1\r\nSarah,2\r\n',
    parsedJson: users.map((user) => ({ id: user.id })),
    csvOptions: {
      fields: [
        { name: 'name', getValue: (item) => item.name },
        { name: 'id', getValue: (item) => item.id }
      ]
    },
    jsonOptions: { fields: () => [{ name: 'id', setValue: (item, value) => (item.id = value) }] }
  },
  {
    description: 'escape control character "',
    json: [{ name: '"Big" Joe' }],
    csv: '"""Big"" Joe"\r\n',
    parsedJson: [{ 'Field 0': '"Big" Joe' }],
    csvOptions: { header: false },
    jsonOptions: { header: false }
  },
  {
    description: 'escape control character ,',
    json: [{ name: 'Joe,Jones' }],
    csv: '"Joe,Jones"\r\n',
    parsedJson: [{ 'Field 0': 'Joe,Jones' }],
    csvOptions: { header: false },
    jsonOptions: { header: false }
  },
  {
    description: 'escape control character \\n',
    json: [{ name: 'Joe\nJones' }],
    csv: '"Joe\nJones"\r\n',
    parsedJson: [{ 'Field 0': 'Joe\nJones' }],
    csvOptions: { header: false },
    jsonOptions: { header: false }
  },
  {
    description: 'escape control character \\r',
    json: [{ name: 'Joe\rJones' }],
    csv: '"Joe\rJones"\r\n',
    parsedJson: [{ 'Field 0': 'Joe\rJones' }],
    csvOptions: { header: false },
    jsonOptions: { header: false }
  },
  {
    description: 'escape control character " in the header',
    json: [{ '"Big" Joe': 1 }],
    csv: '"""Big"" Joe"\r\n1\r\n'
  },
  {
    description: 'escape control character , in the header',
    json: [{ 'Joe,Jones': 1 }],
    csv: '"Joe,Jones"\r\n1\r\n'
  },
  {
    description: 'escape control character \\n in the header',
    json: [{ 'Joe\nJones': 1 }],
    csv: '"Joe\nJones"\r\n1\r\n'
  },
  {
    description: 'escape control character \\r in the header',
    json: [{ 'Joe\rJones': 1 }],
    csv: '"Joe\rJones"\r\n1\r\n'
  },
  {
    description: 'flatten nested fields',
    json: [
      {
        name: 'Joe',
        details: {
          address: { city: 'Rotterdam' },
          location: [51.9280712, 4.4207888]
        }
      }
    ],
    csv:
      'name,details.address.city,details.location[0],details.location[1]\r\n' +
      'Joe,Rotterdam,51.9280712,4.4207888\r\n',
    csvOptions: {
      fields: getNestedFieldsFromJson
    },
    jsonOptions: {
      fields: getNestedFieldsFromCsv
    }
  },
  {
    description: 'flatten nested fields containing the key separator',
    json: [{ nested: { 'field.name': 42 } }],
    csv: '"nested[""field.name""]"\r\n42\r\n',
    csvOptions: {
      fields: getNestedFieldsFromJson
    },
    jsonOptions: {
      fields: getNestedFieldsFromCsv
    }
  },
  {
    description: 'flatten nested fields containing the key separator and control characters',
    json: [{ nested: { 'field.,name': 42 } }],
    csv: '"nested[""field.,name""]"\r\n42\r\n',
    csvOptions: {
      fields: getNestedFieldsFromJson
    },
    jsonOptions: {
      fields: getNestedFieldsFromCsv
    }
  },
  {
    description: 'no data',
    json: [],
    csv: '\r\n'
  }
]
