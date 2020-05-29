import Vue from 'vue';
//import FastClick from 'fastclick';
import { sync } from 'vuex-router-sync';
import { ToastPlugin, ConfirmPlugin, WechatPlugin, AlertPlugin } from 'vux';
import Icon from 'vue-svg-icon/Icon';
import VueTouch from 'vue-touch';
import 'vue-fullpage/vue-fullpage.css';
import 'animate.css';
import VueFullpage from 'vue-fullpage';
// import ga from 'vue-ga';

import App from './App';
import router from './router';
import store from './store';
import axios from './utils/http';
import config from './config';
import flex from './utils/flex';
import { setMsgType } from './api';
import { getItem, clearLocalStorage } from './utils/localStorage';

// FastClick.attach(document.body);
sync(store, router);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.apiConfig = config;
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(WechatPlugin);
Vue.use(AlertPlugin);
Vue.component('icon', Icon);
Vue.use(VueTouch, {
  name: 'v-touch',
});
Vue.use(VueFullpage);
// Vue.config.errorHandler = function (err, vm, info) {
//   console.log(err, vm, info);
// };
/**
 * history management
 */
/* const history = window.sessionStorage;
history.clear();
let count = history.getItem('count') * 1 || 0;
history.setItem('/', 0);
router.beforeEach((to, from, next) => {
  store.commit('UPDATE_LOADING', {
    isLoading: true,
  });

  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
      toIndex + fromIndex === 0) {
      store.commit('UPDATE_DIRECTION', {
        direction: 'forward',
      });
    } else {
      store.commit('UPDATE_DIRECTION', {
        direction: 'reverse',
      });
    }
  } else {
    count += 1;
    history.setItem('count', count);
    if (to.path !== '/') {
      history.setItem(to.path, count);
    }
    store.commit('UPDATE_DIRECTION', {
      direction: 'forward',
    });
  }

  if (/\/?http/.test(to.path)) {
    const url = to.path.split('http');
    window.location.href = `http${url}`;
  } else {
    next();
  }
}); */

router.beforeEach((to, from, next) => {
  if (getItem('openid') === 'undefined') {
    clearLocalStorage();
    location.href = '/login';
    return;
  }
  store.commit('UPDATE_LOADING', {
    isLoading: true,
  });
  /*if (['time', 'selTeacher', 'turnsTeacher', 'turnsTime', 'adjustTime', 'adjustTeacher', 'teacher', 'login']
    .indexOf(to.name) === -1) {
    FastClick.attach(document.body);
  }*/
  if (to.name !== 'aimsPdf') {
    flex(false, 100, 1);
  }
  document.title = 'VIPX';   //这 to.meta.title 是在router里设置的
  if (typeof to.meta.title !== 'undefined' && to.meta.title !== '') {
    document.title = to.meta.title;
  }
  if (/\/?http/.test(to.path)) {
    const url = to.path.split('http');
    window.location.href = `http${url}`;
  } else {
    next();
  }
});
router.afterEach((to) => {
  store.commit('UPDATE_LOADING', {
    isLoading: false,
  });
  if (to.query.msg_type || to.query.schedule_id) {
    const msgType = to.query.msg_type || '';
    const scheduleId = to.query.schedule_id || 0;
    setMsgType(msgType, scheduleId);
  }
  /* eslint-disable */
  //添加百度统计
  if (process.env.NODE_ENV === 'deployment') {
    setTimeout(() => {
      const _hmt = _hmt || [];
      (function() {
        document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
        const hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?2b39c4c5e5c14227b7292edaf5ed9efe";
        hm.id = 'baidu_tj';
        const s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    }, 0);
  }
});

/* eslint-disable no-new */
new Vue({
  store,
  router,
  axios,
  render: h => h(App),
}).$mount('#app');
