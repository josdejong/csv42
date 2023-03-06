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

The `csv42` does no really well. It is faster than the CSV libraries that are popular right now, sometimes by a big margin. It is only outpaced in a few cases where the document is small, and we have a flat JSON document. The libraries `json2csv` and `papaparse` do very well too in many of the tests.

The biggest gaps can be seen when working with nested JSON data. Many libraries do not support flattening nested JSON data, and thus are not designed with this in mind. That may clarify the big differences. Also, some libraries do not support parsing CSV values into numbers for example. My real-world experience is that JSON data models more often than not contain nesting and numeric values, so I think these are essential features to have and test with if you want to mimic real-world situations as well as possible, and offer a batteries included API for a CSV library. But the needs can vary widely of course, hence the large amount of CSV libraries out there, each with a different approach.

## Results

These are the results run on a Windows 11 machine, Intel(R) Core(TM) i7-9750H CPU @ 4200 GHz, 16 GB RAM, Node.js v18.12.1, 2023-03-06.

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
_type,name,description,location.city,location.street,location.geo,speed,heading,size,"field with , delimiter","field with "" double quote"
item,Item 0,Item 0 description in text,Rotterdam,Main street,"[51.9280712,4.4207888]",5.4,128.3,"[3.4,5.1,0.9]","value with , delimiter","value with "" double quote"
item,Item 1,Item 1 description in text,Rotterdam,Main street,"[51.9280712,4.4207888]",5.4,128.3,"[3.4,5.1,0.9]","value with , delimiter","value with "" double quote"
item,Item 2,Item 2 description in text,Rotterdam,Main street,"[51.9280712,4.4207888]",5.4,128.3,"[3.4,5.1,0.9]","value with , delimiter","value with "" double quote"
...

VALIDATION

All CSV libraries are successfully validated

SECTION 1: FLAT JSON to CSV

benchmark flat json to csv (100 items, 29 KB)
1:csv42              x 5,645 ops/sec ±1.77% (81 runs sampled)
2:json2csv           x 7,684 ops/sec ±0.51% (79 runs sampled)
3:csv                x 3,893 ops/sec ±0.71% (84 runs sampled)
4:papaparse          x 5,791 ops/sec ±0.36% (83 runs sampled)
5:fast-csv           x 3,069 ops/sec ±0.62% (75 runs sampled)
6:json-2-csv         x 1,372 ops/sec ±0.23% (83 runs sampled)

benchmark flat json to csv (1000 items, 295 KB)
1:csv42              x 588 ops/sec ±0.28% (83 runs sampled)
2:json2csv           x 654 ops/sec ±0.68% (68 runs sampled)
3:csv                x 336 ops/sec ±3.44% (79 runs sampled)
4:papaparse          x 544 ops/sec ±0.49% (83 runs sampled)
5:fast-csv           x 318 ops/sec ±0.39% (83 runs sampled)
6:json-2-csv         x 138 ops/sec ±0.47% (69 runs sampled)

benchmark flat json to csv (10000 items, 3 MB)
1:csv42              x 54.48 ops/sec ±0.58% (82 runs sampled)
2:json2csv           x 36.36 ops/sec ±6.24% (57 runs sampled)
3:csv                x 27.08 ops/sec ±4.77% (64 runs sampled)
4:papaparse          x 31.10 ops/sec ±2.64% (67 runs sampled)
5:fast-csv           x 29.74 ops/sec ±2.20% (67 runs sampled)
6:json-2-csv         x 12.98 ops/sec ±0.71% (57 runs sampled)

benchmark flat json to csv (100000 items, 29 MB)
1:csv42              x 4.76 ops/sec ±2.94% (27 runs sampled)
2:json2csv           x 4.15 ops/sec ±6.25% (24 runs sampled)
3:csv                x 2.75 ops/sec ±5.52% (18 runs sampled)
4:papaparse          x 2.54 ops/sec ±5.67% (17 runs sampled)
5:fast-csv           x 2.80 ops/sec ±0.83% (18 runs sampled)
6:json-2-csv         x 1.26 ops/sec ±2.82% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark nested json to csv (100 items, 31 KB)
1:csv42              x 3,159 ops/sec ±1.67% (80 runs sampled)
2:json2csv (+flat)   x 1,734 ops/sec ±1.74% (79 runs sampled)
3:csv (+flat)        x 1,174 ops/sec ±12.82% (67 runs sampled)
4:papaparse (+flat)  x 1,847 ops/sec ±0.99% (80 runs sampled)
5:fast-csv (+flat)   x 1,269 ops/sec ±1.42% (82 runs sampled)
6:json-2-csv         x 972 ops/sec ±0.37% (84 runs sampled)

