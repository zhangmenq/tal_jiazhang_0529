<template>
  <div class="py-invite-reg">
    <div class="form-group">
      <group class="comm-group">
        <x-input
          type="tel"
          v-model="mobile"
          keyboard="number"
          placeholder="该号码仅用于VIPX与您沟通"
          :max="11">
        </x-input>
      </group>
      <p class="error-tips">{{errorMobile.tips}}</p>
    </div>
    <div class="form-group code">
      <group class="comm-group">
        <x-input
          type="tel"
          v-model="code"
          placeholder="请输入验证码"
          :max="6">
        </x-input>
      </group>
      <a class="ver-code" :class="{'highlight': !errorMobile.status && smsCode.flag === 0}" @click="sendCode">
      {{smsCode.btnText}}
      </a>
      <p class="error-tips">{{smsCode.tips}}</p>
    </div>
    <div class="form-group sel py-invite-icon" :class="{'selected': selectState === true}">
      <group class="comm-group" @click.native="selectState = !selectState">
        <x-input
          type="tel"
          v-model="grade.name"
          readonly
          placeholder="请选择年级">
        </x-input>
      </group>
      <ul class="sel-list" v-show="selectState">
        <li v-for="(option, idx) in gradeList" :key="idx" @click="changeSelect(option)">{{option.name}}</li>
      </ul>
    </div>
    <x-button class="py-invite-icon" @click.native="submit"
      v-if="!isDisabled"
      :disabled="this.errorMobile.status || this.code === '' || this.grade.id === 0"
      :class="{'btn-purple': !this.errorMobile.status && this.code !== '' && this.grade.id > 0}">
      马上预约
    </x-button>
    <x-button class="py-invite-icon" :disabled="true" v-else>
      预约中...
    </x-button>
  </div>
</template>

<script>
import { XInput, Group, XButton } from 'vux';
import { isEmpty } from 'lodash';
import { sendSmsCode, checkUserExists } from '@/api';

export default {
  components: {
    XInput,
    XButton,
    Group,
  },
  props: {
    pyUid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      mobile: '',
      code: '',
      grade: {
        id: 0,
        name: '',
      },
      selectState: false,
      gradeList: [
        { id: 8, name: '一年级' },
        { id: 9, name: '二年级' },
        { id: 10, name: '三年级' },
        { id: 11, name: '四年级' },
      ],
      errorTips: ['请输入正确手机号', '验证码有误'],
      errorMobile: {
        status: true, // true 错误 false 对
        tips: '',
      },
      smsCode: {
        flag: 0, // 0 -未发送 1-发送中
        tips: '',
        time: 60,
        btnText: '获取邀请码',
        timer: '',
      },
      isDisabled: false,
    };
  },
  watch: {
    mobile(value) {
      if (value.length !== 11) {
        this.errorMobile.status = true;
        return;
      }
      if (!/1\d{10}/.test(value)) {
        this.errorMobile.status = true;
        this.errorMobile.tips = '请输入正确手机号';
        return;
      }
      checkUserExists(this.mobile).then((res) => {
        if (Number(res.error_code) === 0) {
          this.errorMobile.status = true;
          this.errorMobile.tips = '用户已存在';
          return;
        }
        this.errorMobile.status = false;
        this.errorMobile.tips = '';
      });
    },
    code() {
      if (!isEmpty(this.smsCode.tips)) {
        this.smsCode.tips = '';
      }
    },
  },
  methods: {
    changeSelect(obj) {
      this.grade.name = obj.name;
      this.grade.id = obj.id;
      this.selectState = false;
    },
    sendCode() {
      if (this.errorMobile.status || this.smsCode.flag === 1) {
        return;
      }
      this.smsCode.flag = 1;
      this.smsCode.btnText = '发送中...';
      sendSmsCode(this.mobile, 4).then(() => {
        this.smsCode.timer = setInterval(() => {
          this.smsCode.time -= 1;
          this.smsCode.btnText = `已发送(${this.smsCode.time})`;
          if (this.smsCode.time < 1) {
            this.smsCode.btnText = '重新发送';
            this.smsCode.time = 60;
            this.smsCode.flag = 0;
            clearInterval(this.smsCode.timer);
          }
        }, 1000);
      });
    },
    submit() {
      if (this.errorMobile.status || isEmpty(this.code) || this.grade.id === 0) {
        return;
      }
      this.isDisabled = true;
      const params = {
        mobile: this.mobile,
        uid: this.pyUid,
        code: this.code,
        grade_id: this.grade.id,
      };
      this.$http.post(`${this.apiConfig.host}/peiyou/new-user`, params).then((res) => {
        this.isDisabled = false;
        if (res.error_code > 0) {
          this.smsCode.tips = res.error_msg;
          return;
        }
        // 领取体验课
        this.$emit('regCallback', this.mobile);
      });
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.py-invite-reg{
  padding: .1rem .3rem 0;
  .weui-btn{
    width: 100%;
  }
  .weui-cells{
    .weui-cells;
  }
  .form-group{
    position: relative;
    margin-bottom: .4rem;
    &.code{
      padding-right: 1.9rem;
    }
    .ver-code{
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -.56rem/2;
      .wh(1.46rem,.56rem);
      line-height: .56rem;
      background: @col-disable;
      border-radius: .56rem/2;
      text-align: center;
      font-size: .24rem;
      color: #909090;
      &.highlight{
        color: @col-light-purple;
        background:rgba(149,55,172,.3);
      }
      &:before{
        content: '';
        .pos-box-hc(.02rem,.46rem);
        left: -.23rem;
        background: @col-light-purple;
      }
    }
    &.sel{
      .weui-cells{
        // background: transparent;
        border-radius: .9rem/2;
      }
    }
    .sel-list{
      position: absolute;
      left: .02rem;
      right: .02rem;
      top: .45rem;
      padding: .7rem .23rem .3rem;
      border: .02rem solid @col-light-purple;
      border-bottom-left-radius: .4rem;
      border-bottom-right-radius: .4rem;
      background: #fff;
      border-top: none;
      text-align: center;
      z-index: 2;
      li{
        .l-h(.68rem);
        border-top: .01rem solid rgba(149,55,172,.2);
        &:first-of-type{
          border: none;
        }
      }
    }
    .error-tips{
      position: absolute;
      left: 0;
      right: 0;
      bottom: -.34rem;
      line-height: .36rem;
      font-size: .24rem;
      color: @col-orange;
    }
  }
  .comm-group{
    position: relative;
    z-index: 3;
    .vux-x-input{
      border: .02rem solid @col-light-purple;
      border-radius: .45rem;
    }
    .weui-input{
      .l-h(.9rem);
    }
  }
}
</style>
