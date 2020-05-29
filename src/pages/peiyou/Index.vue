<template>
  <div class="peiyou-home">
    <loading></loading>
  </div>
</template>

<script>
import Loading from '@/components/loading/Index';
import { getItem, setItem } from '@/utils/localStorage';
import { getPyToken, pyLogin, getUserInfo } from '@/api';

export default {
  name: 'peiyouIndex',
  components: {
    Loading,
  },
  data() {
    return {
      uid: '',
      pid: 0,
      cityCode: '',
    };
  },
  methods: {
    home() {
      getUserInfo().then(() => {
        const userInfo = this.$store.state.userInfo;
        if (userInfo.member_level === 0 && this.pid === 0) {
          this.$router.replace({
            name: 'importPlanc',
            params: {
              channel_id: 23,
            },
          });
        } else {
          this.$router.replace({
            name: 'home',
          });
        }
      });
    },
    hint(msg, url) { // 提示跳转
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        width: '15em',
        time: '2000',
        isShowMask: true,
      });
      if (url !== '') {
        setTimeout(() => {
          this.$router.replace({ path: url });
        }, 2000);
      }
    },
    login() {
      pyLogin(this.uid).then((res) => {
        if (res.error_code) {
          window.localStorage.clear();
          if (res.error_code === 10116) {
            this.$router.replace({
              name: 'peiyouTopic',
              query: {
                uid: this.uid,
                cityCode: this.cityCode,
              },
            });
            return;
          }
          this.hint(res.error_msg, '');
        } else {
          if (res.data.code === 1) {
            this.hint(res.data.msg, '');
          }
          if (res.data.code === 3) { // 重新授权
            window.localStorage.clear();
          }
          // 转换存储uid为数字
          this.uid = res.data.uid;
          this.pid = res.data.pid;
          this.getToken();
        }
      });
    },
    getToken() {
      // 培优用户非第一次登录
      if ((getItem('peiyou-uid') !== this.uid)
        || (getItem('peiyou-cityCode') !== this.cityCode)
        || (!getItem('token'))) {
        window.localStorage.clear();
        // 请求后台获取token
        getPyToken(this.uid, this.cityCode, 2).then((res) => {
          if (res.error_code !== 0) { // 手机号为空 未关联vipx 绑定手机登录
            this.$router.push({
              name: 'bindMobile',
              query: {
                uid: this.uid,
                cityCode: this.cityCode,
              },
            });
            return;
          }
          setItem('token', res.data.tal_token);
          setItem('peiyou-uid', this.uid);
          setItem('peiyou-cityCode', this.cityCode);
          this.home();
        });
      } else {
        this.home();
      }
    },
  },
  mounted() {
    this.uid = this.$route.query.uid.replace(/\s/g, '+');
    this.cityCode = this.$route.query.cityCode;
    if (this.uid && this.cityCode) {
      this.login();
    }
  },
};
</script>
