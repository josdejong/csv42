import { describe, expect, test } from 'vitest'
import cp from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const csv = 'id,name\r\n1,Joe\r\n2,Sarah\r\n\n'

describe('lib', () => {
  test('should load the library using CJS', () => {
    return new Promise<void>((resolve) => {
      const filename = join(__dirname, 'apps/cjsApp.cjs')

      cp.exec(`node ${filename}`, function (error, result) {
        expect(error).toEqual(null)
        expect(result).toEqual(csv)
        resolve()
      })
    })
  })

  test('should load the library using ESM', () => {
    return new Promise<void>((resolve) => {
      const filename = join(__dirname, 'apps/esmApp.mjs')

      cp.exec(`node ${filename}`, function (error, result) {
        expect(error).toEqual(null)
        expect(result).toEqual(csv)
        resolve()
      })
    })
  })

  test('should load the library using the UMD bundle', () => {
    return new Promise<void>((resolve) => {
      const filename = join(__dirname, 'apps/umdApp.cjs')

      cp.exec(`node ${filename}`, function (error, result) {
        expect(error).toEqual(null)
        expect(result).toEqual(csv)
        resolve()
      })
    })
  })

  test('should load the library using the minified UMD bundle', () => {
    return new Promise<void>((resolve) => {
      const filename = join(__dirname, 'apps/umdApp.cjs')

      cp.exec(`node ${filename}`, function (error, result) {
        expect(error).toEqual(null)
        expect(result).toEqual(csv)
        resolve()
      })
    })
  })
})
