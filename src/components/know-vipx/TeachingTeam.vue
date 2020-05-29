<template>
  <div class="teaching-team">
    <dl>
      <dt>
        <img src="../../../static/imgs/know/team_icon.png" alt="">
      </dt>
      <dd>
        <h4>严格筛选</h4>
        <p>北美外教，6轮筛选，录取率低于4.5%</p>
      </dd>
    </dl>
    <dl>
      <dt>
        <img src="../../../static/imgs/know/team_icon1.png" alt="">
      </dt>
      <dd>
        <h4>优质师资</h4>
        <p>高等教育学历背景，多年执教经验</p>
        <p>具有TEFL、TESOL、TKT等国际权威证书</p>
        <p>精通美国文学、艺术，拥有全球化国际视野</p>
      </dd>
    </dl>
    <dl>
      <dt>
        <img src="../../../static/imgs/know/team_icon2.png" alt="">
      </dt>
      <dd>
        <h4>专属双外教</h4>
        <p>每一学生匹配两位专属外教</p>
        <p>双倍教学效果</p>
        <p>专属学习体验</p>
      </dd>
    </dl>
    <h3 class="team-title">
      <span>高密度培训，严格系统性教师培训</span>
    </h3>
    <div class="team-swiper">
      <swiper :options="swiperOption">
        <swiper-slide>
          <div class="swiper-img">
            <img src="../../../static/imgs/know/teaching_team_img1.png" alt="">
            <span>专业培训</span>
          </div>
          <p>与全球顶尖出版社美国国家地理学习 定制教师培训课程</p>
        </swiper-slide>
        <swiper-slide>
          <div class="swiper-img">
            <img src="../../../static/imgs/know/teaching_team_img2.png" alt="">
            <span>集体备课</span>
          </div>
          <p>每月2次全体教师培训 不断提升教学水平</p>
        </swiper-slide>
        <swiper-slide>
          <div class="swiper-img">
            <img src="../../../static/imgs/know/teaching_team_img3.png" alt="">
            <span>教师验收</span>
          </div>
          <p>每周1次课程评估，根据家长反馈跟踪课程效果</p>
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

.teaching-team{
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
  h3.team-title{
    margin: .76rem 0 .4rem;
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
  .team-swiper {
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
