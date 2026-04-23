
export function envOrThrow(key: string): string {
  const value = process.env[key]
  if (value) {
    return value;
  } else {
    console.log(value)
    throw new Error(`No key for ${key}`)
  }
}
