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
1:csv42              x 5,722 ops/sec ±1.89% (82 runs sampled)
2:json2csv           x 7,805 ops/sec ±0.64% (78 runs sampled)
3:csv                x 4,023 ops/sec ±0.66% (83 runs sampled)
4:papaparse          x 5,749 ops/sec ±0.41% (80 runs sampled)
5:fast-csv           x 3,141 ops/sec ±0.65% (74 runs sampled)
6:json-2-csv         x 1,313 ops/sec ±0.79% (81 runs sampled)

benchmark flat json to csv (1000 rows, 295 KB)
1:csv42              x 590 ops/sec ±0.63% (82 runs sampled)
2:json2csv           x 654 ops/sec ±0.43% (76 runs sampled)
3:csv                x 361 ops/sec ±0.34% (83 runs sampled)
4:papaparse          x 522 ops/sec ±1.13% (81 runs sampled)
5:fast-csv           x 325 ops/sec ±0.44% (83 runs sampled)
6:json-2-csv         x 139 ops/sec ±0.39% (70 runs sampled)

benchmark flat json to csv (10000 rows, 3 MB)
1:csv42              x 55.99 ops/sec ±0.40% (83 runs sampled)
2:json2csv           x 36.46 ops/sec ±6.51% (57 runs sampled)
3:csv                x 27.37 ops/sec ±4.58% (65 runs sampled)
4:papaparse          x 31.37 ops/sec ±2.86% (67 runs sampled)
5:fast-csv           x 30.29 ops/sec ±1.90% (67 runs sampled)
6:json-2-csv         x 13.00 ops/sec ±0.55% (57 runs sampled)

benchmark flat json to csv (100000 rows, 29 MB)
1:csv42              x 4.80 ops/sec ±2.04% (27 runs sampled)
2:json2csv           x 4.10 ops/sec ±6.94% (24 runs sampled)
3:csv                x 2.69 ops/sec ±5.74% (18 runs sampled)
4:papaparse          x 2.57 ops/sec ±3.69% (17 runs sampled)
5:fast-csv           x 2.90 ops/sec ±2.32% (18 runs sampled)
6:json-2-csv         x 1.26 ops/sec ±1.16% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark nested json to csv (100 rows, 31 KB)
1:csv42              x 3,228 ops/sec ±0.36% (82 runs sampled)
2:json2csv (+flat)   x 1,799 ops/sec ±0.32% (83 runs sampled)
3:csv (+flat)        x 1,469 ops/sec ±0.34% (83 runs sampled)
4:papaparse (+flat)  x 1,866 ops/sec ±2.05% (81 runs sampled)
5:fast-csv (+flat)   x 1,281 ops/sec ±1.79% (83 runs sampled)
6:json-2-csv         x 938 ops/sec ±1.13% (82 runs sampled)

benchmark nested json to csv (1000 rows, 313 KB)
1:csv42              x 333 ops/sec ±1.20% (83 runs sampled)
2:json2csv (+flat)   x 161 ops/sec ±1.57% (78 runs sampled)
3:csv (+flat)        x 141 ops/sec ±2.00% (77 runs sampled)
4:papaparse (+flat)  x 176 ops/sec ±0.31% (75 runs sampled)
5:fast-csv (+flat)   x 131 ops/sec ±0.50% (82 runs sampled)
6:json-2-csv         x 92.48 ops/sec ±1.59% (83 runs sampled)

benchmark nested json to csv (10000 rows, 3 MB)
1:csv42              x 31.89 ops/sec ±0.61% (68 runs sampled)
2:json2csv (+flat)   x 14.81 ops/sec ±2.56% (68 runs sampled)
3:csv (+flat)        x 12.44 ops/sec ±3.17% (56 runs sampled)
4:papaparse (+flat)  x 13.23 ops/sec ±3.25% (59 runs sampled)
5:fast-csv (+flat)   x 12.25 ops/sec ±1.96% (57 runs sampled)
6:json-2-csv         x 9.16 ops/sec ±0.54% (44 runs sampled)

