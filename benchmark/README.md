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

benchmark flat json to csv (100 items, 29 KB)
1:csv42              x 5,278 ops/sec ±1.70% (81 runs sampled)
2:json2csv           x 7,758 ops/sec ±0.49% (79 runs sampled)
3:csv                x 4,013 ops/sec ±0.81% (79 runs sampled)
4:papaparse          x 5,756 ops/sec ±0.30% (82 runs sampled)
5:fast-csv           x 3,131 ops/sec ±0.53% (77 runs sampled)
6:json-2-csv         x 1,352 ops/sec ±0.31% (82 runs sampled)

benchmark flat json to csv (1000 items, 295 KB)
1:csv42              x 548 ops/sec ±0.36% (83 runs sampled)
2:json2csv           x 660 ops/sec ±0.49% (83 runs sampled)
3:csv                x 359 ops/sec ±0.39% (83 runs sampled)
4:papaparse          x 529 ops/sec ±0.55% (82 runs sampled)
5:fast-csv           x 325 ops/sec ±0.35% (84 runs sampled)
6:json-2-csv         x 135 ops/sec ±0.38% (84 runs sampled)

benchmark flat json to csv (10000 items, 3 MB)
1:csv42              x 52.48 ops/sec ±0.35% (73 runs sampled)
2:json2csv           x 37.28 ops/sec ±5.89% (57 runs sampled)
3:csv                x 27.27 ops/sec ±4.17% (64 runs sampled)
4:papaparse          x 32.29 ops/sec ±3.05% (68 runs sampled)
5:fast-csv           x 29.66 ops/sec ±2.01% (67 runs sampled)
6:json-2-csv         x 13.37 ops/sec ±0.62% (57 runs sampled)

benchmark flat json to csv (100000 items, 29 MB)
1:csv42              x 4.56 ops/sec ±1.50% (26 runs sampled)
2:json2csv           x 3.99 ops/sec ±8.61% (23 runs sampled)
3:csv                x 2.68 ops/sec ±4.20% (17 runs sampled)
4:papaparse          x 2.57 ops/sec ±3.24% (17 runs sampled)
5:fast-csv           x 2.91 ops/sec ±2.26% (18 runs sampled)
6:json-2-csv         x 1.29 ops/sec ±1.43% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark nested json to csv (100 items, 31 KB)
1:csv42              x 3,067 ops/sec ±0.29% (83 runs sampled)
2:json2csv (+flat)   x 1,790 ops/sec ±2.02% (82 runs sampled)
3:csv (+flat)        x 1,505 ops/sec ±2.07% (81 runs sampled)
4:papaparse (+flat)  x 1,869 ops/sec ±2.04% (83 runs sampled)
5:fast-csv (+flat)   x 1,256 ops/sec ±1.21% (81 runs sampled)
6:json-2-csv         x 966 ops/sec ±0.28% (83 runs sampled)

benchmark nested json to csv (1000 items, 313 KB)
1:csv42              x 315 ops/sec ±1.03% (82 runs sampled)
2:json2csv (+flat)   x 161 ops/sec ±1.68% (79 runs sampled)
3:csv (+flat)        x 141 ops/sec ±1.87% (78 runs sampled)
4:papaparse (+flat)  x 176 ops/sec ±0.30% (84 runs sampled)
5:fast-csv (+flat)   x 127 ops/sec ±1.85% (81 runs sampled)
6:json-2-csv         x 81.06 ops/sec ±2.58% (68 runs sampled)

benchmark nested json to csv (10000 items, 3 MB)
1:csv42              x 29.24 ops/sec ±2.17% (67 runs sampled)
2:json2csv (+flat)   x 14.42 ops/sec ±2.82% (67 runs sampled)
3:csv (+flat)        x 12.48 ops/sec ±3.40% (56 runs sampled)
4:papaparse (+flat)  x 12.84 ops/sec ±5.17% (58 runs sampled)
5:fast-csv (+flat)   x 10.61 ops/sec ±4.16% (52 runs sampled)
6:json-2-csv         x 8.07 ops/sec ±2.92% (41 runs sampled)

