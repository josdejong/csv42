# csv7

Convert **CSV to JSON** and **JSON to CSV**

## Features

- **2 way**: convert from and to CSV
- **Simple**: straightforward and flexible API
- **Lightweight**: <2KB gzipped when including all bells and whistles, <1KB gzipped when only using `json2csv`
- **Fast**
- **Modular**: only load what you use, thanks to ES5 modules and a plugin architecture
- **Powerful**:
  - Configurable properties: `header`, `delimiter`, `eol`
  - Configurable `fields`, with custom value getters and setters and the ability to ignore fields
  - Configurable serialization and deserialization of values via `formatValue` and `parseValue`
  - Support for nested JSON objects: either flatten nested contents, or stringify as a JSON object
- **Standards compliant**: adheres to the CSV standard [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180)
- **Universal**: Created for the browser, but can be used in any JavaScript environment like node.js. 

Note that the parser has no streaming support.

## Why?

Well, you have to write a CSV parser at least once in you life, right? ;)

The `csv7` library was developed specifically for https://jsoneditoronline.org. The library was developed to be small, fast, convert from and to CSV, and support nested JSON objects.

## Usage

Install the library once:

### Install

```
npm install csv7
```

### Basic usage

Convert JSON to CSV. Note that all options are optional.

```ts
import { json2csv } from 'csv7'

const users = [
  { id: 1, name: 'Joe' },
  { id: 2, name: 'Sarah' }
]

const csv = json2csv(users, { header: true, delimiter: ',', eol: '\n' })
console.log(csv)
// id,name
// 1,Joe
// 2,Sarah
```

Convert CSV to JSON:

```ts
import { csv2json } from 'csv7'

const csv = `id,name
1,Joe
2,Sarah` 

const users = csv2json(csv, { header: true, delimiter: ',' })
console.log(users)
// [
//   { id: 1, name: 'Joe' },
//   { id: 2, name: 'Sarah' }
// ]
```

### Nested JSON Objects

```ts
import { json2csv, getNestedFieldsFromJson } from 'csv7'

const users = [
  { id: 1, name: 'Joe', address: { city: 'New York', street: '1st Ave' } },
  { id: 2, name: 'Sarah', address: { city: 'Manhattan', street: 'Spring street' } }
]

// By default, nested JSON is serialized as an escaped JSON file:
const csvNested = json2csv(users)
console.log(csvNested)
// id,name,address
// 1,Joe,"{""city"":""New York"",""street"":""1st Ave""}"
// 2,Sarah,"{""city"":""Manhattan"",""street"":""Spring street""}"

// Nested fields can be flattened using getNestedFieldsFromJson:
const csvFlat = json2csv(users, { 
  fields: getNestedFieldsFromJson 
})
console.log(csvFlat)
// id,name,address.city,address.street
// 1,Joe,New York,1st Ave
// 2,Sarah,Manhattan,Spring street
```

The other way around:

```ts
import { csv2json, getNestedFieldsFromCsv } from 'csv7'

const csv = `id,name,address.city,address.street
1,Joe,New York,1st Ave
2,Sarah,Manhattan,Spring street`

// By default, fields will be parsed as is, into flat JSON objects
const usersFlat = csv2json(csv)
console.log(usersFlat)
// [
//   { id: 1, name: 'Joe', 'address.city': 'New York', 'address.street': '1st Ave' },
//   { id: 2, name: 'Sarah', 'address.city': 'Manhattan', 'address.street': 'Spring street' }
// ]

// Use getNestedFieldsFromCsv to parse the CSV into nested JSON objects
const usersNested = csv2json(csv, {
  fields: getNestedFieldsFromCsv
})
console.log(usersNested)
// [
//   { id: 1, name: 'Joe', address: { city: 'New York', street: '1st Ave' } },
//   { id: 2, name: 'Sarah', address: { city: 'Manhattan', street: 'Spring street' } }
// ]
```



## API

### `json2csv(json: NestedObject[], options: CsvOptions) : string`

Where `options` is an object with the following properties:

| Option        | Type                              | Description                                                                                                                                                                                                                                                               |
|---------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `header`      | `boolean`                         | If true, a header will be created as first line of the CSV.                                                                                                                                                                                                               |
| `delimiter`   | `string`                          | Default delimiter is `,`. A delimiter must be a single character.                                                                                                                                                                                                         |
| `eol`         | `\r\n` or `\n`                    | End of line, can be `\r\n` (default) or `\n`.                                                                                                                                                                                                                             |
| `fields`      | `CsvField[]` or `CsvFieldsParser` | A list with fields to be put into the CSV file. This allows specifying the order of the fields and which fields to include/exclued. There are two field parsers included: `getFieldsFromJson` and `getNestedFieldsFromJson`. The latter will flatten nested JSON objects. |
| `formatValue` | `ValueFormatter`                  | Function used to change any type of value into a serialized string for the CSV. The build in formatter will only enclose values in quotes when necessary, and will stringify nested JSON objects.                                                                         |

A simple example of a `ValueFormatter` is the following. This formatter will enclose every value in quotes:

```ts
function formatValue(value: unknown) : string {
  return '"' + String(value) + '"'
}
```


### `csv2json(csv: string, options: JsonOptions) : NestedObject[]`

Where `options` is an object with the following properties: 

| Option       | Type                                | Description                                                                                                                                                                                                                                                                                                 |
|--------------|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `header`     | `boolean`                           | Should be set `true` when the first line of the CSV file contains a header                                                                                                                                                                                                                                  |
| `delimiter`  | `string`                            | Default delimiter is `,`. A delimiter must be a single character.                                                                                                                                                                                                                                           |
| `fields`     | `JsonField[]` or `JsonFieldsParser` | A list with fields to be extracted from the CSV file into JSON. This allows specifying which fields are include/exclued, and how they will be put into the JSON object. There are two field parsers included: `getFieldsFromCsv` and `getNestedFieldsFromCsv`. The latter will flatten nested JSON objects. |
| `parseValue` | `ValueParser`                       | Used to parse a stringified value into a value again (number, boolean, string, ...). The build in parser will parse numbers and booleans, and will parse stringified JSON objects.                                                                                                                          |

A simple value parser can look as follows. This will keep all values as string: 

```ts
function parseValue(value: string) : unknown {
  return value.startsWith('"')
    ? value.substring(1, value.length - 1).replaceAll('""', '"')
    : value
}
```

## Alternatives

- https://www.npmjs.com/package/csv
- https://juanjodiaz.github.io/json2csv/
- https://www.npmjs.com/package/json-2-csv
- https://www.npmjs.com/package/papaparse
- https://www.npmjs.com/package/csvtojson
- https://www.npmjs.com/package/csv-stringify
- https://www.npmjs.com/package/csv-parser
- https://www.npmjs.com/package/fast-csv
- Any many many more...

## License

`csv7` is released as open source under the permissive the [ISC license](LICENSE.md).

**If you are using `csv7` commercially, there is a _social_ (but no legal) expectation that you help fund its maintenance. [Start here](https://github.com/sponsors/josdejong).**
