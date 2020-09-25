export const debounce = (func, wait = 250, timeout) => (...args) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    timeout = null
    func(...args)
  }, wait)
}

export const clamp = (number, lower, upper) => {
  if (number > upper) return upper
  if (number < lower) return lower
  return number
}
