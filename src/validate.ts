export function validateDelimiter(delimiter: string): string {
  if (delimiter.length !== 1) {
    throw new Error(`Delimiter must be a single character but is "${delimiter}"`)
  }

  return delimiter
}

export function validateEOL(eol: string): string {
  if (!isEol(eol, 0)) {
    throw new Error(`Invalid EOL character, choose "\\n" or "\\r\\n"`)
  }

  return eol
}

export function isEol(text: string, index: number): boolean {
  return isLF(text, index) || isCRLF(text, index)
}

export function isLF(text: string, index: number) {
  return text[index] === '\n'
}

export function isCRLF(text: string, index: number) {
  return text[index] === '\r' && text[index + 1] === '\n'
}
