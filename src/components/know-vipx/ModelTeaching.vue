<template>
  <div class="model-teaching">
    <dl>
      <dt>
        <img src="../../../static/imgs/know/model_icon.png" alt="">
      </dt>
      <dd>
        <h4>固定老师+固定时间</h4>
        <p>专属外教 每周固定时间上课</p>
        <p>培养习惯 长期学习更有效</p>
      </dd>
    </dl>
    <dl>
      <dt>
        <img src="../../../static/imgs/know/model_icon1.png" alt="">
      </dt>
      <dd>
        <h4>40分钟深度学习</h4>
        <p>多互动多开口 多学新知</p>
        <p>沉浸每一堂课 学习更高效</p>
      </dd>
    </dl>
    <h3 class="model-title">
      <span>纯正美式课程</span>
    </h3>
    <div class="model-swiper">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item, index) in swiperItem" :key="index">
          <div class="swiper-img">
            <img :src="'../../../static/imgs/know/model_teaching_img' + (index+1) + '.png'" alt="">
            <span>{{item.title}}</span>
          </div>
          <p>{{item.text}}</p>
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
      swiperItem: [
        { title: '探索新知（10-15分钟）', text: '掌握课堂核心单词，解决初阶记忆问题，保证有效互动，让课堂更聚焦。' },
        { title: '北美外教文学通识课（40分钟）', text: '对应1V1课程内容，融入百科知识、阅读策略和思维技能，助力学生在1V1课上深度思考。' },
        { title: '在线1v1美国语文课（40分钟）', text: '1V1教学和外教高频互动，学习小说、科普等多种体裁文章，听说读写全面提高英语能力。' },
        { title: '蓄能巩固（10-15分钟）', text: '美国国家地理辅助学习资料，深度匹配1V1课和文学通识课，实现思维延伸，保证学习效果。' },
        { title: '电子在线图书馆（10-15分钟）', text: '美国国家地理学习全套原版文学、图片、视听资源，海量泛读素材帮助学生培养阅读习惯，拓展文化视野。' },
      ],
    };
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
@import 'swiper/dist/css/swiper.css';

.model-teaching{
  dl{
    font-size: .26rem;
    padding: .6rem .6rem 0 .4rem;
    display: flex;
    img{
      .wh(100%,100%);
    }
    dt{
      .wh(1.04rem,1.04rem);
      margin-right: .24rem;
    }
    dd{
      flex: 1.14rem  1;
      text-align: left;
      h4{
        font-size: .34rem;
        color: @new-col-title-dark;
        font-weight: bold;
        line-height: .48rem;
        margin-bottom: .1rem;
      }
    }
    p{
      text-align: left;
      color:#999999;
      line-height: .46rem;
    }
  }
  h3.model-title{
    margin: 1.1rem 0 .4rem;
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
  .model-swiper {
    margin: 0 auto .42rem;
    .wh(6.7rem, 7rem);
    .swiper-wrapper {
      .wh(100%, 6.5rem);
    }
  }
  .swiper-wrapper .swiper-slide {
    width: 5.44rem!important;
    height: 5.58rem;
    box-shadow: 0 .02rem .08rem 0 rgba(136,73,248,0.46);
    border-radius: .1rem;
    .swiper-img{
      position: relative;
      .wh(5.44rem, 3.72rem);
      display: inline-block;
      img{
        .wh(100%, 100%);
        display: inline-block;
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
    p{
      padding: .1rem .18rem;
      font-size: .26rem;
      color: @new-col-font-gray;
      line-height: .37rem;
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
