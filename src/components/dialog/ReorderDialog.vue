<template>
  <div class="dialog-xb-ws transparent">
    <div class="layer" @click="onClose"></div>
    <div class="dialog center">
      <div class="dialog-body">
        <span class="photo"></span>
        <span class="close" @click="onClose"></span>
        <p class="h4">家长您好</p>
        <p class="content">
          我们已经帮宝贝自动匹配了寒春续报订单，快点击按钮查看授课老师、时间等详细信息吧！
        </p>
        <div class="btn-fn">
          <x-button class="btn-purple" @click.native="goWaitOrder">
            立即查看
          </x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';

export default {
  components: {
    XButton,
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    goWaitOrder() {
      this.$emit('goWaitOrder');
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
// 弹框-寒春续报
.dialog-xb-ws{
  .cus-dialog-box;
  .dialog{
    padding: 1.2rem .5rem .4rem;
  }
  .dialog-body{
    .btn-fn{
      .weui-btn{
        .l-h(.8rem);
        .weui-btn(2.4rem);
      }
    }
    .content{
      margin-top: .3rem;
    }
    .btn-fn{
      margin: .9rem 0 0;
      text-align: center;
    }
  }
  .photo{
    .pos-box-lc(2.04rem,2.04rem);
    top: -1.02rem;
    .bg-m('@{img-path}dialog-xb-ws-photo.png');
    background-size: 100% 100%;
  }
  .close{
    .pos-box-lc(.8rem,.8rem);
    bottom: -1.8rem;
    .bg-m('@{img-path}dialog-close-big.png');
    background-size: 100% 100%;
  }
}
</style>


