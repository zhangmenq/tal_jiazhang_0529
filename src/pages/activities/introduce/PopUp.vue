<template>
  <div class="pop-up">
    <div class="pop-up-bg"></div>
    <div class="pop-up-box bonus" v-if="popType === 'rewards'">
      <div class="pop-up-close" @click="closeBtn()"></div>
      <div class="bonus-content">
        <h2>奖励说明</h2>
        <p>
          一、推荐人在公众号生成自己的海报，分享给好友。<br>
          二、1个好友领取体验课，推荐人获取1张10元优惠券，依次累加。<br>备注：被推荐人必须扫码推荐人专属海报进入页面，输入信息确定后，推荐人即可拿到10元优惠券。<br>
          三、被推荐人（新学员）只要通过推荐人二维码体验并报名了VIPX长期班（单学段不少于10次课），上完长期班的第二次课后，推荐人即可获得200元优惠券。同时被推荐人（新学员）获得100元优惠券，新学员仅能获得一次被推荐优惠券。<br>
          四、该奖励活动时间：2018年12月19日-2019年2月28日<br>
          五、活动优惠券使用时间：2019年5月1日-2019年7月1日。
        </p>
      </div>
    </div>
    <div class="pop-up-box file-limit" v-else-if="popType === 'image'">
      <div class="file-limit-content">
        <h2>图片不符合要求，请重新选择~</h2>
        <p>图片支持格式：JPEG、PNG;<br/>支持大小：5M以下</p>
        <x-button @click.native="closeBtn()">我知道了</x-button>
      </div>
    </div>
    <div class="pop-up-box qualification" v-else-if="popType === 'qualification'">
      <div class="pop-up-close popup-close-bg" @click="closeBtn()"></div>
      <h2>&nbsp;</h2>
      <p>您好，本活动暂时只对VIPX在读学员或以往在读学员开放，感谢您对VIPX的关注，后续活动敬请期待。</p>
    </div>
    <div class="pop-up-box gesture" v-else-if="popType === 'gesture'">
      <h3>&nbsp;</h3>
      <p>将照片放大或缩小 并移动到合适的位置</p>
      <x-button @click.native="closeBtn()">我知道了</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';

export default {
  components: {
    XButton,
  },
  props: {
    popType: {
      type: String,
      default: 'rewards',
    },
  },
  methods: {
    closeBtn() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';

.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 110;
  .wh(100%, 100%);
  .pop-up-bg {
    position: absolute;
    top: 0;
    left: 0;
    .wh(100%, 100%);
    background: #000;
    opacity: .6;
  }
  .pop-up-box {
    position: absolute;
    top: 50%;
    left: 50%;
    background: @col-white;
    border-radius: .1rem;
    .pop-up-close{
      position: absolute;
      top: .44rem;
      right: .58rem;
      .wh(.23rem, .23rem);
      .bg-m('@{img-path}/introduce-close1.png');
      background-size: .23rem .23rem;
      &.popup-close-bg {
        .wh(.3rem, .3rem);
        top: .2rem;
        right: .2rem;
        .bg-m('@{img-path}/introduce-img8.png');
        background-size: .3rem .3rem;
        &:before {
          display: none;
        }
      }
    }
  }
  .bonus {
    margin: -4.3rem 0 0 -3.3rem;
    .wh(6.6rem, 8.6rem);
    h2 {
      text-align: center;
      padding: .3rem 0 0;
    }
    p {
      padding: .35rem .4rem .4rem;
      font-size: .3rem;
      line-height: .42rem;
    }
  }
  .file-limit {
    .wh(6.5rem, 4rem);
    margin: -2rem 0 0 -3.25rem;
    .file-limit-content {
      padding: .5rem .7rem 0;
      p{
        font-size: .26rem;
        padding: .2rem 0 .4rem;
      }
      .weui-btn {
        margin: 0 auto;
        .wh(2.4rem, .8rem);
        color: @col-white;
        font-size: .36rem;
        background: @col-purple;
      }
    }
  }
  .qualification{
    .wh(6.5rem, 5rem);
    margin: -2.5rem 0 0 -3.25rem;
    h2 {
      height: 1.66rem;
      .bg-m('@{img-path}/introduce-img7.png');
      background-size: 100%;
    }
    p {
      padding: .9rem;
      font-size: .3rem;
      line-height: .42rem;
    }
  }
  .gesture {
    .wh(3.42rem, 6.6rem);
    background: none;
    margin: -3.3rem 0 0 -1.71rem;
    h3 {
      .wh(3.42rem, 3.84rem);
      .bg-m('@{img-path}/introduce-img11.png');
      background-size: 100%;
    }
    p {
      margin: .2rem 0 .42rem;
      font-size: .36rem;
      color: @col-white;
    }
    .weui-btn {
        margin: 0 auto;
        border-radius: .38rem;
        .wh(2.3rem, .76rem);
        color: @col-white;
        font-size: .3rem;
        background: @col-purple;
      }
  }
}
</style>
