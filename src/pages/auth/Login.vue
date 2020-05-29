<template>
  <div class="login-reg">
    <div class="loginreg-cont login">
      <!-- <tab :line-width="3" bar-active-color="#75008b" custom-bar-width="0.6rem">
        <tab-item selected @click.native="loginTab(1)">VIPX账号</tab-item>
        <tab-item @click.native="loginTab(3)">培优账号</tab-item>
      </tab> -->
      <div class="tab_box">
        <a href="javascript:;" :class="{selected:loginType===1}" @click="loginTab(1)">VIPX账号</a>
        <a href="javascript:;" :class="{selected:loginType===3}" @click="loginTab(3)">培优账号</a>
      </div>
      <div>
        <group class="groupinput">
          <x-input
            type="tel"
            v-model="mobile"
            keyboard="number"
            :placeholder="loginType === 1 ? '请输入手机号' : '请输入培优账号'"
            :max="loginType === 1 ? 11 : 50"
            :is-type="validMobile"
            :show-clear="showClearMobile"
            novalidate
            @on-focus="getErrorFlag(false)"
            @on-blur="getErrorFlag(true)"
            :disabled="isDisabled">
            <span slot="label" class="inputicon phone"></span>
          </x-input>
        </group>
        <group class="groupinput">
          <x-input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            :max="18"
            :is-type="validPassword"
            :show-clear="showClearPwd"
            novalidate
            @on-focus="getErrorFlag(false)"
            @on-blur="getErrorFlag(true)"
            :disabled="isDisabled">
            <span slot="label" class="inputicon password"></span>
          </x-input>
        </group>
        <captcha @setCaptcha="setCaptcha" v-if="captchaStatus" :captcha-reload="captchaReload"></captcha>
        <!-- combutton-active 激活按钮状态 -->
        <div class="execute-button">
          <p class="wrong" v-if="showError && !validMobile(mobile).valid">
            {{validMobile(mobile).msg}}
          </p>
          <p class="wrong" v-else-if="showError && !validPassword(password).valid">
            {{validPassword(password).msg}}
          </p>
          <p class="wrong" v-else-if="loginMsg !== ''">
            {{loginMsg}}
          </p>
          <x-button
            class="com-button"
            :class="{'combutton-active': validMobile(mobile).valid && validPassword(password).valid && validCaptcha}"
            @click.native="login()"
            :disabled="isDisabled">
            {{ !isDisabled ? '登录' : '登录中...' }}
          </x-button>
          <a class="reg-now" v-if="loginType === 1">
            <router-link :to="{name: 'register'}" v-if="!isIntroduced">立即注册</router-link>
            <router-link :to="{name: 'findPassword'}">忘记密码</router-link>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem, XInput, Group, XButton, Cell } from 'vux';
import { setItem, clearLocalStorage, getItem } from '@/utils/localStorage';
import { isComplete } from '@/utils/index.js';
import wechatMenu from '@/mixins/wechatMenu.js';
import Captcha from '@/components/common/Captcha';

