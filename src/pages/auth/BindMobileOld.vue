<template>
  <div class="bind-mobile">
    <group>
      <x-input
        v-model="mobile"
        keyboard="number"
        placeholder="请输入手机号码"
        :max="11"
        ></x-input>
      <x-input
        v-model="code"
        placeholder="请输入验证码"
        class="weui-vcode">
      <!-- btn-disable btn-purple -->
        <x-button
          mini
          class="btn-disable"
          :class="{'btn-purple': validMobile(mobile).valid}"
          slot="right"
          type="primary"
          @click.native="sendCode()"
          >{{btnTxt}}</x-button>
      </x-input>
    </group>
    <p class="tips"><i>*</i>请输入要绑定的学而思VIPX手机号，绑定成功后，会将此手机号的课程信息等同步过来</p>
    <x-button class="btn-save btn-purple" @click.native="confirm()">
      {{subTxt}}
    </x-button>
    <!-- 您要绑定的手机号已被绑定！ -->
    <p class="error-tips">{{tips}}</p>
    <vx-dialog
      :show="dialogData.show"
      :tips="dialogData.tips"
      @onConfirm="modify()"
      @onCancel="cancel()">
    </vx-dialog>
  </div>
</template>
<script>
import { Group, XButton, XInput } from 'vux';
import validateMixin from '@/mixins/validateMixin';
import VxDialog from '@/components/dialog/Index';
import { smsCode, mobileBind, mobileModify, getUserInfo } from '@/api';
import { getItem } from '@/utils/localStorage';

export default{
  components: {
    Group,
    XButton,
    XInput,
    VxDialog,
  },
  mixins: [validateMixin],
  data() {
    return {
      mobile: '',
      code: '',
      tips: '',
      btnTxt: '发送验证码',
      subTxt: '绑定手机',
      isSend: 0,
      isSubmit: 0,
      uid: '',
      cityCode: '',
      type: 0, // 1-绑定手机号 2-修改手机号
      dialogData: {
        show: false,
        tips: '',
      },
    };
  },
  methods: {
    cancel() {
      this.dialogData.show = false;
      this.isSubmit = 0;
      this.subTxt = '更改绑定手机';
    },
    sendCode() {
      if (this.isSend) { // 验证码发送中
        return;
      }
      if (!this.validMobile(this.mobile).valid) {
        this.tips = this.validMobile(this.mobile).msg;
        return;
      }
      this.isSend = 1;
      this.tips = '';
      this.btnTxt = '发送中...';
      let codeType = 4; // 4-绑定手机号 5-修改手机号
      if (this.type === 2) {
        codeType = 5;
      }
      smsCode(this.mobile, codeType).then((res) => {
        if (res.error_code !== 0) {
          this.isSend = 0;
          this.tips = res.error_msg;
          this.btnTxt = '发送验证码';
          return;
        }
        this.countdown();
      });
    },
    countdown() {
      let seconds = 60;
      const timer = setInterval(() => {
        this.btnTxt = `${seconds} s`;
        if (seconds === 0) {
          this.isSend = 0;
          this.btnTxt = '重新发送';
          clearInterval(timer);
        }
        seconds -= 1;
      }, 1000);
    },
    confirm() {
      this.tips = '';
      if (this.isSubmit) {
        return;
      }
      if (!this.validMobile(this.mobile).valid) {
        this.tips = this.validMobile(this.mobile).msg;
        return;
      }
      if (this.code.trim().length === 0) {
        this.tips = '请输入验证码';
        return;
      }
      this.isSubmit = 1;
      this.subTxt = '绑定中...';
      if (this.type === 1) {
        this.bind();
        return;
      }
      // 修改手机号
      getUserInfo().then(() => {
        const userInfo = this.$store.state.userInfo;
        if (userInfo.order_count.major > 0) { // 主修课课程数
          this.dialogData.tips = `当前账号${userInfo.ism}已有课程，绑定新手机号后，旧课程将不被同步到新账号上，是否确定继续？`;
          this.dialogData.show = true;
          return;
        }
        this.modify();
      });
    },
    bind() {
      mobileBind(this.uid, this.mobile, this.code).then((res) => {
        if (res.error_code !== 0) {
          this.isSubmit = 0;
          this.subTxt = '绑定手机';
          this.tips = res.error_msg;
          return;
        }
        this.hint(res.data.msg);
      });
    },
    modify() {
      mobileModify(this.mobile, this.code).then((res) => {
        if (res.error_code !== 0) {
          this.cancel();
          this.tips = res.error_msg;
          return;
        }
        // 隐藏弹框
        this.dialogData.show = false;
        window.localStorage.clear();
        this.hint(res.data.msg);
      });
    },
    hint(msg) { // 提示跳转
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        width: '15em',
        time: '2000',
        isShowMask: true,
      });
      setTimeout(() => {
        this.$router.push({
          name: 'peiyouIndex',
          query: {
            uid: this.uid,
            cityCode: this.cityCode,
          },
        });
      }, 2000);
    },
  },
  mounted() {
    if (getItem('peiyou-uid') && getItem('peiyou-cityCode')) {
      this.uid = getItem('peiyou-uid');
      this.cityCode = getItem('peiyou-cityCode');
      this.type = 2;
      this.subTxt = '更改绑定手机';
      return;
    }
    this.type = 1;
    this.uid = this.$route.query.uid.replace(/\s/g, '+');
    this.cityCode = this.$route.query.cityCode;
  },
};
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .bind-mobile{
    padding: .2rem 0;
    min-height: 100%;
    background: @col-bg;
    .weui-cells{
      .weui-cells;
      .weui-cell{
        padding-left: .49rem;
      }
      .weui-btn{
        padding: 0;
        .wh(2rem,.7rem);
        border-radius: .08rem;
        font-size: .3rem;
        &.btn-disable{
          .btn-disable;
        }
        &.btn-purple{
          .btn-purple;
        }
        &:after{
          border: none;
        }
      }
    }
    .tips{
      margin-top: .3rem;
      padding: 0 .46rem;
      line-height: .4rem;
      font-size: .24rem;
      color: @col-gray;
      i{
        font-size: .28rem;
        color: @col-purple;
      }
    }
    .btn-save{
      margin-top: 1rem;
      width: 76.8%;
      border-radius: .08rem;
      font-size: .36rem;
      .btn-purple;
    }
    .error-tips{
      margin-top: .4rem;
      .error-tips;
    }
  }
</style>
