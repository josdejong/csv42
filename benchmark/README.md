# Benchmark

## Usage

1. Checkout the source code of the `csv42` project:
   ```
   git clone https://github.com/josdejong/csv42.git
   ```
2. Install the dependencies of the `csv42` library itself and build the library:
   ```
   npm run install
   npm run build-and-test
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
1:csv42              x 6,519 ops/sec ±0.38% (81 runs sampled)
2:json2csv           x 7,509 ops/sec ±0.93% (79 runs sampled)
3:csv                x 3,977 ops/sec ±0.72% (81 runs sampled)
4:papaparse          x 5,560 ops/sec ±0.51% (82 runs sampled)
5:fast-csv           x 2,973 ops/sec ±1.19% (78 runs sampled)
6:json-2-csv         x 1,350 ops/sec ±0.44% (83 runs sampled)

benchmark flat json to csv (1000 rows, 295 KB)
1:csv42              x 680 ops/sec ±0.33% (84 runs sampled)
2:json2csv           x 637 ops/sec ±0.72% (80 runs sampled)
3:csv                x 359 ops/sec ±0.46% (84 runs sampled)
4:papaparse          x 532 ops/sec ±0.35% (83 runs sampled)
5:fast-csv           x 312 ops/sec ±1.09% (82 runs sampled)
6:json-2-csv         x 138 ops/sec ±0.42% (71 runs sampled)

benchmark flat json to csv (10000 rows, 3 MB)
1:csv42              x 58.83 ops/sec ±0.91% (67 runs sampled)
2:json2csv           x 35.48 ops/sec ±6.50% (57 runs sampled)
3:csv                x 27.72 ops/sec ±4.34% (65 runs sampled)
4:papaparse          x 32.00 ops/sec ±3.08% (68 runs sampled)
5:fast-csv           x 29.30 ops/sec ±1.96% (68 runs sampled)
6:json-2-csv         x 13.27 ops/sec ±0.53% (57 runs sampled)

benchmark flat json to csv (100000 rows, 29 MB)
1:csv42              x 5.40 ops/sec ±2.38% (30 runs sampled)
2:json2csv           x 3.97 ops/sec ±7.44% (24 runs sampled)
3:csv                x 2.71 ops/sec ±5.64% (17 runs sampled)
4:papaparse          x 2.54 ops/sec ±4.96% (17 runs sampled)
5:fast-csv           x 2.89 ops/sec ±0.64% (18 runs sampled)
6:json-2-csv         x 1.28 ops/sec ±1.32% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark nested json to csv (100 rows, 31 KB)
1:csv42              x 3,185 ops/sec ±1.67% (80 runs sampled)
2:json2csv (+flat)   x 1,825 ops/sec ±0.42% (82 runs sampled)
3:csv (+flat)        x 1,500 ops/sec ±1.86% (81 runs sampled)
4:papaparse (+flat)  x 1,860 ops/sec ±1.79% (81 runs sampled)
5:fast-csv (+flat)   x 1,265 ops/sec ±1.23% (83 runs sampled)
6:json-2-csv         x 956 ops/sec ±0.42% (83 runs sampled)

benchmark nested json to csv (1000 rows, 313 KB)
1:csv42              x 333 ops/sec ±1.15% (83 runs sampled)
2:json2csv (+flat)   x 167 ops/sec ±1.61% (83 runs sampled)
3:csv (+flat)        x 139 ops/sec ±2.17% (73 runs sampled)
4:papaparse (+flat)  x 171 ops/sec ±1.49% (83 runs sampled)
5:fast-csv (+flat)   x 120 ops/sec ±2.30% (76 runs sampled)
6:json-2-csv         x 90.45 ops/sec ±1.79% (79 runs sampled)

benchmark nested json to csv (10000 rows, 3 MB)
1:csv42              x 31.55 ops/sec ±0.78% (68 runs sampled)
2:json2csv (+flat)   x 14.91 ops/sec ±2.47% (69 runs sampled)
3:csv (+flat)        x 12.41 ops/sec ±3.25% (56 runs sampled)
4:papaparse (+flat)  x 13.02 ops/sec ±3.11% (59 runs sampled)
5:fast-csv (+flat)   x 11.97 ops/sec ±2.25% (57 runs sampled)
6:json-2-csv         x 9.19 ops/sec ±0.53% (44 runs sampled)

benchmark nested json to csv (100000 rows, 31 MB)
1:csv42              x 2.97 ops/sec ±2.01% (19 runs sampled)
2:json2csv (+flat)   x 1.37 ops/sec ±6.96% (11 runs sampled)
3:csv (+flat)        x 1.18 ops/sec ±6.05% (10 runs sampled)
4:papaparse (+flat)  x 1.18 ops/sec ±3.70% (10 runs sampled)
5:fast-csv (+flat)   x 1.22 ops/sec ±1.52% (11 runs sampled)
6:json-2-csv         x 0.90 ops/sec ±1.87% (9 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark flat csv to json (100 rows, 15 KB)
1:csv42              x 2,897 ops/sec ±0.33% (81 runs sampled)
3:csv                x 364 ops/sec ±0.88% (84 runs sampled)
4:papaparse          x 2,094 ops/sec ±2.11% (82 runs sampled)
5:fast-csv           x 540 ops/sec ±2.00% (82 runs sampled)
6:json-2-csv         x 402 ops/sec ±17.82% (83 runs sampled)

benchmark flat csv to json (1000 rows, 147 KB)
1:csv42              x 337 ops/sec ±0.31% (83 runs sampled)
3:csv                x 50.28 ops/sec ±0.47% (68 runs sampled)
4:papaparse          x 235 ops/sec ±2.74% (80 runs sampled)
5:fast-csv           x 55.98 ops/sec ±2.45% (83 runs sampled)
6:json-2-csv         x 45.72 ops/sec ±0.75% (68 runs sampled)

benchmark flat csv to json (10000 rows, 1 MB)
1:csv42              x 31.90 ops/sec ±1.64% (68 runs sampled)
3:csv                x 4.38 ops/sec ±4.31% (25 runs sampled)
4:papaparse          x 23.28 ops/sec ±2.53% (57 runs sampled)
5:fast-csv           x 5.62 ops/sec ±2.41% (30 runs sampled)
6:json-2-csv         x 4.49 ops/sec ±1.30% (26 runs sampled)

benchmark flat csv to json (100000 rows, 15 MB)
1:csv42              x 2.95 ops/sec ±2.78% (19 runs sampled)
3:csv                x 0.42 ops/sec ±1.00% (7 runs sampled)
4:papaparse          x 2.31 ops/sec ±3.11% (16 runs sampled)
5:fast-csv           x 0.55 ops/sec ±1.88% (7 runs sampled)
6:json-2-csv         x 0.44 ops/sec ±1.25% (7 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark nested csv to json (100 rows, 16 KB)
1:csv42              x 1,914 ops/sec ±1.74% (83 runs sampled)
3:csv (+flat)        x 309 ops/sec ±0.42% (84 runs sampled)
4:papaparse (+flat)  x 735 ops/sec ±0.43% (83 runs sampled)
5:fast-csv (+flat)   x 333 ops/sec ±2.57% (82 runs sampled)
6:json-2-csv         x 407 ops/sec ±0.58% (83 runs sampled)

benchmark nested csv to json (1000 rows, 159 KB)
1:csv42              x 219 ops/sec ±1.58% (82 runs sampled)
3:csv (+flat)        x 30.96 ops/sec ±3.77% (68 runs sampled)
4:papaparse (+flat)  x 75.46 ops/sec ±1.72% (83 runs sampled)
5:fast-csv (+flat)   x 35.37 ops/sec ±2.13% (77 runs sampled)
6:json-2-csv         x 41.25 ops/sec ±1.02% (63 runs sampled)

benchmark nested csv to json (10000 rows, 2 MB)
1:csv42              x 20.12 ops/sec ±1.29% (49 runs sampled)
3:csv (+flat)        x 2.97 ops/sec ±2.66% (19 runs sampled)
4:papaparse (+flat)  x 7.59 ops/sec ±1.97% (39 runs sampled)
5:fast-csv (+flat)   x 3.48 ops/sec ±2.74% (21 runs sampled)
6:json-2-csv         x 4.13 ops/sec ±1.30% (24 runs sampled)

benchmark nested csv to json (100000 rows, 16 MB)
1:csv42              x 1.96 ops/sec ±4.07% (14 runs sampled)
3:csv (+flat)        x 0.29 ops/sec ±3.23% (6 runs sampled)
4:papaparse (+flat)  x 0.75 ops/sec ±3.02% (8 runs sampled)
5:fast-csv (+flat)   x 0.37 ops/sec ±1.41% (6 runs sampled)
6:json-2-csv         x 0.41 ops/sec ±0.69% (7 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬──────────────────────┬──────────────────────┬─────────┬────────────────────┬───────────────┬─────────────────────┬────────────────────┬──────────────┐
│ (index) │      benchmark       │         data         │ 1:csv42 │ 2:json2csv (+flat) │ 3:csv (+flat) │ 4:papaparse (+flat) │ 5:fast-csv (+flat) │ 6:json-2-csv │
├─────────┼──────────────────────┼──────────────────────┼─────────┼────────────────────┼───────────────┼─────────────────────┼────────────────────┼──────────────┤
│    0    │  'flat json to csv'  │  '100 rows, 29 KB'   │   652   │        751         │      398      │         556         │        297         │     135      │
│    1    │  'flat json to csv'  │ '1000 rows, 295 KB'  │   680   │        637         │      359      │         532         │        312         │     138      │
│    2    │  'flat json to csv'  │  '10000 rows, 3 MB'  │   588   │        355         │      277      │         320         │        293         │     133      │
│    3    │  'flat json to csv'  │ '100000 rows, 29 MB' │   540   │        397         │      271      │         254         │        289         │     128      │
│    4    │ 'nested json to csv' │  '100 rows, 31 KB'   │   319   │        183         │      150      │         186         │        126         │    95.58     │
│    5    │ 'nested json to csv' │ '1000 rows, 313 KB'  │   333   │        167         │      139      │         171         │        120         │    90.45     │
│    6    │ 'nested json to csv' │  '10000 rows, 3 MB'  │   316   │        149         │      124      │         130         │        120         │    91.85     │
│    7    │ 'nested json to csv' │ '100000 rows, 31 MB' │   297   │        137         │      118      │         118         │        122         │    89.92     │
│    8    │  'flat csv to json'  │  '100 rows, 15 KB'   │   290   │                    │     36.4      │         209         │       53.97        │     40.2     │
│    9    │  'flat csv to json'  │ '1000 rows, 147 KB'  │   337   │                    │     50.28     │         235         │       55.98        │    45.72     │
│   10    │  'flat csv to json'  │  '10000 rows, 1 MB'  │   319   │                    │     43.84     │         233         │       56.15        │    44.89     │
│   11    │  'flat csv to json'  │ '100000 rows, 15 MB' │   295   │                    │     41.76     │         231         │       54.92        │    44.13     │
│   12    │ 'nested csv to json' │  '100 rows, 16 KB'   │   191   │                    │     30.85     │        73.48        │       33.32        │    40.73     │
│   13    │ 'nested csv to json' │ '1000 rows, 159 KB'  │   219   │                    │     30.96     │        75.46        │       35.37        │    41.25     │
│   14    │ 'nested csv to json' │  '10000 rows, 2 MB'  │   201   │                    │     29.67     │        75.87        │       34.77        │    41.33     │
│   15    │ 'nested csv to json' │ '100000 rows, 16 MB' │   196   │                    │     28.6      │        74.86        │        36.6        │     41.2     │
└─────────┴──────────────────────┴──────────────────────┴─────────┴────────────────────┴───────────────┴─────────────────────┴────────────────────┴──────────────┘

RESULTS TABLE CSV (1000x ROWS/SEC, HIGHER IS BETTER)

benchmark,data,1:csv42,2:json2csv (+flat),3:csv (+flat),4:papaparse (+flat),5:fast-csv (+flat),6:json-2-csv
flat json to csv,"100 rows, 29 KB",652,751,398,556,297,135
flat json to csv,"1000 rows, 295 KB",680,637,359,532,312,138
flat json to csv,"10000 rows, 3 MB",588,355,277,320,293,133
flat json to csv,"100000 rows, 29 MB",540,397,271,254,289,128
nested json to csv,"100 rows, 31 KB",319,183,150,186,126,95.58
nested json to csv,"1000 rows, 313 KB",333,167,139,171,120,90.45
nested json to csv,"10000 rows, 3 MB",316,149,124,130,120,91.85
nested json to csv,"100000 rows, 31 MB",297,137,118,118,122,89.92
flat csv to json,"100 rows, 15 KB",290,,36.4,209,53.97,40.2
flat csv to json,"1000 rows, 147 KB",337,,50.28,235,55.98,45.72
flat csv to json,"10000 rows, 1 MB",319,,43.84,233,56.15,44.89
flat csv to json,"100000 rows, 15 MB",295,,41.76,231,54.92,44.13
nested csv to json,"100 rows, 16 KB",191,,30.85,73.48,33.32,40.73
nested csv to json,"1000 rows, 159 KB",219,,30.96,75.46,35.37,41.25
nested csv to json,"10000 rows, 2 MB",201,,29.67,75.87,34.77,41.33
nested csv to json,"100000 rows, 16 MB",196,,28.6,74.86,36.6,41.2
```
