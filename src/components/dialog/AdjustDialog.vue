<template>
  <div v-show="show">
    <div class="common-dialog" @click="cancel()"></div>
    <div class="dialog-box hintbutton-box" v-if="type === 1">
      <em class="close" @click="cancel()">x</em>
      <div class="dialog-txt">
        <p>
          还有 <span class="num">{{changeNum}}</span> 次调课机会
        </p>
      </div>
      <!-- <div class="center-tips">注：预计<span class="red-font">2018-08-31</span>后，两个班次才可分开转班。</div>
      <div class="center-tips"><span class="col-orange">很遗憾，您的暑假班转班机会已经消耗完了</span></div> -->
      <x-button
        class="btn-purple"
        @click.native="cancel()"
        mini>再想想</x-button>
      <x-button
        mini
        :class="{'btn-plain': changeNum > 0, 'btn-disable-white': changeNum === 0}"
        @click.native="confirm()">调课</x-button>
      <div class="dialog-tips" v-if="tips !==''">{{tips}}</div>
    </div>
    <div class="dialog-box hintbutton-box" v-if="type === 2 && moment(courseDate) >= moment()">
      <em class="close" @click="cancel()">x</em>
        <div class="dialog-txt">
          <p>一旦转班成功，原老师原时间会被释放哦～</p>
        </div>
        <x-button
          class="btn-purple"
          @click.native="cancel()"
          mini>再想想</x-button>
        <x-button
          class="btn-plain"
          @click.native="confirm()"
          mini>转班</x-button>
        <div class="dialog-tips">
          注：转班仅变动上课时间或老师，该课程学习内容不变
        </div>
    </div>
    <div class="dialog-box hintbutton-box" v-else-if="type === 2 && turnInfo && JSON.stringify(turnInfo) !== '{}'">
      <em class="close" @click="cancel()">x</em>
        <div class="dialog-txt">
          <p v-for="(item, index) in turnInfo.info" :key="index">
            <span class="red-font" v-if="turnInfo.info.length >= 2">{{item.quarter}}</span>
            &nbsp;还有<span class="num"> {{item.turns}} </span>次转班机会
          </p>
        </div>
        <div class="center-tips" v-if="turnInfo.is_turn === 0">
          <span class="col-orange" v-if="turnInfo.info.length >= 2">很遗憾，您的暑假班转班机会已经消耗完了</span>
          <span class="col-orange" v-else>很遗憾，您的班转班机会已经消耗完了</span>
        </div>
        <template v-if="turnInfo.is_turn > 0">
          <x-button
            class="btn-purple"
            @click.native="cancel()"
            mini>再想想</x-button>
          <x-button
            mini
            :class="{'btn-plain': turnInfo.is_turn > 0, 'btn-disable-white': turnInfo.is_turn === 0}"
            @click.native="confirm()">转班</x-button>
        </template>
        <x-button v-else
            class="btn-purple"
            @click.native="cancel()"
            mini>我知道了</x-button>
        <div class="dialog-tips" v-if="turnInfo.info.length >= 2">
          注：预计
          <span class="red-font">{{moment(turnInfo.sale_stop).format('YYYY-MM-DD')}}</span>
          后，两个班次才可分开转班。
        </div>
        <div class="dialog-tips" v-else>
          注：转班仅变动上课时间或老师，该课程学习内容不变
        </div>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';
import moment from 'moment';

export default {
  name: 'AdjustDialog',
  components: {
    XButton,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    changeNum: {
      type: Number,
      default: 3,
    },
    tips: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: 1, // 调课、转班
    },
    turnInfo: {
      type: Object,
      default: () => {},
    },
    isPackage: {
      type: Boolean,
      default: false,
    },
    courseDate: {
      type: String,
      default: '',
    },
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    confirm() {
      this.$emit('onConfirm');
    },
    cancel() {
      this.$emit('onCancel');
    },
  },
};
</script>

<style lang="less" scoped>
  @import '../../styles/basic.less';
  .num {
    font-size: .5rem;
    color: @new-col-purple;
  }
  .red-font {
    color: @col-light-purple;
  }
  .weui-btn{
    &.btn-purple{
      .btn-purple;
    }
    &.btn-plain {
      .btn-plain(@new-col-purple,transparent);
      color: @new-col-purple;
    }
    &.btn-disable-white{
      .btn-disable-white;
    }
    &:after{
      display: none;
    }
  }
  .dialog-tips{
    margin-top: .2rem;
    font-size: .24rem;
    color: @col-gray;

  }

</style>