benchmark nested json to csv (100000 rows, 31 MB)
1:csv42              x 2.94 ops/sec ±1.58% (19 runs sampled)
2:json2csv (+flat)   x 1.44 ops/sec ±4.14% (12 runs sampled)
3:csv (+flat)        x 1.14 ops/sec ±6.08% (10 runs sampled)
4:papaparse (+flat)  x 1.19 ops/sec ±4.24% (10 runs sampled)
5:fast-csv (+flat)   x 1.24 ops/sec ±2.01% (11 runs sampled)
6:json-2-csv         x 0.89 ops/sec ±2.15% (9 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark flat csv to json (100 rows, 15 KB)
1:csv42              x 2,731 ops/sec ±0.44% (82 runs sampled)
3:csv                x 360 ops/sec ±1.14% (83 runs sampled)
4:papaparse          x 2,176 ops/sec ±2.21% (78 runs sampled)
5:fast-csv           x 593 ops/sec ±0.74% (82 runs sampled)
6:json-2-csv         x 413 ops/sec ±17.82% (84 runs sampled)

benchmark flat csv to json (1000 rows, 147 KB)
1:csv42              x 275 ops/sec ±0.34% (82 runs sampled)
3:csv                x 49.92 ops/sec ±0.53% (68 runs sampled)
4:papaparse          x 237 ops/sec ±1.98% (80 runs sampled)
5:fast-csv           x 60.49 ops/sec ±1.57% (67 runs sampled)
6:json-2-csv         x 45.55 ops/sec ±0.87% (68 runs sampled)

benchmark flat csv to json (10000 rows, 1 MB)
1:csv42              x 26.68 ops/sec ±0.40% (58 runs sampled)
3:csv                x 4.49 ops/sec ±2.08% (26 runs sampled)
4:papaparse          x 22.90 ops/sec ±2.13% (56 runs sampled)
5:fast-csv           x 6.10 ops/sec ±1.91% (33 runs sampled)
6:json-2-csv         x 4.52 ops/sec ±0.80% (25 runs sampled)

benchmark flat csv to json (100000 rows, 15 MB)
1:csv42              x 2.48 ops/sec ±2.28% (16 runs sampled)
3:csv                x 0.42 ops/sec ±1.55% (7 runs sampled)
4:papaparse          x 2.25 ops/sec ±2.65% (15 runs sampled)
5:fast-csv           x 0.60 ops/sec ±1.15% (8 runs sampled)
6:json-2-csv         x 0.45 ops/sec ±0.95% (7 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark nested csv to json (100 rows, 16 KB)
1:csv42              x 1,856 ops/sec ±1.46% (82 runs sampled)
3:csv (+flat)        x 316 ops/sec ±0.36% (82 runs sampled)
4:papaparse (+flat)  x 819 ops/sec ±1.65% (82 runs sampled)
5:fast-csv (+flat)   x 380 ops/sec ±0.46% (83 runs sampled)
6:json-2-csv         x 421 ops/sec ±0.39% (84 runs sampled)

benchmark nested csv to json (1000 rows, 159 KB)
1:csv42              x 192 ops/sec ±0.64% (76 runs sampled)
3:csv (+flat)        x 32.62 ops/sec ±0.72% (68 runs sampled)
4:papaparse (+flat)  x 82.80 ops/sec ±0.44% (68 runs sampled)
5:fast-csv (+flat)   x 36.97 ops/sec ±0.73% (83 runs sampled)
6:json-2-csv         x 42.24 ops/sec ±0.78% (66 runs sampled)

benchmark nested csv to json (10000 rows, 2 MB)
1:csv42              x 18.19 ops/sec ±1.19% (48 runs sampled)
3:csv (+flat)        x 3.10 ops/sec ±3.72% (20 runs sampled)
4:papaparse (+flat)  x 8.07 ops/sec ±2.48% (41 runs sampled)
5:fast-csv (+flat)   x 3.76 ops/sec ±0.35% (22 runs sampled)
6:json-2-csv         x 4.19 ops/sec ±0.62% (24 runs sampled)

benchmark nested csv to json (100000 rows, 16 MB)
1:csv42              x 1.72 ops/sec ±2.42% (13 runs sampled)
3:csv (+flat)        x 0.30 ops/sec ±2.21% (6 runs sampled)
4:papaparse (+flat)  x 0.79 ops/sec ±3.13% (8 runs sampled)
5:fast-csv (+flat)   x 0.37 ops/sec ±2.04% (6 runs sampled)
6:json-2-csv         x 0.41 ops/sec ±1.19% (7 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬──────────────────────┬──────────────────────┬─────────┬────────────────────┬───────────────┬─────────────────────┬────────────────────┬──────────────┐
│ (index) │      benchmark       │         data         │ 1:csv42 │ 2:json2csv (+flat) │ 3:csv (+flat) │ 4:papaparse (+flat) │ 5:fast-csv (+flat) │ 6:json-2-csv │
├─────────┼──────────────────────┼──────────────────────┼─────────┼────────────────────┼───────────────┼─────────────────────┼────────────────────┼──────────────┤
│    0    │  'flat json to csv'  │  '100 rows, 29 KB'   │   572   │        781         │      402      │         575         │        314         │     131      │
│    1    │  'flat json to csv'  │ '1000 rows, 295 KB'  │   590   │        654         │      361      │         522         │        325         │     139      │
│    2    │  'flat json to csv'  │  '10000 rows, 3 MB'  │   560   │        365         │      274      │         314         │        303         │     130      │
│    3    │  'flat json to csv'  │ '100000 rows, 29 MB' │   480   │        410         │      269      │         257         │        290         │     126      │
│    4    │ 'nested json to csv' │  '100 rows, 31 KB'   │   323   │        180         │      147      │         187         │        128         │    93.76     │
│    5    │ 'nested json to csv' │ '1000 rows, 313 KB'  │   333   │        161         │      141      │         176         │        131         │    92.48     │
│    6    │ 'nested json to csv' │  '10000 rows, 3 MB'  │   319   │        148         │      124      │         132         │        123         │    91.62     │
│    7    │ 'nested json to csv' │ '100000 rows, 31 MB' │   294   │        144         │      114      │         119         │        124         │    89.05     │
│    8    │  'flat csv to json'  │  '100 rows, 15 KB'   │   273   │                    │     36.03     │         218         │        59.3        │    41.34     │
│    9    │  'flat csv to json'  │ '1000 rows, 147 KB'  │   275   │                    │     49.92     │         237         │       60.49        │    45.55     │
│   10    │  'flat csv to json'  │  '10000 rows, 1 MB'  │   267   │                    │     44.95     │         229         │       61.03        │    45.21     │
│   11    │  'flat csv to json'  │ '100000 rows, 15 MB' │   248   │                    │     41.81     │         225         │        60.3        │     44.6     │
│   12    │ 'nested csv to json' │  '100 rows, 16 KB'   │   186   │                    │     31.57     │        81.92        │       37.98        │    42.11     │
│   13    │ 'nested csv to json' │ '1000 rows, 159 KB'  │   192   │                    │     32.62     │        82.8         │       36.97        │    42.24     │
│   14    │ 'nested csv to json' │  '10000 rows, 2 MB'  │   182   │                    │     31.04     │        80.69        │       37.59        │    41.89     │
│   15    │ 'nested csv to json' │ '100000 rows, 16 MB' │   172   │                    │     29.57     │        78.89        │       37.03        │    41.17     │
└─────────┴──────────────────────┴──────────────────────┴─────────┴────────────────────┴───────────────┴─────────────────────┴────────────────────┴──────────────┘

RESULTS TABLE CSV (1000x ROWS/SEC, HIGHER IS BETTER)

benchmark,data,1:csv42,2:json2csv (+flat),3:csv (+flat),4:papaparse (+flat),5:fast-csv (+flat),6:json-2-csv
flat json to csv,"100 rows, 29 KB",572,781,402,575,314,131
flat json to csv,"1000 rows, 295 KB",590,654,361,522,325,139
flat json to csv,"10000 rows, 3 MB",560,365,274,314,303,130
flat json to csv,"100000 rows, 29 MB",480,410,269,257,290,126
nested json to csv,"100 rows, 31 KB",323,180,147,187,128,93.76
nested json to csv,"1000 rows, 313 KB",333,161,141,176,131,92.48
nested json to csv,"10000 rows, 3 MB",319,148,124,132,123,91.62
nested json to csv,"100000 rows, 31 MB",294,144,114,119,124,89.05
flat csv to json,"100 rows, 15 KB",273,,36.03,218,59.3,41.34
flat csv to json,"1000 rows, 147 KB",275,,49.92,237,60.49,45.55
flat csv to json,"10000 rows, 1 MB",267,,44.95,229,61.03,45.21
flat csv to json,"100000 rows, 15 MB",248,,41.81,225,60.3,44.6
nested csv to json,"100 rows, 16 KB",186,,31.57,81.92,37.98,42.11
nested csv to json,"1000 rows, 159 KB",192,,32.62,82.8,36.97,42.24
nested csv to json,"10000 rows, 2 MB",182,,31.04,80.69,37.59,41.89
nested csv to json,"100000 rows, 16 MB",172,,29.57,78.89,37.03,41.17
```
