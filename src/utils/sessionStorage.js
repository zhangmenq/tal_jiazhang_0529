const prefix = 'vipx-';
export function getSessionItem(key) {
  return JSON.parse(window.sessionStorage.getItem(`${prefix}${key}`));
}

export function setSessionItem(key, value) {
  window.sessionStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
}

export function removeSessionItem(key) {
  window.sessionStorage.removeItem(`${prefix}${key}`);
}

export function clearSessionStorage() {
  window.sessionStorage.clear();
}
