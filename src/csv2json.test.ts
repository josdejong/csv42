import { describe, expect, test } from 'vitest'
import { csv2json } from './csv2json'
import { testCases } from './data/testCases'

describe('csv2json', () => {
  testCases.forEach(({ description, json, parsedJson, csv, jsonOptions }) => {
    test(description, () => {
      expect(csv2json(csv, jsonOptions)).toEqual(parsedJson || json)
    })
  })
})
