/* eslint-disable */
const prefix = 'vipx-';
export function getItem(key) {
  let value = window.localStorage.getItem(`${prefix}${key}`);
  if (value && value !=='undefined') {
    value = JSON.parse(value);
  }
  return value;
}

export function setItem(key, value) {
  window.localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
}

export function removeItem(key) {
  window.localStorage.removeItem(`${prefix}${key}`);
}

export function clearLocalStorage() {
  window.localStorage.clear();
}

export function getCookie(key) {
  if (new RegExp('\\b' + key + '=([^;]+)', 'g').test(document.cookie)) {
    return decodeURIComponent(RegExp.$1 || ''); 
  }
  return '';
}
export function setCookie(key, value) {
  var t = new Date(); 
  t.setTime(t.getTime() + 365 * 24 * 3600 * 1000); 
  document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + ";path=/;expires=" + t.toGMTString(); 
}

export function sessionSet(key, val) {
	sessionStorage.setItem(prefix + key, val);
}
export function sessionGet(key) {
  return sessionStorage.getItem(prefix + key);
}