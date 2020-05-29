<template>
  <div class="quiz_container">
    <div class="quiz_content">
      <img src="../../../static/imgs/quiz/bg_ico1.png" class="bg_ico bg_ico1">
      <img src="../../../static/imgs/quiz/bg_ico2.png" class="bg_ico bg_ico2">
      <div class="quiz_login_box">
        <h4>欢迎你成为VIPX的小成员~</h4>
        <p class="sub_title">请从这里开启你的奇幻英语学习之旅吧</p>
        <div class="login_input_box">
          <div class="input_item">
            <group class="groupinput">
              <x-input
                v-model="mobile"
                type="tel"
                keyboard="number"
                placeholder="请输入您的手机号码"
                :max ="11"
                :is-type="validMobile"
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
          <div class="input_item yzm">
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
            <a href="javascript:;" class="getcode_btn" :class="{'canSubmit': !showError}" @click="sendCode(mobile, userType > 1 ? 15 : 1)">{{smsCodeTxt}}</a>
            <p class="wrong" v-if="codeMsg">{{codeMsg}}</p>
            <p class="wrong" v-else-if="errorTipsC && validCode(code).valid">
              {{validCode(code).msg}}
            </p>
          </div>
          <div class="login_tips">未注册过的手机号将自动注册</div>
        </div>
        <a href="javascript:;" class="login_btn" 
          :class="{'canLogin': mobile !== '' && code !== '' && !mobileMsg && !codeMsg && !validMobile(mobile).valid && !validCode(code).valid}"
          @click="loginBtn()">登录</a>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { XInput, Group, XButton, Cell } from 'vux';
import { sendSmsCode, checkUserExists, register, login } from '@/api';
import { setItem, getItem } from '@/utils/localStorage';
import { getUserInfo } from '@/api';
import { isEmpty } from 'lodash';
import { goTest } from '@/utils/index.js';
import wechatMenu from '@/mixins/wechatMenu.js';

