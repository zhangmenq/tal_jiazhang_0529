<template>
<div class="shortcourse-login">
  <div class="pop-close" @click="loginClose()"></div>
  <div class="iframe-box">
    <div class="tel-box">
      <group class="groupinput">
        <x-input
          v-model="mobile"
          type="tel"
          keyboard="number"
          placeholder="请输入您的手机号码"
          :max ="11"
          :is-type="validMobile"
          :disabled="isDisabled"
          @on-change="getValidMobile"
          @on-focus="getErrorFlag(false, 1)"
          @on-blur="getErrorFlag(true, 1)"
          novalidate>
        </x-input>
      </group>
      <p class="wrong" v-if="mobileMsg">{{mobileMsg}}</p>
      <p class="wrong" v-else-if="errorTipsM && validMobile(mobile).valid">
        {{validMobile(mobile).msg}}
      </p>
    </div>
    <div class="auth-code">
      <group class="groupinput">
        <x-input
          type="tel"
          v-model="code"
          placeholder="请输入短信验证码"
          :max="6"
          :is-type="validCode"
          @on-focus="getErrorFlag(false, 2)"
          @on-blur="getErrorFlag(true, 2)"
          novalidate>
        </x-input>
      </group>
      <x-button
        :class="{'highlight': !showError}"
        @click.native="sendCode(mobile, userType > 1 ? 15 : 1)">
        {{smsCodeTxt}}
      </x-button>
      <p class="wrong" v-if="codeMsg">{{codeMsg}}</p>
      <p class="wrong" v-else-if="errorTipsC && validCode(code).valid">
        {{validCode(code).msg}}
      </p>
    </div>
    <p class="notice">未注册过的手机号将自动注册</p>
    <a class="login-btn"
      :class="{'highlight': mobile !== '' &&
      code !== '' &&
      !mobileMsg &&
      !codeMsg && !validMobile(mobile).valid && !validCode(code).valid}"
      @click="loginBtn()">登录
    </a>
  </div>
</div>
</template>
<script>
import { XInput, Group, XButton, Cell } from 'vux';
import { isEmpty } from 'lodash';
import { sendSmsCode, checkUserExists, register, login } from '@/api';
import { setItem, getItem } from '@/utils/localStorage';
import wechatMenu from '@/mixins/wechatMenu.js';

