export function tryFromString(url: string | undefined): URL | undefined {
  if (url == undefined) {
    return undefined
  }
  try {
    return new URL(url)
  } catch (_) {
    return undefined
  }
}