<template>
  <div v-show="show" class="refund-book-box">
    <div class="common-dialog" @click="cancel()"></div>
    <div class="dialog-box hintbutton-box">
      <div class="dialog-txt">
        <p>
          {{ tips }}
        </p>
      </div>
      <x-button
        mini
        class="cancel"
        @click.native="cancel()">
        {{ cancelText }}
      </x-button>
       <x-button
        @click.native="confirm()"
        mini
        class="confirm"
       >
        {{ confirmText }}
      </x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';

export default {
  name: 'VxDialog',
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
    cancelText: {
      type: String,
      default: '取消',
    },
    tips: {
      type: String,
      default: '取消',
    },
  },
  methods: {
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
.refund-book-box{
  .dialog-box{
    width: 5.25rem;
    padding: .6rem .4rem .4rem .4rem;
    .dialog-txt{
      padding:0 0 .4rem 0;
      p{
        padding: 0;
        line-height: .5rem;
        font-size: .3rem;
        text-align: center;
      }
    }
    .confirm{
      &.weui-btn{
        background:rgba(154,87,200,1);
      }
    }
    .cancel{
       &.weui-btn{
      border:.02rem solid rgba(154,87,200,1);
      color:rgba(154,87,200,1);
      background: #fff;
      }
    }
    .weui-btn{
      width: 1.4rem;
    }
    &.hintbutton-box{
      left:50%;
      transform: translate(-50%,0);
    }
  }
}
</style>
