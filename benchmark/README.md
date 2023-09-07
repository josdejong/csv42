# Benchmark

You can find a detailed article about this benchmark here: https://jsoneditoronline.org/indepth/parse/csv-parser-javascript/

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

The benchmark tries to test realistic, real-world scenarios. Considerations are the following:

- I opted to not try to tweak configuration for individual libraries but go with the “standard” way of using them, since that is how they will normally be used.
- Since nested JSON data is so common in JSON data structures, the benchmark tests with two different data sets: one with flat JSON data, and one with nested JSON data. Not all CSV libraries do support flattening nested JSON objects though. To make the libraries work with nested data, the data is flattened using the library [flat](https://github.com/hughsk/flat). The use of flat is denoted with a `(+flat)` suffix in the benchmark results. Note that flattening is only applied in the nested JSON benchmarks and NOT in the tests with flat JSON data.
- The performance depends of course on what kind of data a single row contains and how much. This benchmark generates test data that contains a bit of everything: string, numbers, and strings that need escaping. And in the case of nested data: a nested object and nested array.
- The CSV libraries have different defaults when parsing values. Some just leave all values a string, which is fast (nothing needs to be parsed). Most parse for example numeric values into a number, which is most useful in real-world scenarios. In the benchmarks, numeric values are being parsed into numbers.
- In the benchmark, we want to see the performance for both small and large amounts of data. Therefore, the benchmark runs tests for various numbers of rows.
- The library `json2csv` does support nested objects, but no nested arrays. The notation for a nested array can differ: `flat` uses dot notation like `location.geo.1`, and `csv42` uses bracket notation like `location.geo[1]`. To make the benchmark not too complicated, the nested data used in the benchmark does not contain arrays.

## Conclusions

Looking at the benchmark results, we can observe the following:

- The `csv42` does really well. It is faster than the popular CSV libraries, sometimes by a big margin. It is only outpaced in one case by `json2csv` when converting a small, flat JSON document. The libraries `json2csv` and `papaparse` do very well too in many of the tests, though their performance drops quite a bit for larger documents when converting JSON to CSV.
- Most CSV libraries seem optimized mostly to convert small JSON documents to CSV. There is much room for improvement converting CSV to JSON, and processing large amounts of data.
- Except for `csv42`, none of the libraries does perform well with nested data. Most libraries do not support flattening nested JSON data, and thus are not designed with this in mind. The separate conversion step to flatten nested data is an expensive one.
- It is important to keep in mind that this benchmark only looks at the performance. Besides performance, there are more reasons to consider a library: size, features, support, and more.

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
  {"_type":"item","name":"Item 0","description":"Item 0 description in text","location":{"city":"Rotterdam","street":"Main street","geo":{"latitude":51.9280712,"longitude":4.4207888}},"speed":5.4,"heading":128.3,"sizes":{"small":0.9,"medium":3.4,"large":5.1},"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  {"_type":"item","name":"Item 1","description":"Item 1 description in text","location":{"city":"Rotterdam","street":"Main street","geo":{"latitude":51.9280712,"longitude":4.4207888}},"speed":5.4,"heading":128.3,"sizes":{"small":0.9,"medium":3.4,"large":5.1},"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  {"_type":"item","name":"Item 2","description":"Item 2 description in text","location":{"city":"Rotterdam","street":"Main street","geo":{"latitude":51.9280712,"longitude":4.4207888}},"speed":5.4,"heading":128.3,"sizes":{"small":0.9,"medium":3.4,"large":5.1},"field with , delimiter":"value with , delimiter","field with \" double quote":"value with \" double quote"},
  ...
]

nested csv preview:
_type,name,description,location.city,location.street,location.geo.latitude,location.geo.longitude,speed,heading,sizes.small,sizes.medium,sizes.large,"field with , delimiter","field with "" double quote"
item,Item 0,Item 0 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,0.9,3.4,5.1,"value with , delimiter","value with "" double quote"
item,Item 1,Item 1 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,0.9,3.4,5.1,"value with , delimiter","value with "" double quote"
item,Item 2,Item 2 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,0.9,3.4,5.1,"value with , delimiter","value with "" double quote"
...

VALIDATION

All CSV libraries are successfully validated

SECTION 1: FLAT JSON to CSV

benchmark: { name: 'flat json to csv', size: '15 KB', rows: 100 }
1:csv42              x 6,523 ops/sec ±0.41% (83 runs sampled)
2:json2csv           x 7,076 ops/sec ±0.41% (79 runs sampled)
3:csv                x 3,891 ops/sec ±0.65% (80 runs sampled)
4:papaparse          x 5,372 ops/sec ±0.34% (81 runs sampled)
5:fast-csv           x 3,135 ops/sec ±0.45% (78 runs sampled)
6:json-2-csv         x 1,297 ops/sec ±0.44% (82 runs sampled)

benchmark: { name: 'flat json to csv', size: '147 KB', rows: 1000 }
1:csv42              x 670 ops/sec ±0.53% (83 runs sampled)
2:json2csv           x 608 ops/sec ±0.44% (84 runs sampled)
3:csv                x 353 ops/sec ±0.29% (84 runs sampled)
4:papaparse          x 510 ops/sec ±0.43% (83 runs sampled)
5:fast-csv           x 323 ops/sec ±0.38% (84 runs sampled)
6:json-2-csv         x 131 ops/sec ±0.29% (84 runs sampled)

benchmark: { name: 'flat json to csv', size: '1.5 MB', rows: 10000 }
1:csv42              x 58.44 ops/sec ±1.89% (67 runs sampled)
2:json2csv           x 36.43 ops/sec ±6.03% (57 runs sampled)
3:csv                x 27.75 ops/sec ±6.28% (66 runs sampled)
4:papaparse          x 30.82 ops/sec ±2.59% (68 runs sampled)
5:fast-csv           x 29.09 ops/sec ±2.41% (67 runs sampled)
6:json-2-csv         x 12.65 ops/sec ±1.52% (57 runs sampled)

benchmark: { name: 'flat json to csv', size: '15 MB', rows: 100000 }
1:csv42              x 5.41 ops/sec ±2.29% (30 runs sampled)
2:json2csv           x 3.93 ops/sec ±7.38% (23 runs sampled)
3:csv                x 2.69 ops/sec ±6.67% (18 runs sampled)
4:papaparse          x 2.48 ops/sec ±4.07% (17 runs sampled)
5:fast-csv           x 2.91 ops/sec ±3.28% (19 runs sampled)
6:json-2-csv         x 1.22 ops/sec ±1.45% (11 runs sampled)

SECTION 2: NESTED JSON to CSV

benchmark: { name: 'nested json to csv', size: '16 KB', rows: 100 }
1:csv42              x 3,888 ops/sec ±0.50% (81 runs sampled)
2:json2csv (+flat)   x 1,927 ops/sec ±0.69% (82 runs sampled)
3:csv (+flat)        x 1,589 ops/sec ±0.30% (83 runs sampled)
4:papaparse (+flat)  x 1,981 ops/sec ±0.26% (83 runs sampled)
5:fast-csv (+flat)   x 1,405 ops/sec ±1.97% (81 runs sampled)
6:json-2-csv         x 568 ops/sec ±1.96% (83 runs sampled)

benchmark: { name: 'nested json to csv', size: '159 KB', rows: 1000 }
1:csv42              x 400 ops/sec ±1.58% (83 runs sampled)
2:json2csv (+flat)   x 172 ops/sec ±0.30% (84 runs sampled)
3:csv (+flat)        x 149 ops/sec ±1.73% (83 runs sampled)
4:papaparse (+flat)  x 185 ops/sec ±0.21% (84 runs sampled)
5:fast-csv (+flat)   x 147 ops/sec ±1.48% (82 runs sampled)
6:json-2-csv         x 57.10 ops/sec ±1.33% (83 runs sampled)

benchmark: { name: 'nested json to csv', size: '1.6 MB', rows: 10000 }
1:csv42              x 37.99 ops/sec ±0.65% (84 runs sampled)
2:json2csv (+flat)   x 15.44 ops/sec ±3.26% (67 runs sampled)
3:csv (+flat)        x 13.18 ops/sec ±3.19% (58 runs sampled)
4:papaparse (+flat)  x 13.68 ops/sec ±3.17% (60 runs sampled)
5:fast-csv (+flat)   x 14.02 ops/sec ±0.71% (65 runs sampled)
6:json-2-csv         x 4.15 ops/sec ±22.91% (23 runs sampled)

benchmark: { name: 'nested json to csv', size: '16 MB', rows: 100000 }
1:csv42              x 2.48 ops/sec ±1.88% (17 runs sampled)
2:json2csv (+flat)   x 1.03 ops/sec ±6.89% (10 runs sampled)
3:csv (+flat)        x 0.89 ops/sec ±3.47% (9 runs sampled)
4:papaparse (+flat)  x 0.89 ops/sec ±4.13% (9 runs sampled)
5:fast-csv (+flat)   x 0.94 ops/sec ±2.82% (9 runs sampled)
6:json-2-csv         x 0.41 ops/sec ±1.83% (7 runs sampled)

SECTION 3: FLAT CSV to JSON

benchmark: { name: 'flat csv to json', size: '15 KB', rows: 100 }
1:csv42              x 2,422 ops/sec ±4.24% (70 runs sampled)
3:csv                x 267 ops/sec ±4.76% (66 runs sampled)
4:papaparse          x 1,661 ops/sec ±4.05% (67 runs sampled)
5:fast-csv           x 469 ops/sec ±3.32% (67 runs sampled)
6:json-2-csv         x 1,083 ops/sec ±4.00% (70 runs sampled)

benchmark: { name: 'flat csv to json', size: '147 KB', rows: 1000 }
1:csv42              x 244 ops/sec ±7.15% (64 runs sampled)
3:csv                x 28.37 ops/sec ±3.94% (63 runs sampled)
4:papaparse          x 183 ops/sec ±4.09% (66 runs sampled)
5:fast-csv           x 54.69 ops/sec ±3.16% (62 runs sampled)
6:json-2-csv         x 116 ops/sec ±2.59% (70 runs sampled)

benchmark: { name: 'flat csv to json', size: '1.5 MB', rows: 10000 }
1:csv42              x 26.19 ops/sec ±3.52% (60 runs sampled)
3:csv                x 3.65 ops/sec ±7.24% (22 runs sampled)
4:papaparse          x 19.28 ops/sec ±4.23% (47 runs sampled)
5:fast-csv           x 5.22 ops/sec ±4.39% (29 runs sampled)
6:json-2-csv         x 10.73 ops/sec ±3.70% (51 runs sampled)

benchmark: { name: 'flat csv to json', size: '15 MB', rows: 100000 }
1:csv42              x 2.15 ops/sec ±3.65% (15 runs sampled)
3:csv                x 0.31 ops/sec ±1.92% (6 runs sampled)
4:papaparse          x 1.64 ops/sec ±5.10% (13 runs sampled)
5:fast-csv           x 0.56 ops/sec ±5.12% (7 runs sampled)
6:json-2-csv         x 1.21 ops/sec ±1.02% (10 runs sampled)

SECTION 4: NESTED CSV to JSON

benchmark: { name: 'nested csv to json', size: '16 KB', rows: 100 }
1:csv42              x 2,021 ops/sec ±4.25% (73 runs sampled)
3:csv (+flat)        x 246 ops/sec ±3.46% (72 runs sampled)
4:papaparse (+flat)  x 582 ops/sec ±4.18% (67 runs sampled)
5:fast-csv (+flat)   x 295 ops/sec ±4.16% (67 runs sampled)
6:json-2-csv         x 993 ops/sec ±3.06% (68 runs sampled)

benchmark: { name: 'nested csv to json', size: '159 KB', rows: 1000 }
1:csv42              x 181 ops/sec ±4.26% (64 runs sampled)
3:csv (+flat)        x 26.70 ops/sec ±3.25% (61 runs sampled)
4:papaparse (+flat)  x 72.61 ops/sec ±2.04% (80 runs sampled)
5:fast-csv (+flat)   x 32.87 ops/sec ±3.35% (71 runs sampled)
6:json-2-csv         x 116 ops/sec ±1.55% (70 runs sampled)

benchmark: { name: 'nested csv to json', size: '1.6 MB', rows: 10000 }
1:csv42              x 20.36 ops/sec ±2.49% (49 runs sampled)
3:csv (+flat)        x 2.72 ops/sec ±3.98% (18 runs sampled)
4:papaparse (+flat)  x 6.90 ops/sec ±2.66% (36 runs sampled)
5:fast-csv (+flat)   x 3.37 ops/sec ±2.68% (21 runs sampled)
6:json-2-csv         x 11.20 ops/sec ±1.74% (53 runs sampled)

benchmark: { name: 'nested csv to json', size: '16 MB', rows: 100000 }
1:csv42              x 2.04 ops/sec ±3.39% (14 runs sampled)
3:csv (+flat)        x 0.27 ops/sec ±1.54% (6 runs sampled)
4:papaparse (+flat)  x 0.74 ops/sec ±2.61% (8 runs sampled)
5:fast-csv (+flat)   x 0.36 ops/sec ±1.98% (6 runs sampled)
6:json-2-csv         x 1.20 ops/sec ±0.53% (10 runs sampled)

RESULTS TABLE (1000x ROWS/SEC, HIGHER IS BETTER)
┌─────────┬──────────────────────┬──────────────────────┬─────────┬────────────────────┬───────────────┬─────────────────────┬────────────────────┬──────────────┐
│ (index) │      benchmark       │         data         │ 1:csv42 │ 2:json2csv (+flat) │ 3:csv (+flat) │ 4:papaparse (+flat) │ 5:fast-csv (+flat) │ 6:json-2-csv │
├─────────┼──────────────────────┼──────────────────────┼─────────┼────────────────────┼───────────────┼─────────────────────┼────────────────────┼──────────────┤
│    0    │  'flat json to csv'  │  '100 rows, 15 KB'   │   652   │        708         │      389      │         537         │        313         │     130      │
│    1    │  'flat json to csv'  │ '1000 rows, 147 KB'  │   670   │        608         │      353      │         510         │        323         │     131      │
│    2    │  'flat json to csv'  │ '10000 rows, 1.5 MB' │   584   │        364         │      278      │         308         │        291         │     126      │
│    3    │  'flat json to csv'  │ '100000 rows, 15 MB' │   541   │        393         │      269      │         248         │        291         │     122      │
│    4    │ 'nested json to csv' │  '100 rows, 16 KB'   │   389   │        193         │      159      │         198         │        140         │    56.77     │
│    5    │ 'nested json to csv' │ '1000 rows, 159 KB'  │   400   │        172         │      149      │         185         │        147         │     57.1     │
│    6    │ 'nested json to csv' │ '10000 rows, 1.6 MB' │   380   │        154         │      132      │         137         │        140         │    41.46     │
│    7    │ 'nested json to csv' │ '100000 rows, 16 MB' │   248   │        103         │     88.5      │        89.25        │       93.91        │    40.52     │
│    8    │  'flat csv to json'  │  '100 rows, 15 KB'   │   242   │                    │     26.72     │         166         │       46.94        │     108      │
│    9    │  'flat csv to json'  │ '1000 rows, 147 KB'  │   244   │                    │     28.37     │         183         │       54.69        │     116      │
│   10    │  'flat csv to json'  │ '10000 rows, 1.5 MB' │   262   │                    │     36.45     │         193         │       52.22        │     107      │
│   11    │  'flat csv to json'  │ '100000 rows, 15 MB' │   215   │                    │     30.56     │         164         │       55.77        │     121      │
│   12    │ 'nested csv to json' │  '100 rows, 16 KB'   │   202   │                    │     24.62     │        58.22        │       29.46        │    99.34     │
│   13    │ 'nested csv to json' │ '1000 rows, 159 KB'  │   181   │                    │     26.7      │        72.61        │       32.87        │     116      │
│   14    │ 'nested csv to json' │ '10000 rows, 1.6 MB' │   204   │                    │     27.18     │        69.02        │       33.66        │     112      │
│   15    │ 'nested csv to json' │ '100000 rows, 16 MB' │   204   │                    │     27.11     │        73.67        │       35.97        │     120      │
└─────────┴──────────────────────┴──────────────────────┴─────────┴────────────────────┴───────────────┴─────────────────────┴────────────────────┴──────────────┘

RESULTS TABLE CSV (1000x ROWS/SEC, HIGHER IS BETTER)

benchmark,data,1:csv42,2:json2csv (+flat),3:csv (+flat),4:papaparse (+flat),5:fast-csv (+flat),6:json-2-csv
flat json to csv,"100 rows, 15 KB",652,708,389,537,313,130
flat json to csv,"1000 rows, 147 KB",670,608,353,510,323,131
flat json to csv,"10000 rows, 1.5 MB",584,364,278,308,291,126
flat json to csv,"100000 rows, 15 MB",541,393,269,248,291,122
nested json to csv,"100 rows, 16 KB",389,193,159,198,140,56.77
nested json to csv,"1000 rows, 159 KB",400,172,149,185,147,57.1
nested json to csv,"10000 rows, 1.6 MB",380,154,132,137,140,41.46
nested json to csv,"100000 rows, 16 MB",248,103,88.5,89.25,93.91,40.52
flat csv to json,"100 rows, 15 KB",242,,26.72,166,46.94,108
flat csv to json,"1000 rows, 147 KB",244,,28.37,183,54.69,116
flat csv to json,"10000 rows, 1.5 MB",262,,36.45,193,52.22,107
flat csv to json,"100000 rows, 15 MB",215,,30.56,164,55.77,121
nested csv to json,"100 rows, 16 KB",202,,24.62,58.22,29.46,99.34
nested csv to json,"1000 rows, 159 KB",181,,26.7,72.61,32.87,116
nested csv to json,"10000 rows, 1.6 MB",204,,27.18,69.02,33.66,112
nested csv to json,"100000 rows, 16 MB",204,,27.11,73.67,35.97,120
```
