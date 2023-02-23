# Benchmark

## Usage

1. Checkout the source code of the `csv42` project:
   ```
   git clone git@github.com:josdejong/csv42.git
   ```
2. Install the dependencies of the `csv42` library itself:
   ```
   npm run install
   ```
3. Move into the directory of the benchmark project:
   ```
   cd ./benchmark
   ```
4. Install the dependencies of the benchmark project once:
   ```
   npm run install
   ```
5. Run the benchmark:
   ```
   npm run benchmark
   ```

## Remarks

1. Doing benchmarks right is hard. Please let me know if you see a flaw in the benchmarks, or if you see ways to configure the libraries better, so we can see them shine.
2. The performance depends of course on what kind of data a single row contains and how much. This benchmark generates test data that contains a bit of everything: string, numbers, strings that need escaping. And in the case of nested data: a nested object and nested array.
3. Support for nested JSON data was an important goal when developing `csv42`. Not all libraries do support flattening nested JSON objects though. This is why the benchmark is tested with two different kinds of data: flat and nested. To make the libraries work with nested data, the data is flattened using the library `flat`. The use of `flat` is denoted with a `(+flat)` suffix in the name of the library. Note that flattening is only applied in the nested JSON benchmarks "nestedToCsv" and "nestedFromCsv", and NOT in the tests "flatToCsv" and "flatFromCsv". From what I've seen, the "flat" step adds something like 20% to the parsing/formatting duration: significant, but not the largest part of the work.
4. The CSV libraries have different defaults when parsing values. Some just leave all values a string, which is fastest. Others parse numeric values into a `number`. In these benchmarks, numeric values are being parsed into numbers, since that is what you mostly need in real-world.

## Conclusion

The `csv42` does no really well. It is faster than the CSV libraries that are popular right now, sometimes by a big margin. It is only outpaced in a few cases where the document is small, and we have a flat JSON document. The libraries `json2csv` and `papaparse` do very well too in many of the tests.

The biggest gaps can be seen when working with nested JSON data. Many libraries do not support flattening nested JSON data, and thus are not designed with this in mind. That may clarify the big differences. Also, some libraries do not support parsing CSV values into numbers for example. My real-world experience is that JSON data models more often than not contain nesting and numeric values, so I think these are essential features to have and test with if you want to mimic real-world situations as well as possible, and offer a batteries included API for a CSV library. But the needs can vary widely of course, hence the large amount of CSV libraries out there, each with a different approach.

## Results

These are the results run on a Windows 11 machine, Intel(R) Core(TM) i7-9750H CPU @ 4200 GHz, 16 GB RAM, Node.js v18.12.1, 2023-02-20.

