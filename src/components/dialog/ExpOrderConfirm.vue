<template>
  <div class="exp-order-confirm">
    <div class="dialog center">
      <div class="dialog-body">
        <p class="title">确定预约该时间的体验课吗？</p>
        <p class="date" v-for="(item, index) in dateTimes" :key="index">
          {{item.date}} {{item.timeV}}
        </p>
        <div class="btn-fn">
          <x-button class="weui-btn btn-purple" @click.native="confirm()">{{ !isDisabled ? '确认预约' : '下单中...'}}</x-button>
          <x-button class="weui-btn btn-plain-purple" @click.native="closeDialog()" :disabled="isDisabled">再想想</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import { XButton } from 'vux';

  export default {
    components: {
      XButton,
    },
    props: {
      dateTimes: {
        type: Array,
        default: [],
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      moment(date) {
        return moment(date);
      },
      confirm() {
        this.$emit('confirm');
      },
      closeDialog() {
        this.$emit('closeDialog');
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';
.exp-order-confirm{
  .cus-dialog-box;
  .dialog-body{
    margin-top: .66rem;
    text-align: center;
    .title{
      font-size: .36rem;
      margin-bottom: .1rem;
    }
    .date{
      color: @col-purple;
      font-size: .42rem;
      margin-bottom: .5rem;
    }
  }
}
</style>
