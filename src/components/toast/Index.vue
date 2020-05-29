<template>
  <div v-show="show && isShow">
    <div class="common-dialog" v-if="isShowMask"></div>
    <div class="dialog-box hint-box">
      <p>
        <!-- wran 警告  succeed 成功 failed 失败 loading 加载中 -->
        <i class="icon failed"></i>
        {{ tips }}
      </p>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';

export default {
  name: 'toastPlugin',
  components: {
    XButton,
  },
  props: {
    tips: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    isShowMask: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      isShow: true,
    };
  },
  mounted() {
    let countDown = this.time;
    const timer = setInterval(() => {
      countDown -= 1;
      if (countDown === 0 || !this.show) {
        clearInterval(timer);
        this.isShow = false;
      }
    }, 1000);
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

&.rank{
  .test-level{
    color: @col-blue;
  }
}
&.live-lesson{
  .cont{
    padding: .9rem 0 .4rem;
  }
  .mobile{
    border: .01rem solid @col-gray;
    .wh(3.8rem,.7rem);
    line-height:.7rem;
    font-size: .3rem;
    padding:0 .2rem;
  }
  .warm{
    color: @col-lightred;
    font-size: .24rem;
    display: block;
    margin: .04rem 0 0 0;
  }
}
</style>