export default {
  components: {
    Tab,
    TabItem,
    XInput,
    XButton,
    Group,
    Cell,
    Captcha,
  },
  data() {
    return {
      mobile: '',
      password: '',
      showError: false,
      showClearMobile: false,
      showClearPwd: false,
      loginMsg: '',
      loginType: 1,
      isDisabled: false,  // false-初始值 true-登录中
      validMobile(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: this.loginType === 1 ? '请输入手机号' : '请输入培优账号',
          };
        }
        if (this.loginType === 1) {
          return {
            valid: /^(1)[0-9]{10}$/.test(value.trim()),
            msg: '请输入正确的手机号',
          };
        }
        return {
          valid: true,
          msg: '',
        };
      },
      validPassword(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: '请输入密码',
          };
        }
        return {
          valid: value.trim().length > 5 && value.trim().length < 19,
          msg: '请输入6-18位的密码',
        };
      },
      introducePermission: 0,
      isIntroduced: 0,
      isCaptcha: false, // 滑动是否通过
      loginCount: 0, // 登录错误次数
      captchaStatus: false, // 是否显示滑动
      captchaReload: false, // 重置滑动
      csessionid: '', // 滑动验证参数
      ncToken: '', // 滑动验证参数
      sig: '', // 滑动验证参数
    };
  },
  computed: {
    validCaptcha() {
      return this.captchaStatus ? this.isCaptcha : true;
    },
  },
  mixins: [wechatMenu],
  methods: {
    getErrorFlag(val) { // 1-mobile 2-password
      this.loginMsg = '';
      this.showError = val;
      // if (type === 1) {
      //   this.showClearMobile = !val;
      //   return;
      // }
      // this.showClearPwd = !val;
    },
    login() {
      this.loginMsg = '';
      if (!this.validMobile(this.mobile).valid ||
        !this.validPassword(this.password).valid || !this.validCaptcha) {
        return;
      }
      this.isDisabled = true;
      // const postData = {
      //   grant_type: this.apiConfig.grant_type,
      //   username: this.mobile,
      //   password: this.password,
      //   client_id: this.apiConfig.client_id,
      //   client_secret: this.apiConfig.client_secret,
      //   role: this.loginType,
      //   account_type: this.loginType,
      //   csessionid: this.csessionid,
      //   nc_token: this.ncToken,
      //   sig: this.sig,
      // };
      if (this.loginType === 1) {
        const postData = {
          client_id: this.apiConfig.client_id,
          phone: this.mobile,
          password: this.password,
          csessionid: this.csessionid,
          nc_token: this.ncToken,
          sig: this.sig,
        };
        this.$http.post(`${this.apiConfig.host}tal/login/password`, postData).then((res) => {
          this.isDisabled = false;
          if (res.error_code > 0) {
            this.loginMsg = res.error_msg ? res.error_msg : '用户名或密码错误';
            if (this.loginCount === 0) {
              setItem('captchaStatus', true);
              this.captchaStatus = true;
            }
            this.captchaReload = !this.captchaReload;
            this.isCaptcha = false;
            this.loginCount += 1;
            return;
          }
          setItem('token', res.data.tal_token);
          this.afterLogin();
        });
      } else {
        const postData = {
          client_id: this.apiConfig.client_id,
          username: this.mobile,
          password: this.password,
          type: 1,
        };
        this.$http.post(`${this.apiConfig.host}peiyou/signin`, postData).then((res) => {
          this.isDisabled = false;
          if (res.error_code > 0) {
            this.loginMsg = '用户名或密码错误';
            if (this.loginCount === 0) {
              setItem('captchaStatus', true);
              this.captchaStatus = true;
            }
            this.captchaReload = !this.captchaReload;
            this.isCaptcha = false;
            this.loginCount += 1;
            return;
          }
          setItem('token', res.data.tal_token);
          this.afterLogin();
        });
      }
    },
    afterLogin() {
      this.$vux.toast.show({
        type: 'success',
        text: '登录成功',
        position: 'middle',
        time: 1500,
        width: '15em',
      });
      // 判断是否完善资料，如果未完善，跳到完善资料页面
      this.$http.get(`${this.apiConfig.host}/user/users/me`).then((ret) => {
        if (ret.error_code === 0) {
          this.$store.dispatch('updateUserInfo', {
            userInfo: ret.data,
          });
          setTimeout(() => {
            if (!isComplete(this.$store.state.userInfo)) {
              this.$router.replace({
                name: 'completeInformation',
              });
            } else {
              this.$router.replace({
                name: this.$store.state.route.from.name || 'home',
                query: this.$store.state.route.from.query,
                params: this.$store.state.route.from.params,
              });
            }
          }, 2000);
        }
      });
    },
    loginTab(type) {
      this.loginType = type;
    },
    setCaptcha(obj) {
      this.isCaptcha = true;
      this.csessionid = obj.csessionid;
      this.ncToken = obj.nc_token;
      this.sig = obj.sig;
    },
  },
  mounted() {
    this.captchaStatus = getItem('captchaStatus');
    const bookPop = getItem('book_pop');
    this.$http.get(`${this.apiConfig.host}/user/users/me`).then((res) => {
      if (res && res.error_code === 0) {
        this.$store.dispatch('updateUserInfo', {
          userInfo: res.data,
        });
        if (!isComplete(res.data)) {
          this.$router.replace({
            name: 'completeInformation',
          });
        } else {
          this.$router.replace({
            name: 'home',
          });
        }
      } else {
        clearLocalStorage();
        if (this.captchaStatus) {
          setItem('captchaStatus', true);
        }
        if (bookPop) {
          setItem('book_pop', 1);
        }
      }
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
};
</script>
<style lang="less" scoped>
  .tab_box{
    font-size: .36rem;
    line-height: .6rem;
    padding-bottom: .25rem;
    display: flex;
    a{
      display: block;
      flex: 1;
      text-align: center;
      color: #1c223d;
      &.selected{
        color: #9A57C8;
      }
    }
  }
</style>