benchmark nested json to csv (1000 items, 313 KB)
1:csv42              x 326 ops/sec ±1.47% (84 runs sampled)
2:json2csv (+flat)   x 169 ops/sec ±0.53% (84 runs sampled)
3:csv (+flat)        x 142 ops/sec ±1.83% (79 runs sampled)
4:papaparse (+flat)  x 175 ops/sec ±0.42% (71 runs sampled)
5:fast-csv (+flat)   x 125 ops/sec ±3.12% (79 runs sampled)
6:json-2-csv         x 89.41 ops/sec ±1.77% (77 runs sampled)

benchmark nested json to csv (10000 items, 3 MB)
1:csv42              x 29.09 ops/sec ±2.60% (65 runs sampled)
2:json2csv (+flat)   x 14.01 ops/sec ±3.04% (66 runs sampled)
3:csv (+flat)        x 11.81 ops/sec ±3.66% (56 runs sampled)
4:papaparse (+flat)  x 11.49 ops/sec ±4.38% (53 runs sampled)
5:fast-csv (+flat)   x 11.11 ops/sec ±2.80% (53 runs sampled)
6:json-2-csv         x 8.38 ops/sec ±2.52% (42 runs sampled)

benchmark nested json to csv (100000 items, 31 MB)
1:csv42              x 2.79 ops/sec ±2.02% (18 runs sampled)
2:json2csv (+flat)   x 1.36 ops/sec ±4.79% (11 runs sampled)
3:csv (+flat)        x 1.14 ops/sec ±3.59% (10 runs sampled)
4:papaparse (+flat)  x 1.13 ops/sec ±3.29% (10 runs sampled)
5:fast-csv (+flat)   x 1.18 ops/sec ±3.35% (10 runs sampled)
6:json-2-csv         x 0.79 ops/sec ±6.64% (9 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark flat csv to json (100 rows, 15 KB)
1:csv42              x 2,432 ops/sec ±2.14% (77 runs sampled)
3:csv                x 308 ops/sec ±1.83% (76 runs sampled)
4:papaparse          x 1,891 ops/sec ±2.99% (70 runs sampled)
5:fast-csv           x 507 ops/sec ±2.77% (75 runs sampled)
6:json-2-csv         x 348 ops/sec ±21.83% (76 runs sampled)

benchmark flat csv to json (1000 rows, 147 KB)
1:csv42              x 236 ops/sec ±3.89% (72 runs sampled)
3:csv                x 41.75 ops/sec ±6.67% (64 runs sampled)
4:papaparse          x 212 ops/sec ±2.75% (69 runs sampled)
5:fast-csv           x 56.43 ops/sec ±1.41% (65 runs sampled)
6:json-2-csv         x 41.65 ops/sec ±1.82% (63 runs sampled)

benchmark flat csv to json (10000 rows, 1 MB)
1:csv42              x 24.10 ops/sec ±1.69% (56 runs sampled)
3:csv                x 3.98 ops/sec ±3.82% (23 runs sampled)
4:papaparse          x 20.62 ops/sec ±3.14% (49 runs sampled)
5:fast-csv           x 5.76 ops/sec ±2.30% (31 runs sampled)
6:json-2-csv         x 4.14 ops/sec ±2.06% (24 runs sampled)

benchmark flat csv to json (100000 rows, 15 MB)
1:csv42              x 2.27 ops/sec ±3.18% (15 runs sampled)
3:csv                x 0.37 ops/sec ±2.55% (6 runs sampled)
4:papaparse          x 2.10 ops/sec ±3.48% (15 runs sampled)
5:fast-csv           x 0.57 ops/sec ±2.75% (7 runs sampled)
6:json-2-csv         x 0.41 ops/sec ±0.88% (7 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark nested csv to json (100 rows, 17 KB)
1:csv42              x 1,604 ops/sec ±2.66% (72 runs sampled)
3:csv (+flat)        x 225 ops/sec ±4.28% (76 runs sampled)
4:papaparse (+flat)  x 552 ops/sec ±2.95% (73 runs sampled)
5:fast-csv (+flat)   x 306 ops/sec ±2.25% (73 runs sampled)
6:json-2-csv         x 342 ops/sec ±1.94% (74 runs sampled)

benchmark nested csv to json (1000 rows, 167 KB)
1:csv42              x 186 ops/sec ±3.52% (73 runs sampled)
3:csv (+flat)        x 32.60 ops/sec ±4.95% (73 runs sampled)
4:papaparse (+flat)  x 59.13 ops/sec ±3.14% (64 runs sampled)
5:fast-csv (+flat)   x 32.69 ops/sec ±2.46% (67 runs sampled)
6:json-2-csv         x 37.02 ops/sec ±2.62% (56 runs sampled)

benchmark nested csv to json (10000 rows, 2 MB)
1:csv42              x 16.48 ops/sec ±4.26% (47 runs sampled)
3:csv (+flat)        x 3.27 ops/sec ±3.73% (20 runs sampled)
4:papaparse (+flat)  x 5.93 ops/sec ±3.04% (32 runs sampled)
5:fast-csv (+flat)   x 3.33 ops/sec ±1.69% (20 runs sampled)
6:json-2-csv         x 3.71 ops/sec ±1.78% (22 runs sampled)

benchmark nested csv to json (100000 rows, 17 MB)
1:csv42              x 1.75 ops/sec ±2.44% (13 runs sampled)
3:csv (+flat)        x 0.31 ops/sec ±1.21% (6 runs sampled)
4:papaparse (+flat)  x 0.60 ops/sec ±3.25% (7 runs sampled)
5:fast-csv (+flat)   x 0.33 ops/sec ±2.66% (6 runs sampled)
6:json-2-csv         x 0.36 ops/sec ±1.80% (6 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬──────────────────────────────────────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ (index) │                         test                         │ 1:csv42              │ 2:json2csv (+flat)   │ 3:csv (+flat)        │ 4:papaparse (+flat)  │ 5:fast-csv (+flat)   │ 6:json-2-csv         │
├─────────┼──────────────────────────────────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│    0    │   'benchmark flat json to csv (100 items, 29 KB)'    │         564          │         768          │         389          │         579          │         307          │         137          │
│    1    │  'benchmark flat json to csv (1000 items, 295 KB)'   │         588          │         654          │         336          │         544          │         318          │         138          │
│    2    │   'benchmark flat json to csv (10000 items, 3 MB)'   │         545          │         364          │         271          │         311          │         297          │         130          │
│    3    │  'benchmark flat json to csv (100000 items, 29 MB)'  │         476          │         415          │         275          │         254          │         280          │         126          │
│    4    │  'benchmark nested json to csv (100 items, 31 KB)'   │         316          │         173          │         117          │         185          │         127          │        97.22         │
│    5    │ 'benchmark nested json to csv (1000 items, 313 KB)'  │         326          │         169          │         142          │         175          │         125          │        89.41         │
│    6    │  'benchmark nested json to csv (10000 items, 3 MB)'  │         291          │         140          │         118          │         115          │         111          │        83.77         │
│    7    │ 'benchmark nested json to csv (100000 items, 31 MB)' │         279          │         136          │         114          │         113          │         118          │        79.16         │
│    8    │    'benchmark flat csv to json (100 rows, 15 KB)'    │         243          │                      │        30.83         │         189          │        50.71         │        34.83         │
│    9    │   'benchmark flat csv to json (1000 rows, 147 KB)'   │         236          │                      │        41.75         │         212          │        56.43         │        41.65         │
│   10    │   'benchmark flat csv to json (10000 rows, 1 MB)'    │         241          │                      │        39.76         │         206          │        57.65         │        41.44         │
│   11    │  'benchmark flat csv to json (100000 rows, 15 MB)'   │         227          │                      │        37.36         │         210          │        56.69         │        40.93         │
│   12    │   'benchmark nested csv to json (100 rows, 17 KB)'   │         160          │                      │        22.53         │        55.24         │         30.6         │        34.17         │
│   13    │  'benchmark nested csv to json (1000 rows, 167 KB)'  │         186          │                      │         32.6         │        59.13         │        32.69         │        37.02         │
│   14    │  'benchmark nested csv to json (10000 rows, 2 MB)'   │         165          │                      │         32.7         │        59.26         │        33.29         │        37.15         │
│   15    │ 'benchmark nested csv to json (100000 rows, 17 MB)'  │         175          │                      │        31.14         │        59.79         │        32.79         │        35.71         │
└─────────┴──────────────────────────────────────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```
