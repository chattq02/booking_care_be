export const isNullOrUndefined = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return true
  return false
}
