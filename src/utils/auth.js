/**
 * Verify if exists a valid access token.
 */
export function hasValidToken() {
  let isValid = false
  const token = sessionStorage.getItem('token')
  const expiresAt = sessionStorage.getItem('expira')
  if (expiresAt && token) {
    const now = new Date()
    isValid = now.getTime() < Number(expiresAt) * 1000
  }
  return isValid
}

/**
 * Returns the remaining time of the access token in milliseconds.
 * @returns time lift in ms
 */
export function timeLeft() {
  const expiresAt = Number(sessionStorage.getItem('expira'))
  return Math.trunc(expiresAt * 1000 - new Date().getTime())
}
