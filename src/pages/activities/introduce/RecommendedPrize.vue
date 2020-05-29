<template>
  <div class="page-h">
    <Loading v-if="loading" loadingText="加载中"></Loading>
    <div class="recommeded-prize" v-else>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide>
          <div class="slide-one">
            <div class="poster-top-bg"></div>
            <div class="poster-bot-bg"></div>
            <div class="slide-one-cont">
              <span class="file" @click="toPosterpage()">
              </span><br/>
              点击制作宝贝的专属海报
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="slide-two">
            <div class="slide-two-box">
              <img v-if="posterUrl" :src="posterUrl[0]" class="share-img">
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="slide-two">
            <div class="slide-two-box">
              <img v-if="posterUrl" :src="posterUrl[1]" class="share-img">
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <p class="poster-title">个性化海报</p>
      <div class="activity-rules" @click="popUp = true">活动规则</div>
      <pop-up v-show="popUp" popType="rewards" @close="popUp = false"></pop-up>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from '@/api';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import mergeImages from 'merge-images';
import wechatMenu from '@/mixins/wechatMenu.js';
import creatQrcodeMixin from './creatQrcodeMixin';
import Loading from './Loading';
import PopUp from './PopUp';
import statisticsMixins from './statisticsMixins.js';

export default {
  components: {
    swiper,
    swiperSlide,
    Loading,
    PopUp,
  },
  mixins: [creatQrcodeMixin, wechatMenu, statisticsMixins],
  data() {
    return {
      loading: true,
      popUp: false,
      posterUrl: [],
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 80,
        pagination: {
          el: '.swiper-pagination',
          // clickable: true,
          type: 'fraction',
        },
      },
    };
  },
  async mounted() {
    await getUserInfo().then(() => {
      this.createQrcode();
    });
    await this.mergePoster();
  },
  methods: {
    mergePoster() {
      const imgArr = [6, 7];
      for (let i = 0; i < imgArr.length; i += 1) {
        mergeImages([
          { src: `/static/imgs/introduce-img${imgArr[i]}.png`, x: 0, y: 0 },
          { src: this.qrcodeUrl, x: 561, y: 1153 },
        ]).then((base64) => {
          this.posterUrl[i] = base64;
          if (i === imgArr.length - 1) {
            this.loading = false;
          }
        });
      }
    },
  },
};
</script>


<style lang="less">
@import '../../../styles/basic.less';
@import 'swiper/dist/css/swiper.css';
.page-h {
  height: 100%;
}
.recommeded-prize {
  position: relative;
  padding: .4rem 0;
  min-height: 100%;
  background: #f8f8f8;
  .poster-title {
    position: absolute;
    top: 9.1rem;
    text-align: center;
    width: 100%;
    font-size: .3rem;
  }
  .slide-one {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 8.3rem;
    font-size: .36rem;
    color: @col-purple;
    background: #eee1ff;
    .poster-top-bg {
      position: absolute;
      top: 0;
      left: 0;
      .wh(100%, 5.78rem);
      font-size: .36rem;
      .bg-m('@{img-path}/introduce-img2.png');
      background-size: 100%;
    }
    .poster-bot-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      .wh(100%, 1.9rem);
      .bg-m('@{img-path}/introduce-img3.png');
      background-size: 100%;
    }
    .slide-one-cont {
      text-align: center;
      .file {
        position: relative;
        display: inline-block;
        overflow: hidden;
        margin-bottom: .5rem;
        .wh(1.09rem, 1.09rem);
        .bg-m('@{img-path}/introduce-img4.png');
        background-size: 100%;
      }
    }
  }
  .slide-two {
    height: 11.4rem;
    .bg-m('@{img-path}/introduce-img5.png');
    background-position: center bottom;
    background-size: 5.79rem 2.24rem;
    .slide-two-box {
      // border: 1px solid #f60;
      height: 8.3rem;
      .share-img {
        display: block;
        margin: 0 auto;
        width: auto;
        height: 100%;
      }
    }
  }
  .swiper-slide {
    .wh(6.51rem, 100%);
  }
  .swiper-pagination {
    top: 8.65rem;
    left: auto;
    right: -2.8rem;
    font-size: .3rem;
    .swiper-pagination-current {
      font-size: .36rem;
      color: @col-purple;
    }
  }
  .activity-rules {
    position: fixed;
    bottom: .4rem;
    right: 0;
    z-index: 1;
    text-align: center;
    .wh(1.89rem, .76rem);
    line-height: .76rem;
    font-size: .3rem;
    color: @col-purple;
    background:rgba(255,255,255,1);
    border-radius: .38rem 0px 0px .38rem;
    border:1px solid rgba(154,87,200,1);
  }
}
</style>
