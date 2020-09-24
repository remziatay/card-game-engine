export const debounce = (func, wait = 250, timeout) => (...args) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    timeout = null
    func(...args)
  }, wait)
}
