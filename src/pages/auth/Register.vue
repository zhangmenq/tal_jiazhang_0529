<template>
  <div class="login-reg">
    <div class="loginreg-cont login">
      <div>
        <group>
          <x-input
            v-model="mobile"
            type="tel"
            placeholder="请输入手机号码"
            :max="11"
            :is-type="validMobile"
            @on-change="getValidMobile"
            @on-focus="getErrorFlag(false)"
            @on-blur="getErrorFlag(true)"
            :disabled="isDisabled"
            novalidate>
            <span slot="label" class="inputicon phone"></span>
          </x-input>
        </group>
        <div class="weui-vcode">
          <group>
            <x-input
              v-model="code"
              type="tel"
              placeholder="请输入验证码"
              :max="6"
              :is-type="validCode"
              @on-focus="getErrorFlag(false)"
              @on-blur="getErrorFlag(true)"
              :disabled="isDisabledAll"
              novalidate>
              <span slot="label" class="inputicon ver-code"></span>
            </x-input>
          </group>
          <!-- code-active激活按钮状态 -->
          <x-button
            class="send-code"
            :class="{'code-active': !showError}"
            @click.native="sendCode()">
            {{btnTxt}}
          </x-button>
        </div>
        <group>
          <x-input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            :max="18"
            :is-type="validPassword"
            @on-focus="getErrorFlag(false)"
            @on-blur="getErrorFlag(true)"
            :disabled="isDisabledAll"
            novalidate>
            <span slot="label" class="inputicon password"></span>
          </x-input>
        </group>
        <!-- combutton-active 激活按钮状态 -->
        <div class="execute-button">
          <p class="wrong" v-if="errorTips && !validMobile(mobile).valid">
            {{validMobile(mobile).msg}}
          </p>
          <p class="wrong" v-else-if="codeMsg">{{codeMsg}}</p>
          <p class="wrong" v-else-if="errorTips && !validCode(code).valid">
            {{validCode(code).msg}}
          </p>
          <p class="wrong" v-else-if="errorTips && !validPassword(password).valid">
            {{validPassword(password).msg}}
          </p>
          <p class="wrong" v-else-if="errorMsg">{{errorMsg}}</p>
          <x-button
            class="com-button"
            :class="{'combutton-active':
            validMobile(mobile).valid &&
            validCode(code).valid &&
            validPassword(password).valid}"
            @click.native="register()">
            立即注册
          </x-button>
        </div>
        <p class="reg-now">
          <a class="clicklogin" @click="login()">已拥有账户？点击登录</a>
        </p>
        <p class="statement">
          <span>注册即视为同意:</span><br>
          <router-link class="avatar" :to="{name: 'agreement'}">《学而思VIPX平台用户服务协议》</router-link>
          <router-link class="avatar" :to="{name: 'privacy'}">
            《隐私协议》
          </router-link>
        </p>
      </div>
      <!-- <div class="bottom-img">
          <img src="../../assets/login-reg-img1.png" alt="">
      </div> -->
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, Cell } from 'vux';
import validateMixin from '@/mixins/validateMixin';
import { clearLocalStorage } from '@/utils/localStorage';
import { sendSmsCode, talRegister } from '@/api';

export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
  },
  mixins: [validateMixin],
  data() {
    return {
      mobile: '',
      code: '',
      password: '',
      errorMsg: '',
      codeMsg: '',
      showError: true,
      errorTips: false,
      btnTxt: '发送验证码',
      isDisabled: false,
      isDisabledAll: false,
    };
  },
  methods: {
    getErrorFlag(val) {
      this.codeMsg = '';
      this.errorMsg = '';
      this.errorTips = val;
    },
    getValidMobile() {
      if (!this.validMobile(this.mobile).valid) {
        this.showError = true;
      } else {
        this.showError = false;
      }
    },
    sendCode() {
      if (this.showError || this.codeMsg) {
        return false;
      }
      sendSmsCode(this.mobile, 2).then((response) => {
        if (response.error_code !== 0) {
          this.codeMsg = response.error_msg;
          return false;
        }
        this.showError = true;
        this.isDisabled = true;
        this.$vux.toast.show({
          type: 'text',
          text: '短信验证码发送中,请注意查收',
          position: 'middle',
          time: 2000,
          width: '18em',
        });
        this.countdown();
      });
    },
    countdown() {
      let seconds = 60;
      const timer = setInterval(() => {
        this.btnTxt = `${seconds} s`;
        if (seconds === 0) {
          this.showError = false;
          this.isDisabled = false;
          this.btnTxt = '重新发送';
          clearInterval(timer);
        }
        seconds -= 1;
      }, 1000);
    },
    register() {
      if (
        !this.validMobile(this.mobile).valid ||
        !this.validPassword(this.password).valid ||
        !this.validCode(this.code).valid ||
        this.errorMsg
      ) {
        return false;
      }
      this.isDisabledAll = true;
      const data = {
        phone: this.mobile,
        sms_code: this.code,
        password: this.password,
      };
      talRegister(data).then((response) => {
        this.isDisabledAll = false;
        if (response.error_code !== 0) {
          this.errorMsg = response.error_msg;
          return false;
        }
        this.$vux.toast.show({
          type: 'success',
          text: '注册成功',
          position: 'middle',
          time: 1500,
          width: '15em',
        });
        setTimeout(() => {
          this.login();
        }, 1500);
      });
    },
    login() {
      clearLocalStorage();
      this.$router.push({
        name: 'login',
      });
    },
  },
};
</script>
