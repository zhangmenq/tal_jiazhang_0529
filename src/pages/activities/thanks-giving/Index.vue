<template>
  <div class="thanks-giving">
    <div>
      <img src="../../../assets/thanks-giving-img13_01.png" width="100%"/>
      <div class="videoShow">
        <span @click="videoPlay()">&nbsp;</span>
      </div>
      <div class="marking-btn">
        <img src="../../../assets/thanks-giving-img14.png"/>
        <x-button @click.native="makeCard()">制作贺卡</x-button>
      </div>
    </div>
    <div class="video-dialog" v-show="videoShow">
      <div class="dialog-bg" @click="closeVideo()" @touchmove.prevent></div>
      <div class="video-show">
        <div class="loading" v-if="loading">
          <div class="sk-circle">
            <span class="sk-circle1 sk-child"></span>
            <span class="sk-circle2 sk-child"></span>
            <span class="sk-circle3 sk-child"></span>
            <span class="sk-circle4 sk-child"></span>
            <span class="sk-circle5 sk-child"></span>
            <span class="sk-circle6 sk-child"></span>
            <span class="sk-circle7 sk-child"></span>
            <span class="sk-circle8 sk-child"></span>
            <span class="sk-circle9 sk-child"></span>
            <span class="sk-circle10 sk-child"></span>
            <span class="sk-circle11 sk-child"></span>
            <span class="sk-circle12 sk-child"></span>
          </div>
        </div>
        <!-- poster="../../../../src/assets/fm2.png" -->
        <video class="videoPlay" id="vdo" poster="../../../../src/assets/fm2.png"
        x5-video-player-type="h5" x5-video-player-fullscreen="true"
         webkit-playsinline="true" x-webkit-airplay="true" controls="controls">
          <source src="https://v.vipx.com/4b68241d6279434c8bc3da3f197339aa/534e2f85b4654738bdf2545d360fc97a-3f737dd422d60bb969bee1fd69da8bf8-ld.mp4" type="video/mp4">
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';
// import { setTimeout } from 'timers';
import wechatMenu from '@/mixins/wechatMenu.js';

export default {
  components: {
    XButton,
  },
  data() {
    return {
      videoShow: false,
      loading: false,
    };
  },
  mixins: [wechatMenu],
  methods: {
    videoPlay() {
      this.videoShow = true;
      this.loading = true;
      const vdo = document.getElementById('vdo');
      vdo.play();
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    closeVideo() {
      this.videoShow = false;
      const vdo = document.getElementById('vdo');
      vdo.pause();
    },
    makeCard() {
      this.$router.push({
        name: 'thanksGivingMaking',
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../../styles/basic.less';
#app{background: #fff}
.thanks-giving{
  height: 100%;
  overflow: hidden;
  // .bg-m('@{img-path}/thanks-giving-img13_02.png');
  background: #fff url(../../../../src/assets/thanks-giving-img13_02.png) no-repeat;
  background-position: 0 bottom;
  background-size: 100%;
  .videoShow{
    position: relative;
    .wh(6.2rem,3.52rem);
    margin: -.2rem auto;
    .bg-m('@{img-path}/thanks-giving-img15.png');
    background-size: 100% 100%;
    span{
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      .wh(1.04rem,1.04rem);
      margin: -.52rem 0 0 -.52rem;
      .bg-m('@{img-path}/thanks-giving-img16.png');
      background-size: 100% 100%;
    }
  }
  .marking-btn{
    padding: .2rem 0;
    text-align: center;
    img{
      display: inline-block;
      width: 90%;
    }
    .weui-btn{
      .wh(2.45rem,.87rem);
      line-height: .87rem;
      color: @col-white;
      background: #73178d;
      font-size: .46rem;
      font-weight: bold;
      border-radius: .87rem;
      letter-spacing: .01rem;
      margin: 0 auto;
    }
  }
  .video-dialog{
    position: fixed;
    top: 0;
    left: 0;
    .wh(100%,100%);
    .dialog-bg{
      position: absolute;
      top: 0;
      left: 0;
      .wh(100%,100%);
      background: #000;
      opacity: .5;
      z-index: 1;
    }
    .video-show{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      .wh(6rem,4.5rem);
      margin: -2.5rem 0 0 -3rem;
      // z-index: 9;
      .loading{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        .wh(100%,100%);
        border-radius: .1rem;
        // background: #fff;
        font-size: .28rem;
        z-index: 10;
      }
      .videoPlay{
        position: relative;
        .wh(100%,100%);
        padding: 0;
        margin:0;
        // object-fit: fill;
        // .wh(6rem,4.5rem);
      }
    }
  }
}
.sk-circle {
  margin: 40px auto;
  width: 60px;
  height: 60px;
  position: relative;
}
.sk-circle .sk-child {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0; }
.sk-circle .sk-child:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 20%;
  height: 20%;
  background-color: #fff;
  border-radius: 100%;
  animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
}
.sk-circle .sk-circle2 {transform: rotate(40deg); }
.sk-circle .sk-circle3 {transform: rotate(80deg); }
.sk-circle .sk-circle4 {transform: rotate(120deg); }
.sk-circle .sk-circle5 {transform: rotate(160deg); }
.sk-circle .sk-circle6 {transform: rotate(200deg); }
.sk-circle .sk-circle7 {transform: rotate(240deg); }
.sk-circle .sk-circle8 {transform: rotate(280deg); }
.sk-circle .sk-circle9 {transform: rotate(320deg); }
.sk-circle .sk-circle2:before {animation-delay: -1.1s; }
.sk-circle .sk-circle3:before {animation-delay: -1s; }
.sk-circle .sk-circle4:before {animation-delay: -0.9s; }
.sk-circle .sk-circle5:before {animation-delay: -0.8s; }
.sk-circle .sk-circle6:before {animation-delay: -0.7s; }
.sk-circle .sk-circle7:before {animation-delay: -0.6s; }
.sk-circle .sk-circle8:before {animation-delay: -0.5s; }
.sk-circle .sk-circle9:before {animation-delay: -0.4s; }

@-webkit-keyframes sk-circleBounceDelay {
0%, 80%, 100% {transform: scale(0); }
40% {transform: scale(1); } }
@keyframes sk-circleBounceDelay {
0%, 80%, 100% {transform: scale(0); }
40% {transform: scale(1); } }

</style>
