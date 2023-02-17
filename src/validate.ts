export function validateDelimiter(delimiter: string): string {
  if (delimiter.length !== 1) {
    throw new Error(`Invalid delimiter: must be a single character but is "${delimiter}"`)
  }

  return delimiter
}

export function validateEOL(eol: string): string {
  if (!isEol(eol, 0)) {
    throw new Error(`Invalid EOL character: choose "\\n" or "\\r\\n"`)
  }

  return eol
}

export function isEol(text: string, index: number): boolean {
  return isLF(text, index) || isCRLF(text, index)
}

export function isLF(text: string, index: number) {
  return text.charCodeAt(index) === newline
}

export function isCRLF(text: string, index: number) {
  return text.charCodeAt(index) === carriageReturn && text.charCodeAt(index + 1) === newline
}

const newline = 0xa // "\n"
const carriageReturn = 0xd // "\r"
