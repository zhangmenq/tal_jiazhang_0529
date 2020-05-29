<template>
  <div v-show="show" class="refund-box">
    <div class="common-dialog" @click="cancel()"></div>
    <div class="dialog-box hintbutton-box">
      <div class="dialog-txt">
        <p>
          {{ tips }}
        </p>
      </div>
      <x-button
        @click.native="confirm()"
        mini
       >
        {{ confirmText }}
      </x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';

export default {
  name: 'refundDialog',
  components: {
    XButton,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    tips: {
      type: String,
      default: '取消',
    },
  },
  methods: {
    confirm() {
      this.$emit('RefundConfirm');
    },
    cancel() {
      this.$emit('onCancel');
    },
  },
};
</script>
<style lang="less" scoped>
.refund-box{
  .dialog-box{
    width: 5.25rem;
    padding: .6rem .4rem .4rem .4rem;
    .dialog-txt{
      padding:0 0 .4rem 0;
      p{
        padding: 0;
        line-height: .5rem;
        font-size: .3rem;
        text-align: left;
      }
    }
    .weui-btn{
      width:2.05rem;
      background:rgba(154,87,200,1);
    }
    &.hintbutton-box{
      left:50%;
      transform: translate(-50%,0);
    }
  }
}
</style>

