# Benchmark

## Usage

1. Checkout the source code of the `csv42` project:
   ```
   git clone https://github.com/josdejong/csv42.git
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

The `csv42` does do really well. It is faster than the CSV libraries that are popular right now, sometimes by a big margin. It is only outpaced in a few cases where the document is small, and we have a flat JSON document. The libraries `json2csv` and `papaparse` do very well too in many of the tests, though when converting JSON to CSV, they are slower for larger documents.

The biggest gaps can be seen when working with nested JSON data. Many libraries do not support flattening nested JSON data, and thus are not designed with this in mind. That may clarify the big differences. Also, some libraries do not support parsing CSV values into numbers for example. My real-world experience is that JSON data models more often than not contain nesting and numeric values, so I think these are essential features to have and test with if you want to mimic real-world situations as well as possible, and offer a batteries included API for a CSV library. But the needs can vary widely of course, hence the large amount of CSV libraries out there, each with a different approach.

## Results

These are the results run on a Windows 11 machine, Intel(R) Core(TM) i7-9750H CPU @ 4200 GHz, 16 GB RAM, Node.js v18.12.1, 2023-03-07.

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

benchmark flat json to csv (100 rows, 29 KB)
1:csv42              x 5,251 ops/sec ±1.98% (81 runs sampled)
2:json2csv           x 7,798 ops/sec ±0.52% (76 runs sampled)
3:csv                x 3,905 ops/sec ±0.77% (81 runs sampled)
4:papaparse          x 5,774 ops/sec ±0.64% (82 runs sampled)
5:fast-csv           x 3,037 ops/sec ±0.82% (78 runs sampled)
6:json-2-csv         x 1,374 ops/sec ±0.26% (83 runs sampled)

benchmark flat json to csv (1000 rows, 295 KB)
1:csv42              x 546 ops/sec ±0.34% (84 runs sampled)
2:json2csv           x 658 ops/sec ±0.29% (83 runs sampled)
3:csv                x 356 ops/sec ±0.35% (84 runs sampled)
4:papaparse          x 544 ops/sec ±0.36% (83 runs sampled)
5:fast-csv           x 320 ops/sec ±0.29% (84 runs sampled)
6:json-2-csv         x 140 ops/sec ±0.35% (72 runs sampled)

benchmark flat json to csv (10000 rows, 3 MB)
1:csv42              x 52.07 ops/sec ±0.39% (70 runs sampled)
2:json2csv           x 37.33 ops/sec ±5.94% (58 runs sampled)
3:csv                x 28.04 ops/sec ±4.30% (66 runs sampled)
4:papaparse          x 31.60 ops/sec ±2.81% (68 runs sampled)
5:fast-csv           x 30.20 ops/sec ±2.04% (67 runs sampled)
6:json-2-csv         x 13.40 ops/sec ±0.60% (58 runs sampled)

benchmark flat json to csv (100000 rows, 29 MB)
1:csv42              x 4.56 ops/sec ±2.21% (26 runs sampled)
2:json2csv           x 4.16 ops/sec ±5.32% (24 runs sampled)
3:csv                x 2.70 ops/sec ±6.31% (18 runs sampled)
4:papaparse          x 2.56 ops/sec ±5.45% (17 runs sampled)
5:fast-csv           x 2.94 ops/sec ±0.88% (19 runs sampled)
6:json-2-csv         x 1.28 ops/sec ±1.95% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark nested json to csv (100 rows, 31 KB)
1:csv42              x 3,088 ops/sec ±0.28% (82 runs sampled)
2:json2csv (+flat)   x 1,826 ops/sec ±0.34% (82 runs sampled)
3:csv (+flat)        x 1,522 ops/sec ±0.30% (83 runs sampled)
4:papaparse (+flat)  x 1,893 ops/sec ±0.27% (84 runs sampled)
5:fast-csv (+flat)   x 1,279 ops/sec ±0.30% (84 runs sampled)
6:json-2-csv         x 956 ops/sec ±0.34% (82 runs sampled)

benchmark nested json to csv (1000 rows, 313 KB)
1:csv42              x 314 ops/sec ±0.31% (83 runs sampled)
2:json2csv (+flat)   x 160 ops/sec ±0.39% (76 runs sampled)
3:csv (+flat)        x 140 ops/sec ±2.47% (75 runs sampled)
4:papaparse (+flat)  x 175 ops/sec ±0.38% (75 runs sampled)
5:fast-csv (+flat)   x 126 ops/sec ±1.94% (81 runs sampled)
6:json-2-csv         x 95.81 ops/sec ±0.56% (84 runs sampled)

benchmark nested json to csv (10000 rows, 3 MB)
1:csv42              x 29.59 ops/sec ±1.70% (67 runs sampled)
2:json2csv (+flat)   x 14.75 ops/sec ±2.85% (68 runs sampled)
3:csv (+flat)        x 12.41 ops/sec ±3.32% (56 runs sampled)
4:papaparse (+flat)  x 13.43 ops/sec ±2.82% (60 runs sampled)
5:fast-csv (+flat)   x 12.28 ops/sec ±2.26% (57 runs sampled)
6:json-2-csv         x 9.16 ops/sec ±1.69% (44 runs sampled)

benchmark nested json to csv (100000 rows, 31 MB)
1:csv42              x 2.83 ops/sec ±2.29% (19 runs sampled)
2:json2csv (+flat)   x 1.43 ops/sec ±5.38% (12 runs sampled)
3:csv (+flat)        x 1.19 ops/sec ±4.41% (10 runs sampled)
4:papaparse (+flat)  x 1.18 ops/sec ±6.65% (10 runs sampled)
5:fast-csv (+flat)   x 1.21 ops/sec ±0.51% (10 runs sampled)
6:json-2-csv         x 0.91 ops/sec ±2.18% (9 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark flat csv to json (100 rows, 15 KB)
1:csv42              x 2,462 ops/sec ±0.41% (81 runs sampled)
3:csv                x 362 ops/sec ±0.81% (84 runs sampled)
4:papaparse          x 2,234 ops/sec ±0.74% (82 runs sampled)
5:fast-csv           x 608 ops/sec ±0.31% (83 runs sampled)
6:json-2-csv         x 407 ops/sec ±17.72% (84 runs sampled)

benchmark flat csv to json (1000 rows, 147 KB)
1:csv42              x 276 ops/sec ±0.26% (82 runs sampled)
3:csv                x 35.33 ops/sec ±0.65% (77 runs sampled)
4:papaparse          x 245 ops/sec ±2.02% (82 runs sampled)
5:fast-csv           x 60.80 ops/sec ±3.44% (68 runs sampled)
6:json-2-csv         x 45.69 ops/sec ±0.77% (68 runs sampled)

benchmark flat csv to json (10000 rows, 1 MB)
1:csv42              x 26.42 ops/sec ±0.36% (57 runs sampled)
3:csv                x 4.45 ops/sec ±3.02% (26 runs sampled)
4:papaparse          x 23.61 ops/sec ±2.48% (57 runs sampled)
5:fast-csv           x 6.09 ops/sec ±1.45% (33 runs sampled)
6:json-2-csv         x 4.51 ops/sec ±0.82% (25 runs sampled)

benchmark flat csv to json (100000 rows, 15 MB)
1:csv42              x 2.49 ops/sec ±1.62% (17 runs sampled)
3:csv                x 0.43 ops/sec ±1.99% (7 runs sampled)
4:papaparse          x 2.29 ops/sec ±3.60% (16 runs sampled)
5:fast-csv           x 0.60 ops/sec ±2.35% (7 runs sampled)
6:json-2-csv         x 0.44 ops/sec ±0.92% (7 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark nested csv to json (100 rows, 16 KB)
1:csv42              x 1,894 ops/sec ±1.75% (82 runs sampled)
3:csv (+flat)        x 247 ops/sec ±0.29% (84 runs sampled)
4:papaparse (+flat)  x 774 ops/sec ±1.68% (82 runs sampled)
5:fast-csv (+flat)   x 369 ops/sec ±0.57% (82 runs sampled)
6:json-2-csv         x 422 ops/sec ±0.28% (84 runs sampled)

benchmark nested csv to json (1000 rows, 159 KB)
1:csv42              x 193 ops/sec ±0.44% (73 runs sampled)
3:csv (+flat)        x 30.95 ops/sec ±4.38% (68 runs sampled)
4:papaparse (+flat)  x 79.32 ops/sec ±0.34% (68 runs sampled)
5:fast-csv (+flat)   x 36.49 ops/sec ±1.92% (83 runs sampled)
6:json-2-csv         x 42.36 ops/sec ±0.69% (67 runs sampled)

benchmark nested csv to json (10000 rows, 2 MB)
1:csv42              x 17.84 ops/sec ±2.19% (45 runs sampled)
3:csv (+flat)        x 2.99 ops/sec ±3.70% (19 runs sampled)
4:papaparse (+flat)  x 7.82 ops/sec ±1.07% (40 runs sampled)
5:fast-csv (+flat)   x 3.65 ops/sec ±1.64% (22 runs sampled)
6:json-2-csv         x 4.17 ops/sec ±0.76% (24 runs sampled)

benchmark nested csv to json (100000 rows, 16 MB)
1:csv42              x 1.75 ops/sec ±1.65% (13 runs sampled)
3:csv (+flat)        x 0.29 ops/sec ±2.19% (6 runs sampled)
4:papaparse (+flat)  x 0.76 ops/sec ±2.91% (8 runs sampled)
5:fast-csv (+flat)   x 0.37 ops/sec ±1.55% (6 runs sampled)
6:json-2-csv         x 0.41 ops/sec ±0.35% (7 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬──────────────────────┬──────────────────────┬─────────┬────────────────────┬───────────────┬─────────────────────┬────────────────────┬──────────────┐
│ (index) │      benchmark       │         data         │ 1:csv42 │ 2:json2csv (+flat) │ 3:csv (+flat) │ 4:papaparse (+flat) │ 5:fast-csv (+flat) │ 6:json-2-csv │
├─────────┼──────────────────────┼──────────────────────┼─────────┼────────────────────┼───────────────┼─────────────────────┼────────────────────┼──────────────┤
│    0    │  'flat json to csv'  │  '100 rows, 29 KB'   │   525   │        780         │      391      │         577         │        304         │     137      │
│    1    │  'flat json to csv'  │ '1000 rows, 295 KB'  │   546   │        658         │      356      │         544         │        320         │     140      │
│    2    │  'flat json to csv'  │  '10000 rows, 3 MB'  │   521   │        373         │      280      │         316         │        302         │     134      │
│    3    │  'flat json to csv'  │ '100000 rows, 29 MB' │   456   │        416         │      270      │         256         │        294         │     128      │
│    4    │ 'nested json to csv' │  '100 rows, 31 KB'   │   309   │        183         │      152      │         189         │        128         │    95.64     │
│    5    │ 'nested json to csv' │ '1000 rows, 313 KB'  │   314   │        160         │      140      │         175         │        126         │    95.81     │
│    6    │ 'nested json to csv' │  '10000 rows, 3 MB'  │   296   │        148         │      124      │         134         │        123         │     91.6     │
│    7    │ 'nested json to csv' │ '100000 rows, 31 MB' │   283   │        143         │      119      │         118         │        121         │    90.95     │
│    8    │  'flat csv to json'  │  '100 rows, 15 KB'   │   246   │                    │     36.24     │         223         │       60.76        │    40.65     │
│    9    │  'flat csv to json'  │ '1000 rows, 147 KB'  │   276   │                    │     35.33     │         245         │        60.8        │    45.69     │
│   10    │  'flat csv to json'  │  '10000 rows, 1 MB'  │   264   │                    │     44.48     │         236         │       60.87        │    45.09     │
│   11    │  'flat csv to json'  │ '100000 rows, 15 MB' │   249   │                    │     42.68     │         229         │       60.27        │    44.31     │
│   12    │ 'nested csv to json' │  '100 rows, 16 KB'   │   189   │                    │     24.68     │        77.35        │       36.87        │    42.19     │
│   13    │ 'nested csv to json' │ '1000 rows, 159 KB'  │   193   │                    │     30.95     │        79.32        │       36.49        │    42.36     │
│   14    │ 'nested csv to json' │  '10000 rows, 2 MB'  │   178   │                    │     29.9      │        78.24        │        36.5        │    41.68     │
│   15    │ 'nested csv to json' │ '100000 rows, 16 MB' │   175   │                    │     28.58     │        75.63        │       36.55        │    41.14     │
└─────────┴──────────────────────┴──────────────────────┴─────────┴────────────────────┴───────────────┴─────────────────────┴────────────────────┴──────────────┘

RESULTS TABLE CSV (1000x ROWS/SEC, HIGHER IS BETTER)

benchmark,data,1:csv42,2:json2csv (+flat),3:csv (+flat),4:papaparse (+flat),5:fast-csv (+flat),6:json-2-csv
flat json to csv,"100 rows, 29 KB",525,780,391,577,304,137
flat json to csv,"1000 rows, 295 KB",546,658,356,544,320,140
flat json to csv,"10000 rows, 3 MB",521,373,280,316,302,134
flat json to csv,"100000 rows, 29 MB",456,416,270,256,294,128
nested json to csv,"100 rows, 31 KB",309,183,152,189,128,95.64
nested json to csv,"1000 rows, 313 KB",314,160,140,175,126,95.81
nested json to csv,"10000 rows, 3 MB",296,148,124,134,123,91.6
nested json to csv,"100000 rows, 31 MB",283,143,119,118,121,90.95
flat csv to json,"100 rows, 15 KB",246,,36.24,223,60.76,40.65
flat csv to json,"1000 rows, 147 KB",276,,35.33,245,60.8,45.69
flat csv to json,"10000 rows, 1 MB",264,,44.48,236,60.87,45.09
flat csv to json,"100000 rows, 15 MB",249,,42.68,229,60.27,44.31
nested csv to json,"100 rows, 16 KB",189,,24.68,77.35,36.87,42.19
nested csv to json,"1000 rows, 159 KB",193,,30.95,79.32,36.49,42.36
nested csv to json,"10000 rows, 2 MB",178,,29.9,78.24,36.5,41.68
nested csv to json,"100000 rows, 16 MB",175,,28.58,75.63,36.55,41.14
```