export default {
  name: 'shortcourseLogin',
  components: {
    XInput,
    XButton,
    Group,
    Cell,
  },
  mixins: [wechatMenu],
  props: {
    openid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      mobile: '',
      code: '',
      mobileMsg: '',
      codeMsg: '',
      showError: true,
      errorTipsM: false,
      errorTipsC: false,
      smsCodeTxt: '发送验证码',
      isDisabled: false,
      userType: 0, //用户类型,1:新用户 2:老用户
      validMobile(value) {
        if (value.trim() !== '' && /^1\d{10}/.test(value)) {
          return {
            valid: false,
            msg: '',
          };
        }
        return {
          valid: true,
          msg: '请输入正确手机号',
        };
      },
      validCode(value) {
        if (value.trim() !== '' && value.trim().length > 3 && value.trim().length < 7) {
          return {
            valid: false,
            msg: '',
          };
        }
        return {
          valid: true,
          msg: '请输入4-6位的验证码',
        };
      },
    };
  },
  destroyed() {
    this.$vux.toast.hide();
  },
  created() {
    //this.isLogin();
  },
  methods: {
    loginClose() {
      this.$emit('close');
    },
    isLogin() {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}/user/users/me`).then((ret) => {
          if (ret.error_code === 0) {
            this.$router.push({
              name: 'home',
            });
          }
        });
      }
    },
    getErrorFlag(val, type) {
      if (type === 1) {
        this.errorTipsM = val;
      } else {
        this.errorTipsC = val;
      }
      this.mobileMsg = '';
      this.codeMsg = '';
    },
    getValidMobile() {
      if (this.validMobile(this.mobile).valid) {
        this.showError = true;
      } else {
        checkUserExists(this.mobile).then((res) => {
          if (res.error_code === 0) { //用户已存在
            this.userType = 2;
          } else { //用户不存在
            this.userType = 1;
          }
        });
        this.showError = false;
      }
    },
    sendCode(mobile, type) {
      if (this.showError || this.codeMsg) {
        return false;
      }
      sendSmsCode(mobile, type).then((res) => {
        if (res.error_code !== 0) {
          this.mobileMsg = res.error_msg;
          return false;
        }
        this.showError = true;
        this.isDisabled = true;
        this.$vux.toast.show({
          type: 'text',
          text: '验证码已发送',
          position: 'middle',
          time: 3000,
          width: '10em',
        });
        this.captchaTimer();
      });
    },
    captchaTimer() {
      let time = 60;
      this.timer = setInterval(() => {
        this.smsCodeTxt = `已发送(${time})`;
        if (time === 0) {
          this.showError = false;
          this.isDisabled = false;
          this.smsCodeTxt = '重新发送';
          clearInterval(this.timer);
        }
        time -= 1;
      }, 1000);
    },
    loginBtn() {
      if (isEmpty(this.mobile) || !isEmpty(this.mobileMsg)
         || isEmpty(this.code) || !isEmpty(this.codeMsg)
         || this.validMobile(this.mobile).msg || this.validCode(this.code).msg) {
        return false;
      }
      if (this.userType > 1) {
        this.login();
      } else {
        this.register();
      }
    },
    register() {
      const data = {
        mobile: this.mobile,
        code: this.code,
        password: 'vipx666666',
        source_id: 8,
        from: 1,
      };
      return register(data).then((res) => {
        if (res.error_code !== 0) {
          this.codeMsg = res.error_msg;
          return false;
        }
        this.$vux.toast.show({
          type: 'text',
          text: '注册成功',
          position: 'middle',
          time: 3000,
          width: '10em',
        });
        this.login('password');
      });
    },
    login(loginType = 'code') {
      const data = {
        grant_type: this.apiConfig.grant_type,
        username: this.mobile,
        client_id: this.apiConfig.client_id,
        client_secret: this.apiConfig.client_secret,
        role: 1,
        account_type: loginType === 'password' ? 1 : 5, //短信验证码登录
        password: loginType === 'password' ? 'vipx666666' : this.code,
      };
      console.log(this.openid);
      if (this.openid) {
        data.openid = this.openid;
      }
      return login(data).then((res) => {
        if (res.error_code === 0) {
          setItem('token', res.data.access_token);
          if (loginType === 'code') {
            this.$vux.toast.show({
              type: 'text',
              text: '登录成功',
              position: 'middle',
              time: 3000,
              width: '10em',
            });
          }
          this.loginClose();
        } else if (res.error_code === 10109) {
          this.codeMsg = '验证码错误';
        } else {
          this.codeMsg = res.error_msg;
        }
      });
    },
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';

.shortcourse-login{
  .weui-icon-clear:before,
  .vux-input-icon.weui-icon-warn:before,
  .vux-input-icon.weui-icon-success:before{
    font-size: .23rem;
    margin:0 0 0 .02rem;
  }
  color: @col-white;
  font-size: 0.34rem;
  .pop-close{
    position: absolute;
    top: .2rem;
    right: .2rem;
    .wh(.4rem, .4rem);
    .bg-m('@{img-path}/introduce-close1.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: .23rem .23rem;
  }
  .iframe-box {
    padding: .1rem .44rem .44rem;
    border-radius: .2rem;
    height: 6.4rem;
    background:rgba(255,255,255,1);
    .tel-box{
      position: relative;
      border-bottom: .01rem solid #b3b9d1;
    }
    .auth-code {
      position: relative;
      border-bottom: .01rem solid #b3b9d1;
      .groupinput{
        width: 50%;
      }
      .weui-btn {
        position: absolute;
        right: 0;
        top: 0;
        border: none;
        border-radius: .2rem;
        width: 2rem;
        .l-h(.8rem);
        font-size: .3rem;
        padding: 0;
        color: #909090;
        background: #EAEAED;
        &.highlight {
          color: @col-white;
          background: @col-purple;
        }
      }
    }
    .login-btn{
      display: block;
      margin: .8rem auto 0;
      text-align: center;
      line-height: .9rem;
      border-radius: .45rem;
      .wh(5.3rem, .9rem);
      font-size: .36rem;
      color: #909090;
      background: #EAEAED;
      &.highlight {
        color: @col-white;
        background: @col-purple;
        box-shadow: 0px 9px 10px 0px rgba(126,93,221,0.3);
      }
    }
  }
  p {
    &.wrong{
      position: absolute;
      bottom: -.4rem;
      left: 0;
      font-size: .26rem;
      font-weight: normal;
      color: @col-wrong;
    }
    &.notice {
      font-size: .26rem;
      color: #b3b9d1;
      padding: .5rem 0 0 .1rem;
    }
  }
  .groupinput{
    position: relative;
  }
  .weui-cells {
    margin-top: .5rem;
    height: .9rem;
    line-height: .8rem;
    font-size: .3rem;
    background: none;
    overflow: auto;
    &:before{
      border: none;
    }
    &:after {
      border: none;
    }
    .weui-cell{
      padding: 0;
    }
  }
  .weui-input{
    color:#1B223F;
    font-size: .3rem;
    &::-webkit-input-placeholder{
      color: #b3b9d1;
    }
  }
  .shortcourse-login {
    position: relative;
    height: 100%;
    background: #F4F4F4;

  }
}
</style>
