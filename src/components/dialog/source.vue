<template>
  <div class="common-dialog">
    <!-- 判断级别 -->
    <div class="dialog-box hintbutton-box rank hide">
      <em class="close">x</em>
      <p>
        您当前无级别，需要参加
        <router-link to="home" class="test-level">级别测试</router-link>
      </p>
      <x-button mini :gradients="['#426ffe', '#40bbff']">参加</x-button>
      <x-button mini class="gray">暂不参加</x-button>
    </div>
    <!-- 直播课取消预约 -->
    <div class="dialog-box hintbutton-box hide">
      <em class="close">x</em>
      <p>您确定取消预约么</p>
      <x-button mini class="gray">确定</x-button>
      <x-button mini :gradients="['#426ffe', '#40bbff']">在想想</x-button>
    </div>
    <!-- 直播课短信服务 -->
    <div class="dialog-box hintbutton-box live-lesson hide">
      <em class="close">x</em>
      <div class="cont">
        手机号：<input type="text" name="" class="mobile"/>
        <em class="warm">*享受课前短信提醒服务</em>
      </div>
      <x-button mini :gradients="['#426ffe', '#40bbff']">确定</x-button>
    </div>
    <!-- 选择时间 -->
    <div class="dialog-box hint-box hide">
      <p>
        <i class="icon warn">!</i>
        您手慢了一步，请重新选择~
      </p>
    </div>
    <!-- 预约成功 -->
    <div class="dialog-box hint-box">
      <p>
        <i class="icon succeed">&nbsp;</i>
        预约成功，请按时收看~
      </p>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';

export default {
  components: {
    XButton,
  },
};
</script>

<style lang="less" scoped>
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
