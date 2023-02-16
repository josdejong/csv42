# csv42

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

The `csv42` library was developed specifically for https://jsoneditoronline.org. The library was developed for the browser. Besides being small and fast, one important feature is supporting nested JSON objects. So, why the name `csv42`? Just because [42](https://simple.wikipedia.org/wiki/42_(answer)) is a beautiful number and reminds us that there is a whole universe of beautiful CSV libraries out there.

## Install

```
npm install csv42
```

## Usage

Install the library once:

### Convert JSON to CSV

```ts
import { json2csv } from 'csv42'

const users = [
  { id: 1, name: 'Joe', address: { city: 'New York', street: '1st Ave' } },
  { id: 2, name: 'Sarah', address: { city: 'Manhattan', street: 'Spring street' } }
]

// By default, nested JSON properties are flattened
const csv = json2csv(users)
console.log(csv)
// id,name,address.city,address.street
// 1,Joe,New York,1st Ave
// 2,Sarah,Manhattan,Spring street

// You can turn off flattening using the option `flatten`
const csvFlat = json2csv(users, { flatten: false })
console.log(csvFlat)
// id,name,address
// 1,Joe,"{""city"":""New York"",""street"":""1st Ave""}"
// 2,Sarah,"{""city"":""Manhattan"",""street"":""Spring street""}"

// The CSV output can be fully customized and transformed using `fields`:
const csvCustom = json2csv(users, {
  fields: [
    { name: 'name', getValue: (object) => object.name },
    { name: 'address', getValue: (object) => object.address.city + ' - ' + object.address.street }
  ]
})
console.log(csvCustom)
// name,address
// Joe,New York - 1st Ave
// Sarah,Manhattan - Spring street
```

### Convert CSV to JSON

```ts
import { csv2json } from 'csv42'

const csv = `id,name,address.city,address.street
1,Joe,New York,1st Ave
2,Sarah,Manhattan,Spring street`

// By default, fields containing a dot will be parsed inty nested JSON objects
const users = csv2json(csv)
console.log(users)
// [
//   { id: 1, name: 'Joe', address: { city: 'New York', street: '1st Ave' } },
//   { id: 2, name: 'Sarah', address: { city: 'Manhattan', street: 'Spring street' } }
// ]

// Creating nested objects can be turned off using the option `nested`
const usersFlat = csv2json(csv, { nested: false })
console.log(usersFlat)
// [
//   { id: 1, name: 'Joe', 'address.city': 'New York', 'address.street': '1st Ave' },
//   { id: 2, name: 'Sarah', 'address.city': 'Manhattan', 'address.street': 'Spring street' }
// ]

// The JSON output can be customized using `fields`
const usersCustom = csv2json(csv, {
  fields: [
    {name : 'name', setValue: (object, value) => object.name = value },
    {name : 'address.city', setValue: (object, value) => object.city = value }
  ]
})
console.log(usersCustom)
// [
//   { name: 'Joe', city: 'New York' },
//   { name: 'Sarah', city: 'Manhattan' }
// ]
```


## API

### `json2csv(json: NestedObject[], options?: CsvOptions) : string`

Where `options` is an object with the following properties:

| Option        | Type                              | Description                                                                                                                                                                                                                                                               |
|---------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `header`      | `boolean`                         | If true, a header will be created as first line of the CSV.                                                                                                                                                                                                               |
| `delimiter`   | `string`                          | Default delimiter is `,`. A delimiter must be a single character.                                                                                                                                                                                                         |
| `eol`         | `\r\n` or `\n`                    | End of line, can be `\r\n` (default) or `\n`.                                                                                                                                                                                                                             |
| `flatten`     | `boolean`                         | If true (default), nested object properties will be flattened in multiple CSV columns.                                                                                                                                                                                    |
| `fields`      | `CsvField[]` or `CsvFieldsParser` | A list with fields to be put into the CSV file. This allows specifying the order of the fields and which fields to include/exclued. There are two field parsers included: `getFieldsFromJson` and `getNestedFieldsFromJson`. The latter will flatten nested JSON objects. |
| `formatValue` | `ValueFormatter`                  | Function used to change any type of value into a serialized string for the CSV. The build in formatter will only enclose values in quotes when necessary, and will stringify nested JSON objects.                                                                         |

A simple example of a `ValueFormatter` is the following. This formatter will enclose every value in quotes:

```ts
function formatValue(value: unknown) : string {
  return '"' + String(value) + '"'
}
```


### `csv2json(csv: string, options?: JsonOptions) : NestedObject[]`

Where `options` is an object with the following properties: 

| Option       | Type                                | Description                                                                                                                                                                                                                                                                                                 |
|--------------|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `header`     | `boolean`                           | Should be set `true` when the first line of the CSV file contains a header                                                                                                                                                                                                                                  |
| `delimiter`  | `string`                            | Default delimiter is `,`. A delimiter must be a single character.                                                                                                                                                                                                                                           |
| `nested`     | `boolean`                           | If true (default), field names containing a dot will be parsed into nested JSON objects.                                                                                                                                                                                                                    |
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

### Utility functions

The library exports a number of utility functions:

| Function                                                                | Description                                                                                                                                                                  |
|-------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `createFormatValue(delimiter: string): (value: unknown) => string`      | Create a function that can format (stringify) a value into a valid CSV value, escaping the value when needed. This function is used as default for the option `formatValue`. |
| `parseValue(value: string): unknown`                                    | Parse a string into a value, parse numbers into a number, etc. This is the function used by default for the option `parseValue`.                                             |
| `collectNestedPaths(records: NestedObject[], recurse: boolean): Path[]` | Loop over the data and collect all nested paths. This can be used to generate a list with fields.                                                                            |
| `parsePath(pathStr: string): Path`                                      | Parse a path like `'items[3].name'`                                                                                                                                          |
| `function stringifyPath(path: Path): string`                            | Stringify a path into a string like `'items[3].name'`                                                                                                                        |
| `getIn(object: NestedObject, path: Path): unknown`                      | Get a nested property from an object                                                                                                                                         |
| `setIn(object: NestedObject, path: Path, value: unknown): NestedObject` | Set a nested property in an object                                                                                                                                           |

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

`csv42` is released as open source under the permissive the [ISC license](LICENSE.md).

**If you are using `csv42` commercially, there is a _social_ (but no legal) expectation that you help fund its maintenance. [Start here](https://github.com/sponsors/josdejong).**
