<template>
  <div class="training-goal">
    <h3 class="goal-title">
      <span>未来世界公民应具备</span>
    </h3>
    <div class="citizens-have">
      <p>我们希望孩子不仅能用英语讲、用英语想，更能用英语探索世界的未知。</p>
    </div>
    <h3 class="goal-title">
      <span>我们的目标</span>
    </h3>
    <div class="goal-swiper">
      <swiper :options="swiperOption">
        <swiper-slide>
          <div class="swiper-img">
            <img src="../../../static/imgs/know/training_img1.png" alt="">
            <span>培养流利，自信的英语表达者——语言基础</span>
          </div>
          <ul class="goal-list">
            <li>美国国家地理原版教材</li>
            <li>涵盖50多种阅读策略</li>
            <li>原汁原味的在线美国课堂</li>
            <li>高效语言表</li>
          </ul>
        </swiper-slide>
        <swiper-slide>
          <div class="swiper-img">
            <img src="../../../static/imgs/know/training_img2.png" alt="">
            <span>培养批判，创新的思想者——思维品质</span>
          </div>
          <ul class="goal-list">
            <li>覆盖60多种思维方式</li>
            <li>采用主动学习、思维导图教学法</li>
            <li>培养批判性、创新性等思维能力</li>
            <li>学会发现问题、分析问题并解决问题</li>
          </ul>
        </swiper-slide>
        <swiper-slide>
          <div class="swiper-img">
            <img src="../../../static/imgs/know/training_img3.png" alt="">
            <span>培养多元，未知世界的探索者——文化意识</span>
          </div>
          <ul class="goal-list">
            <li>包含多元化领域的世界知识</li>
            <li>理解中外文化，培养对祖国文化认同感及自信</li>
            <li>构建正确的跨文化认知、态度和行为</li>
          </ul>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 50,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
        },
      },
    };
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
@import 'swiper/dist/css/swiper.css';

.training-goal{
  h3.goal-title{
    margin: .35rem 0 .4rem;
    text-align: center;
    span{
      position: relative;
      font-size: .36rem;
      color: @new-col-title-dark;
      &::before{
        position: absolute;
        left: -.2rem;
        top: .1rem;
        content: "";
        display: block;
        .wh(.4rem, .2rem);
        background:rgba(136,73,248,0.21);
        border-radius: .09rem;
      }
      &::after{
        position: absolute;
        right: -.2rem;
        top: .1rem;
        content: "";
        display: block;
        .wh(.4rem, .2rem);
        background:rgba(136,73,248,0.21);
        border-radius: .09rem;
      }
    }
  }
  .citizens-have{
    margin: 0 auto;
    padding: 3.8rem .18rem 0 .28rem;
    .wh(6.7rem, 5.01rem);
    box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.1);
    border-radius: .1rem;
    background: url('../../../static/imgs/know/citizens_have.png') no-repeat center .34rem;
    p{
      font-size: .26rem;
      color: @new-col-font-gray;
      line-height: .37rem;
    }
  }
  .goal-swiper {
    margin: 0 auto .42rem;
    .wh(6.7rem, 7rem);
    .swiper-wrapper {
      .wh(100%, 6.5rem);
    }
  }
  .swiper-wrapper .swiper-slide {
    width: 5.44rem!important;
    height: 5.58rem;
    // .wh(5.4rem, 5.58rem);
    box-shadow: 0 .02rem .08rem 0 rgba(136,73,248,0.46);
    border-radius: .1rem;
    .swiper-img{
      position: relative;
      .wh(5.44rem, 3.72rem);
      img{
        .wh(100%, 100%);
      }
      span{
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        padding: 0 .2rem;
        .wh(100%, .68rem);
        font-size: .26rem;
        color: @new-col-title-dark;
        line-height: .68rem;
        background:rgba(255,255,255,.8);
      }
    }
    ul.goal-list{
      padding: .1rem .18rem;
      li{
        font-size: .26rem;
        color: @new-col-font-gray;
        line-height: .37rem;
        &::before{
          content: '';
          display: inline-block;
          margin: 0 .1rem .05rem 0;
          .wh(.1rem, .1rem);
          border-radius: 50%;
          background-color: @new-col-font-gray;
        }
      }
    }
  }
  .swiper-slide:nth-child(2n) {
    width: 60%;
  }
  .swiper-slide:nth-child(3n) {
    width: 40%;
  }
  .swiper-pagination-bullets {
    bottom: .2rem;
    .swiper-pagination-bullet {
      margin: 0 .1rem;
      .wh(.1rem, .1rem);
      background: #EDEDED;
      opacity: 1;
    }
    .swiper-pagination-bullet-active{
      .wh(.26rem, .1rem);
      background: @new-col-title-purple;
      border-radius:5px;
    }
  }
}
</style>
