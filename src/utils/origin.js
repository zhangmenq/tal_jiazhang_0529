import { getItem } from './localStorage';

const ua = navigator.userAgent;
// const android = /Android/.test(ua) || /Adr/.test(ua);
// const ios = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua);
const mobile = ['Android', 'Adr', 'iPhone', 'iPad', 'iPod'].indexOf(ua) > -1;

export default function getOrigin() {
  /**
   * 微信浏览器
   */
  if (/micromessenger/.test(ua.toLowerCase())) {
    return 'wechat';
  }
  /**
   * 培优客户端
   */
  if (getItem('peiyou-uid') && getItem('peiyou-cityCode')) {
    /* if (mobile && ios) {
      return 'peiyou-ios';
    } else if (mobile && android) {
      return 'peiyou-andriod';
    } */
    return 'peiyou';
  }

  if (mobile) {
    return 'mobile';
  }

  return 'pc';
}