export default {
  name: 'quizLogin',
  components: {
    XInput,
    XButton,
    Group,
    Cell,
  },
  mixins: [wechatMenu],
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
      userInfo: {},
      testId: 0,
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
    }
  },
  destroyed() {
    this.$vux.toast.hide();
  },
  created() {
    //this.isLogin();
  },
  mounted() {
    
  },
  methods: {
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
      return login(data).then((res) => {
        if (res.error_code === 0) {
          setItem('token', res.data.tal_token);
          if (loginType === 'code') {
            this.$vux.toast.show({
              type: 'text',
              text: '登录成功',
              position: 'middle',
              time: 3000,
              width: '10em',
            });
          }
          this.checkUserInfo();
        } else if (res.error_code === 10109) {
          this.codeMsg = '验证码错误';
        } else {
          this.codeMsg = res.error_msg;
        }
      });
    },
    //获取用户信息并检测是否完整
    checkUserInfo() {
      this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            this.userInfo = res.data;
            this.getTestResult();
          }
        });
    },
    //获取是否有测试等级
    getTestResult() {
      this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.userInfo.id}&grade_id=${this.userInfo.grade_id}&level_id=${this.userInfo.level_id}`).then((res) => {
        if (res.data.id) {
          this.testId = res.data.id;
        }
        if (this.testId === 0 || this.userInfo.level_id === 67) {
          this.$router.push({
            path: '/level/quiz-complete',
          });
          //goTest(this.userInfo.id, this.userInfo.grade_id, this.userInfo.level_id, this.testId);
        } else {
          this.$router.push({
            name: 'home',
          });
        }
      });
    }
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
@color-purple: #9A57C8;
@color-yellow: #FFEC17;
.quiz_container{
  height: 100%;
  background:linear-gradient(135deg,rgba(111,35,174,1) 0%,rgba(242,103,181,1) 100%);
}
.quiz_content{
  width: 20.04rem;
  min-height: 100%;
  position: relative;
  margin: 0 auto;
  background: url(../../../static/imgs/quiz/stars.png) no-repeat 0 1.46rem;
  .bg_ico{
    display: block;
    position: absolute;
    &.bg_ico1{
      top: 0;
      right: 0.4rem;
    }
    &.bg_ico2{
      top: 5.68rem;
      left: 2.2rem;
    }
  }
  .quiz_login_box{
    width: 9.2rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
    h4{
      line-height: .84rem;
      font-size: .6rem;
      text-align: center;
      color: @col-white;
    }
    .sub_title{
      line-height: .6rem;
      font-size: .4rem;
      text-align: center;
      color: @col-white;
    }
    .login_input_box{
      padding: 0.72rem 0.6rem 0.8rem;
      margin-top: 0.8rem;
      background: @col-white;
      box-shadow:0px .28rem .8rem 0px rgba(125,26,159,1);
      border-radius:20px;
    }
    .input_item{
      height: 1.04rem;
      border-bottom: 0.02rem solid #B3B9D1;
      position: relative;
      margin-top: .72rem;
      &:first-child{
        margin-top: 0;
      }
      input{
        border: none;
        background: none;
        width: 100%;
        height: 100%;
        font-size: .32rem;
        &.yzm{
          width: 50%;
        }
      }
      &.yzm{
        input{
          width: 60%;
        }
      }
      .getcode_btn{
        display: block;
        width: 2rem;
        height: .72rem;
        position: absolute;
        top: .16rem;
        right: 0;
        border-radius: .18rem;
        background: #B3B9D1;
        color: #fff;
        text-align: center;
        font-size: .32rem;
        line-height: .72rem;
        &.canSubmit{
          color: @col-white;
          background: @color-purple;
        }
      }
    }
    .login_tips{
      padding: .4rem 0 .1rem;
      line-height: .4rem;
      font-size: .28rem;
      color: #B3B9D1;
    }
  }
  .login_btn{
    display: block;
    width: 6rem;
    line-height: 1rem;
    font-size: .4rem;
    text-align: center;
    margin: .8rem auto 0;
    border-radius: .5rem;
    background: #FFF9B5;
    color: #E7A97C;
    &.canLogin{
    color: #BD5407;
    background: @color-yellow;
    }
  }
  .wrong {
    position: absolute;
    bottom: -0.4rem;
    left: 0;
    font-size: .26rem;
    font-weight: normal;
    color: #ff0000;
  }
  .weui-cells {
    margin-top: 0;
    height: 1.04rem;
    line-height: .8rem;
    font-size: .32rem;
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
}
@media (max-width: 1242PX){
  .quiz_container{
    background:linear-gradient(135deg,rgba(111,35,174,1) 0%,rgba(111,35,174,1) 25%,rgba(242,103,181,1) 100%);
  }
  .quiz_content{
    width: 100%;
    min-height: 100%;
    position: relative;
    margin: 0 auto;
    background: url(../../../static/imgs/quiz/stars.png) no-repeat 0 .73rem;
    .bg_ico{
      display: block;
      position: absolute;
      &.bg_ico1{
        top: 0;
        right: 0.2rem;
      }
      &.bg_ico2{
        top: 2.84rem;
        left: 1.1rem;
      }
    }
    .quiz_login_box{
      width: 88%;
      position: absolute;
      left: 50%;
      top: .6rem;
      transform: translate(-50%, 0);
      h4{
        line-height: .67rem;
        font-size: .48rem;
        text-align: center;
        color: @col-white;
      }
      .sub_title{
        line-height: .48rem;
        font-size: .34rem;
        text-align: center;
        color: @col-white;
      }
      .login_input_box{
        padding: 0.6rem 0.45rem 0.8rem;
        margin-top: 1rem;
        background: @col-white;
        box-shadow:0px .14rem .4rem 0px rgba(125,26,159,1);
        border-radius:.2rem;
      }
      .input_item{
        height: 1.02rem;
        border-bottom: 1PX solid #B3B9D1;
        position: relative;
        margin-top: .36rem;
        &:first-child{
          margin-top: 0;
        }
        input{
          border: none;
          background: none;
          width: 100%;
          height: 1.02rem;
          line-height: 1.02rem;
          font-size: .32rem;
          &::-webkit-input-placeholder{
            color: #B3B9D1;
          }
          &.yzm{
            width: 50%;
          }
        }
        .getcode_btn{
          display: block;
          width: 2rem;
          height: .8rem;
          position: absolute;
          top: .1rem;
          right: 0;
          border-radius: .18rem;
          background: #B3B9D1;
          color: #fff;
          text-align: center;
          font-size: .32rem;
          line-height: .72rem;
          &.canSubmit{
            color: @col-white;
            background: @color-purple;
          }
        }
      }
      .login_tips{
        padding: .4rem 0 .1rem;
        line-height: .4rem;
        font-size: .28rem;
        color: #B3B9D1;
      }
    }
    .login_btn{
      display: block;
      width: 5.3rem;
      line-height: .9rem;
      font-size: .36rem;
      text-align: center;
      margin: 1.4rem auto 0;
      border-radius: .45rem;
      background: #FFF9B5;
      color: #E7A97C;
      box-shadow:0 .14rem .4rem 0 rgba(125,26,159,1);
      &.canLogin{
      color: #BD5407;
      background: @color-yellow;
      }
    }
    .wrong {
      position: absolute;
      bottom: -0.4rem;
      left: 0;
      font-size: .26rem;
      font-weight: normal;
      color: #ff0000;
    }
    .weui-cells {
      margin-top: 0;
      height: 1.02rem;
      line-height: .8rem;
      font-size: .32rem;
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
  }
}
</style>
