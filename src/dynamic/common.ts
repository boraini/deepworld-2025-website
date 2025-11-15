export function formatNumber(n) {
  const raw = n.toString()

  const foundDecimalIndex = raw.indexOf(".")
  const decimalIndex = foundDecimalIndex == -1 ? raw.length : foundDecimalIndex
  const intStart = n < 0 ? 1 : 0
  const numIntDigits = decimalIndex - intStart
  if (numIntDigits <= 4) return raw
  let result = raw.substring(decimalIndex)
  for (let end = decimalIndex; end > 0; end -= 3) {
    result = raw.substring(end - 3, end) + result
    if (end - 3 > intStart) result = "," + result
  }
  if (n < 0) result = "-" + result
  return result
}