```
PREVIEW

flat json preview:
[
  {"_type":"item","name":"Item 0","description":"Item 0 description in text","city":"Rotterdam","street":"Main street","latitude":51.9280712,"longitude":4.4207888,"speed":5.4,"heading":128.3,"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  {"_type":"item","name":"Item 1","description":"Item 1 description in text","city":"Rotterdam","street":"Main street","latitude":51.9280712,"longitude":4.4207888,"speed":5.4,"heading":128.3,"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  {"_type":"item","name":"Item 2","description":"Item 2 description in text","city":"Rotterdam","street":"Main street","latitude":51.9280712,"longitude":4.4207888,"speed":5.4,"heading":128.3,"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  ...
]

flat csv preview:
_type,name,description,city,street,latitude,longitude,speed,heading,"field with , delimiter","field with "" double quote"
item,Item 0,Item 0 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,"value with , delimiter","value with "" double quote"
item,Item 1,Item 1 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,"value with , delimiter","value with "" double quote"
item,Item 2,Item 2 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,"value with , delimiter","value with "" double quote"
...

nested json preview:
[
  {"_type":"item","name":"Item 0","description":"Item 0 description in text","location":{"city":"Rotterdam","street":"Main street","geo":[51.9280712,4.4207888]},"speed":5.4,"heading":128.3,"size":[3.4,5.1,0.9],"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  {"_type":"item","name":"Item 1","description":"Item 1 description in text","location":{"city":"Rotterdam","street":"Main street","geo":[51.9280712,4.4207888]},"speed":5.4,"heading":128.3,"size":[3.4,5.1,0.9],"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  {"_type":"item","name":"Item 2","description":"Item 2 description in text","location":{"city":"Rotterdam","street":"Main street","geo":[51.9280712,4.4207888]},"speed":5.4,"heading":128.3,"size":[3.4,5.1,0.9],"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  ...
]

nested csv preview:
_type,name,description,location.city,location.street,location.geo[0],location.geo[1],speed,heading,size[0],size[1],size[2],"field with , delimiter","field with "" double quote"
item,Item 0,Item 0 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 1,Item 1 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 2,Item 2 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
...

VALIDATION

All CSV libraries are successfully validated

SECTION 1: FLAT JSON to CSV

benchmark flat json to csv (100 items, 29 KB)
1:csv42              x 5,456 ops/sec ±2.54% (82 runs sampled)
2:json2csv           x 7,635 ops/sec ±0.74% (80 runs sampled)
3:csv                x 3,977 ops/sec ±0.93% (80 runs sampled)
4:papaparse          x 5,702 ops/sec ±0.58% (82 runs sampled)
5:fast-csv           x 2,975 ops/sec ±0.84% (79 runs sampled)
6:json-2-csv         x 1,366 ops/sec ±0.60% (80 runs sampled)

benchmark flat json to csv (1000 items, 295 KB)
1:csv42              x 561 ops/sec ±0.67% (82 runs sampled)
2:json2csv           x 641 ops/sec ±0.59% (75 runs sampled)
3:csv                x 353 ops/sec ±0.72% (82 runs sampled)
4:papaparse          x 524 ops/sec ±0.96% (81 runs sampled)
5:fast-csv           x 308 ops/sec ±0.73% (80 runs sampled)
6:json-2-csv         x 135 ops/sec ±0.85% (67 runs sampled)

benchmark flat json to csv (10000 items, 3 MB)
1:csv42              x 53.24 ops/sec ±1.94% (78 runs sampled)
2:json2csv           x 36.92 ops/sec ±5.46% (58 runs sampled)
3:csv                x 27.60 ops/sec ±3.87% (66 runs sampled)
4:papaparse          x 31.92 ops/sec ±2.68% (68 runs sampled)
5:fast-csv           x 30.38 ops/sec ±2.49% (67 runs sampled)
6:json-2-csv         x 13.40 ops/sec ±0.68% (58 runs sampled)

benchmark flat json to csv (100000 items, 29 MB)
1:csv42              x 4.49 ops/sec ±2.71% (25 runs sampled)
2:json2csv           x 4.08 ops/sec ±6.86% (24 runs sampled)
3:csv                x 2.71 ops/sec ±4.49% (17 runs sampled)
4:papaparse          x 2.49 ops/sec ±6.14% (16 runs sampled)
5:fast-csv           x 2.92 ops/sec ±3.08% (19 runs sampled)
6:json-2-csv         x 1.28 ops/sec ±1.57% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark nested json to csv (100 items, 31 KB)
1:csv42              x 3,220 ops/sec ±0.95% (82 runs sampled)
2:json2csv (+flat)   x 1,773 ops/sec ±2.24% (82 runs sampled)
3:csv (+flat)        x 1,482 ops/sec ±1.96% (82 runs sampled)
4:papaparse (+flat)  x 1,835 ops/sec ±1.80% (81 runs sampled)
5:fast-csv (+flat)   x 1,284 ops/sec ±1.33% (80 runs sampled)
6:json-2-csv         x 987 ops/sec ±0.61% (82 runs sampled)

benchmark nested json to csv (1000 items, 313 KB)
1:csv42              x 331 ops/sec ±1.21% (81 runs sampled)
2:json2csv (+flat)   x 158 ops/sec ±0.68% (73 runs sampled)
3:csv (+flat)        x 139 ops/sec ±1.96% (72 runs sampled)
4:papaparse (+flat)  x 167 ops/sec ±0.54% (83 runs sampled)
5:fast-csv (+flat)   x 130 ops/sec ±1.05% (81 runs sampled)
6:json-2-csv         x 93.76 ops/sec ±1.38% (69 runs sampled)

benchmark nested json to csv (10000 items, 3 MB)
1:csv42              x 30.78 ops/sec ±2.44% (67 runs sampled)
2:json2csv (+flat)   x 14.35 ops/sec ±2.81% (66 runs sampled)
3:csv (+flat)        x 12.48 ops/sec ±3.26% (57 runs sampled)
4:papaparse (+flat)  x 13.08 ops/sec ±3.32% (59 runs sampled)
5:fast-csv (+flat)   x 12.76 ops/sec ±1.11% (57 runs sampled)
6:json-2-csv         x 9.46 ops/sec ±1.66% (46 runs sampled)

benchmark nested json to csv (100000 items, 31 MB)
1:csv42              x 3.01 ops/sec ±1.35% (19 runs sampled)
2:json2csv (+flat)   x 1.40 ops/sec ±3.90% (11 runs sampled)
3:csv (+flat)        x 1.18 ops/sec ±3.35% (10 runs sampled)
4:papaparse (+flat)  x 1.18 ops/sec ±4.24% (10 runs sampled)
5:fast-csv (+flat)   x 1.24 ops/sec ±1.89% (11 runs sampled)
6:json-2-csv         x 0.94 ops/sec ±1.71% (9 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark flat csv to json (100 rows, 15 KB)
1:csv42              x 2,841 ops/sec ±0.66% (81 runs sampled)
3:csv                x 358 ops/sec ±0.97% (83 runs sampled)
4:papaparse          x 2,196 ops/sec ±2.08% (73 runs sampled)
5:fast-csv           x 586 ops/sec ±0.62% (81 runs sampled)
6:json-2-csv         x 409 ops/sec ±17.71% (82 runs sampled)

benchmark flat csv to json (1000 rows, 147 KB)
1:csv42              x 289 ops/sec ±0.77% (81 runs sampled)
3:csv                x 47.38 ops/sec ±7.35% (68 runs sampled)
4:papaparse          x 233 ops/sec ±1.92% (78 runs sampled)
5:fast-csv           x 59.22 ops/sec ±0.39% (68 runs sampled)
6:json-2-csv         x 45.57 ops/sec ±0.91% (68 runs sampled)

benchmark flat csv to json (10000 rows, 1 MB)
1:csv42              x 27.61 ops/sec ±0.63% (62 runs sampled)
3:csv                x 4.44 ops/sec ±3.49% (25 runs sampled)
4:papaparse          x 23.47 ops/sec ±2.41% (57 runs sampled)
5:fast-csv           x 5.98 ops/sec ±1.48% (32 runs sampled)
6:json-2-csv         x 4.44 ops/sec ±1.26% (25 runs sampled)

benchmark flat csv to json (100000 rows, 15 MB)
1:csv42              x 2.27 ops/sec ±2.55% (16 runs sampled)
3:csv                x 0.41 ops/sec ±0.87% (7 runs sampled)
4:papaparse          x 2.22 ops/sec ±3.66% (15 runs sampled)
5:fast-csv           x 0.59 ops/sec ±1.29% (7 runs sampled)
6:json-2-csv         x 0.43 ops/sec ±0.99% (7 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark nested csv to json (100 rows, 16 KB)
1:csv42              x 1,945 ops/sec ±0.74% (82 runs sampled)
3:csv (+flat)        x 247 ops/sec ±0.61% (83 runs sampled)
4:papaparse (+flat)  x 810 ops/sec ±1.81% (80 runs sampled)
5:fast-csv (+flat)   x 354 ops/sec ±0.79% (82 runs sampled)
6:json-2-csv         x 418 ops/sec ±0.48% (83 runs sampled)

benchmark nested csv to json (1000 rows, 159 KB)
1:csv42              x 193 ops/sec ±0.98% (78 runs sampled)
3:csv (+flat)        x 31.78 ops/sec ±4.39% (68 runs sampled)
4:papaparse (+flat)  x 82.85 ops/sec ±1.34% (68 runs sampled)
5:fast-csv (+flat)   x 37.38 ops/sec ±1.98% (83 runs sampled)
6:json-2-csv         x 41.64 ops/sec ±1.14% (63 runs sampled)

benchmark nested csv to json (10000 rows, 2 MB)
1:csv42              x 18.02 ops/sec ±1.56% (44 runs sampled)
3:csv (+flat)        x 3.00 ops/sec ±3.53% (19 runs sampled)
4:papaparse (+flat)  x 8.03 ops/sec ±2.20% (40 runs sampled)
5:fast-csv (+flat)   x 3.84 ops/sec ±1.05% (23 runs sampled)
6:json-2-csv         x 4.13 ops/sec ±1.02% (24 runs sampled)

benchmark nested csv to json (100000 rows, 16 MB)
1:csv42              x 1.75 ops/sec ±1.79% (13 runs sampled)
3:csv (+flat)        x 0.29 ops/sec ±0.82% (6 runs sampled)
4:papaparse (+flat)  x 0.76 ops/sec ±3.17% (8 runs sampled)
5:fast-csv (+flat)   x 0.38 ops/sec ±1.99% (6 runs sampled)
6:json-2-csv         x 0.41 ops/sec ±0.74% (7 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬───────────────────────────────────────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ (index) │                         test                          │ 1:csv42              │ 2:json2csv (+flat)   │ 3:csv (+flat)        │ 4:papaparse (+flat)  │ 5:fast-csv (+flat)   │ 6:json-2-csv         │
├─────────┼───────────────────────────────────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│    0    │    'benchmark flat json to csv (100 items, 29 KB)'    │         546          │         763          │         398          │         570          │         298          │         137          │
│    1    │   'benchmark flat json to csv (1000 items, 295 KB)'   │         561          │         641          │         353          │         524          │         308          │         135          │
│    2    │   'benchmark flat json to csv (10000 items, 3 MB)'    │         532          │         369          │         276          │         319          │         304          │         134          │
│    3    │  'benchmark flat json to csv (100000 items, 29 MB)'   │         449          │         408          │         271          │         249          │         292          │         128          │
│    4    │   'benchmark nested json to csv (100 items, 31 KB)'   │         322          │         177          │         148          │         184          │         128          │        98.67         │
│    5    │  'benchmark nested json to csv (1000 items, 313 KB)'  │         331          │         158          │         139          │         167          │         130          │        93.76         │
│    6    │  'benchmark nested json to csv (10000 items, 3 MB)'   │         308          │         144          │         125          │         131          │         128          │        94.55         │
│    7    │ 'benchmark nested json to csv (100000 items, 31 MB)'  │         301          │         140          │         118          │         118          │         124          │        94.14         │
│    8    │   'benchmark flat csv to json (100 rows, 15 KB)'      │         284          │                      │        35.82         │         220          │        58.62         │        40.89         │
│    9    │  'benchmark flat csv to json (1000 rows, 147 KB)'     │         289          │                      │        47.38         │         233          │        59.22         │        45.57         │
│   10    │   'benchmark flat csv to json (10000 rows, 1 MB)'     │         276          │                      │        44.37         │         235          │        59.76         │        44.44         │
│   11    │  'benchmark flat csv to json (100000 rows, 15 MB)'    │         227          │                      │        41.12         │         222          │        58.66         │        43.35         │
│   12    │  'benchmark nested csv to json (100 rows, 16 KB)'     │         195          │                      │        24.71         │        80.96         │        35.43         │         41.8         │
│   13    │ 'benchmark nested csv to json (1000 rows, 159 KB)'    │         193          │                      │        31.78         │        82.85         │        37.38         │        41.64         │
│   14    │  'benchmark nested csv to json (10000 rows, 2 MB)'    │         180          │                      │        29.96         │        80.31         │        38.44         │        41.35         │
│   15    │ 'benchmark nested csv to json (100000 rows, 16 MB)'   │         175          │                      │        28.65         │         76.2         │        37.95         │        40.96         │
└─────────┴───────────────────────────────────────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```