benchmark nested json to csv (100000 items, 31 MB)
1:csv42              x 2.56 ops/sec ±2.18% (17 runs sampled)
2:json2csv (+flat)   x 1.23 ops/sec ±6.01% (11 runs sampled)
3:csv (+flat)        x 1.08 ops/sec ±5.76% (10 runs sampled)
4:papaparse (+flat)  x 1.13 ops/sec ±6.47% (10 runs sampled)
5:fast-csv (+flat)   x 1.15 ops/sec ±3.33% (10 runs sampled)
6:json-2-csv         x 0.87 ops/sec ±2.33% (9 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark flat csv to json (100 rows, 15 KB)
1:csv42              x 2,623 ops/sec ±1.78% (79 runs sampled)
3:csv                x 356 ops/sec ±1.12% (82 runs sampled)
4:papaparse          x 2,185 ops/sec ±1.31% (77 runs sampled)
5:fast-csv           x 566 ops/sec ±1.15% (80 runs sampled)
6:json-2-csv         x 401 ops/sec ±18.39% (82 runs sampled)

benchmark flat csv to json (1000 rows, 147 KB)
1:csv42              x 267 ops/sec ±0.94% (78 runs sampled)
3:csv                x 34.51 ops/sec ±0.96% (72 runs sampled)
4:papaparse          x 230 ops/sec ±2.74% (76 runs sampled)
5:fast-csv           x 57.72 ops/sec ±2.13% (66 runs sampled)
6:json-2-csv         x 44.60 ops/sec ±1.14% (67 runs sampled)

benchmark flat csv to json (10000 rows, 1 MB)
1:csv42              x 25.98 ops/sec ±0.71% (57 runs sampled)
3:csv                x 4.25 ops/sec ±2.71% (25 runs sampled)
4:papaparse          x 22.52 ops/sec ±3.02% (55 runs sampled)
5:fast-csv           x 5.90 ops/sec ±1.10% (32 runs sampled)
6:json-2-csv         x 4.40 ops/sec ±1.20% (25 runs sampled)

benchmark flat csv to json (100000 rows, 15 MB)
1:csv42              x 2.41 ops/sec ±2.49% (16 runs sampled)
3:csv                x 0.40 ops/sec ±0.91% (7 runs sampled)
4:papaparse          x 2.23 ops/sec ±3.96% (15 runs sampled)
5:fast-csv           x 0.58 ops/sec ±3.58% (7 runs sampled)
6:json-2-csv         x 0.45 ops/sec ±0.98% (7 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark nested csv to json (100 rows, 16 KB)
1:csv42              x 1,874 ops/sec ±1.62% (82 runs sampled)
3:csv (+flat)        x 251 ops/sec ±0.90% (84 runs sampled)
4:papaparse (+flat)  x 790 ops/sec ±1.87% (81 runs sampled)
5:fast-csv (+flat)   x 384 ops/sec ±0.42% (82 runs sampled)
6:json-2-csv         x 415 ops/sec ±3.43% (84 runs sampled)

benchmark nested csv to json (1000 rows, 159 KB)
1:csv42              x 192 ops/sec ±0.55% (83 runs sampled)
3:csv (+flat)        x 32.07 ops/sec ±4.19% (68 runs sampled)
4:papaparse (+flat)  x 82.65 ops/sec ±0.29% (68 runs sampled)
5:fast-csv (+flat)   x 37.21 ops/sec ±2.23% (83 runs sampled)
6:json-2-csv         x 42.11 ops/sec ±0.85% (66 runs sampled)

benchmark nested csv to json (10000 rows, 2 MB)
1:csv42              x 17.91 ops/sec ±2.22% (46 runs sampled)
3:csv (+flat)        x 3.11 ops/sec ±2.72% (19 runs sampled)
4:papaparse (+flat)  x 8.09 ops/sec ±1.11% (40 runs sampled)
5:fast-csv (+flat)   x 3.77 ops/sec ±1.79% (22 runs sampled)
6:json-2-csv         x 4.17 ops/sec ±0.61% (24 runs sampled)

benchmark nested csv to json (100000 rows, 16 MB)
1:csv42              x 1.74 ops/sec ±2.01% (13 runs sampled)
3:csv (+flat)        x 0.29 ops/sec ±4.48% (6 runs sampled)
4:papaparse (+flat)  x 0.78 ops/sec ±3.42% (8 runs sampled)
5:fast-csv (+flat)   x 0.38 ops/sec ±0.84% (6 runs sampled)
6:json-2-csv         x 0.42 ops/sec ±1.13% (7 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬──────────────────────────────────────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ (index) │                         test                         │ 1:csv42              │ 2:json2csv (+flat)   │ 3:csv (+flat)        │ 4:papaparse (+flat)  │ 5:fast-csv (+flat)   │ 6:json-2-csv         │
├─────────┼──────────────────────────────────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│    0    │   'benchmark flat json to csv (100 items, 29 KB)'    │         528          │         776          │         401          │         576          │         313          │         135          │
│    1    │  'benchmark flat json to csv (1000 items, 295 KB)'   │         548          │         660          │         359          │         529          │         325          │         135          │
│    2    │   'benchmark flat json to csv (10000 items, 3 MB)'   │         525          │         373          │         273          │         323          │         297          │         134          │
│    3    │  'benchmark flat json to csv (100000 items, 29 MB)'  │         456          │         399          │         268          │         257          │         291          │         129          │
│    4    │  'benchmark nested json to csv (100 items, 31 KB)'   │         307          │         179          │         151          │         187          │         126          │        96.55         │
│    5    │ 'benchmark nested json to csv (1000 items, 313 KB)'  │         315          │         161          │         141          │         176          │         127          │        81.06         │
│    6    │  'benchmark nested json to csv (10000 items, 3 MB)'  │         292          │         144          │         125          │         128          │         106          │         80.7         │
│    7    │ 'benchmark nested json to csv (100000 items, 31 MB)' │         256          │         123          │         108          │         113          │         115          │        86.73         │
│    8    │    'benchmark flat csv to json (100 rows, 15 KB)'    │         262          │                      │        35.64         │         219          │        56.65         │        40.08         │
│    9    │   'benchmark flat csv to json (1000 rows, 147 KB)'   │         267          │                      │        34.51         │         230          │        57.72         │         44.6         │
│   10    │   'benchmark flat csv to json (10000 rows, 1 MB)'    │         260          │                      │        42.54         │         225          │        58.99         │        44.01         │
│   11    │  'benchmark flat csv to json (100000 rows, 15 MB)'   │         241          │                      │        40.28         │         223          │        58.37         │        44.97         │
│   12    │  'benchmark nested csv to json (100 rows, 16 KB)'    │         187          │                      │        25.09         │        78.99         │        38.36         │         41.5         │
│   13    │ 'benchmark nested csv to json (1000 rows, 159 KB)'   │         192          │                      │        32.07         │        82.65         │        37.21         │        42.11         │
│   14    │  'benchmark nested csv to json (10000 rows, 2 MB)'   │         179          │                      │        31.08         │        80.91         │        37.69         │        41.75         │
│   15    │ 'benchmark nested csv to json (100000 rows, 16 MB)'  │         174          │                      │        29.16         │        78.11         │        38.07         │        41.54         │
└─────────┴──────────────────────────────────────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```
