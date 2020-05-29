import Vue from 'vue';
import axios from 'axios';
import createSign from '@/utils/createSign.js';
import { obj2str } from '@/utils';
import { getPyToken, iswxlogin } from '@/api';
import apiConfig from '@/config';
import getOrigin from '@/utils/origin';
import router from '../router';
import { getItem, setItem, clearLocalStorage } from './localStorage';
import store from '../store';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config) => {
    //排除登录
    if (config.url.indexOf('tal/login/password') === -1 || config.url.indexOf('peiyou/signin') === -1 || (config.url.indexOf('/tal/login/password') > -1 && config.method === 'delete')) {
      Object.assign(config.headers, {
        Authorization: `Bearer ${getItem('token')}`,
      });
    }
    const shortChannel = getItem('channel') || '';
    const str = `lang=zh-CN&terminal=3&client_id=${apiConfig.client_id}&versionCode=2&short_channel=${shortChannel}`;
    if (config.method === 'get') {
      if (config.url.indexOf('?') > -1) {
        Vue.set(config, 'url', `${config.url}&${str}`);
      } else {
        Vue.set(config, 'url', `${config.url}?${str}`);
      }
    } else if (config.method === 'post' || config.method === 'put') {
      const data = {
        lang: 'zh-CN',
        terminal: 3,
        client_id: apiConfig.client_id,
        versionCode: 2,
        short_channel: shortChannel,
      };
      Object.assign(config.data, data);
    }
    /**
     * 特定的请求路由加上sign
     */
    const urlArr = config.url.split('/');
    // const params = config.data;
    const lastPath = urlArr[urlArr.length - 1].indexOf('?') > -1
      ? urlArr[urlArr.length - 1].split('?')[0]
      : urlArr[urlArr.length - 1];
    const signArr = ['smscode', 'password-reset-tal', 'password-modify',
      'students', 'check-use-introduce', 'exist', 'bury-point', 'presell',
      'new-user', 'presell-promotion', 'aliyun-upload', 'aliyun-play-auth',
      'count', 'aliyun-play-info', 'collect-data', 'star-result', 'private',
      'composite', 'active-count', 'is-wechat', 'test-result', 'read_report', 'download_picture-log', 'userInfo', 'wangxiao-presell'];
    if (signArr.indexOf(lastPath) > -1 || lastPath.indexOf('user-info') > -1 || lastPath.indexOf('check-uid') > -1) {
      if (config.method === 'post') {
        config.data.sign = createSign(obj2str(config.data));
      } else if (config.method === 'get') {
        config.url += `&sign=${createSign(obj2str(config.url.split('?')[1]))}`;
      }
    }
    return config;
  },
  err => Promise.reject(err),
);
axios.interceptors.response.use(
  (response) => {
    if (response.data.tal_token && response.data.tal_token !== getItem('token')) {
      setItem('token', response.data.tal_token);
    }
    return response.data;
  },
  (err) => {
    //401：token过期
    if (err.response && err.response.status === 401 && store.state.route.name !== 'login') {
      // 培优用户认证信息过期，再次请求token接口
      if (getItem('peiyou-uid') && getItem('peiyou-cityCode')) {
        return getPyToken(getItem('peiyou-uid'), getItem('peiyou-cityCode'), 2).then((res) => {
          if (res.error_code === 0) {
            setItem('token', res.data.tal_token);
            router.push({
              name: 'home',
            });
          }
        });
      }
      //微信用户自动登录
      if (getOrigin() === 'wechat') {
        const url = location.href;
        const data = {
          touri: url,
          grant_type: 'wxvipx',
          client_secret: apiConfig.client_secret,
        };
        return iswxlogin(data).then((res) => {
          if (res.error_code === 0 && res.data.tal_token) {
            setItem('token', res.data.tal_token);
            setItem('openid', res.data.openid);
            location.reload();
          }
          if (res.error_code === 10110) {
            const redirectUri = decodeURIComponent(res.data.url);
            location.href = redirectUri;
          }
          if (res.error_code === 10109 || res.error_code === 10117) {
            clearLocalStorage();
            router.replace({
              name: 'login',
            });
          }
        });
      }
      return Promise.resolve(err.response).then(() => {
        clearLocalStorage();
        router.replace({
          name: 'login',
        });
      }).catch((error) => {
        console.log(error);
      });
    }
    return Promise.reject(err).catch((e) => {
      console.log(e);
    });
  },
);

export default axios;
