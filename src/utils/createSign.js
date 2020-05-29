import config from '@/config';

const crypto = require('crypto');
/* eslint-disable */
export default function (params) {
  let str = '';
  let arr = '';
  str = `${params}&client_secret=${config.client_secret}`;
  arr = str.split('&').sort();
  str = arr.join('&');

  const hash = crypto.createHash('md5');
  return hash.update(str).digest('hex');
}
