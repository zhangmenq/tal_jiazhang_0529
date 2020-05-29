<template>
  <div class="peiyou-home">
    <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
      <!-- slides -->
      <swiper-slide>
        <div class="section section1">
          <div class="bg-img"></div>
          <div class="section-item">
            <div class="item-top">
              <div class="narrow">
                <div class="h1">
                  纯正美式课堂<br>把世界带进我家
                </div>
                <p class="border">
                  Original American Class brings<br>the world to my home
                </p>
              </div>
            </div>
          </div>
          <a class="arrow icon"></a>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="section section2">
          <div class="section-item">
            <div class="item-top">
              <div class="narrow">
                <div class="h1">
                  纯正美式课堂
                </div>
                <p class="border">
                  每一堂课都不简单<br>15年教学经验用心打磨<br>每周80分钟纯正美式课堂
                </p>
              </div>
            </div>
            <div class="item-box">
              <img src="../../assets/peiyou-home-bg2-img1.jpg" alt="">
              <div class="content">
                <div class="h4">
                  固定老师+固定时间
                </div>
                <p>
                  专属外教<br>
                  每周固定时间上课<br>
                  培养习惯<br>
                  长期学习更有效
                </p>
                <em class="icon teacher"></em>
              </div>
            </div>
            <div class="item-box">
              <div class="content">
                <div class="h4">
                  一周两次，每次40分钟
                </div>
                <p>
                  多互动多开口<br>
                  多学新知<br>
                  沉浸每一堂课<br>
                  学习更高效
                </p>
                <em class="icon time"></em>
              </div>
              <img src="../../assets/peiyou-home-bg2-img2.jpg" alt="">
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="section section3">
          <div class="bg-img"></div>
          <div class="section-item">
            <div class="item-top">
              <div class="h1 border">
                纯正原版教材
              </div>
              <p class="border">
                自编教材永远不是我们的选择，原版教材也不会是我们的终点，15年的教育研究之后，我们明白原版教材不仅仅是语料而已，而应是全套的学习体系、课上课后的全覆盖，我们明白原版教材语料背后的文化思考、思维培养才是让学生受益一生的。
              </p>
            </div>
            <div class="item-box">
              <div class="btn-material">美国国家地理原版教材Reach</div>
              <p>美国国家地理出版社研发<br>美国本土重点学校使用的教材<br>对标美国共同核心州立标准（CCSS）的最新教材<br>美国小学原版教材，同步美国学生学习速度</p>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="section section4">
          <div class="bg-img"></div>
          <div class="section-item">
            <div class="item-top">
              <div class="narrow">
                <div class="h1 border">
                  纯正北美外教
                </div>
                <p class="border">
                  我们选的每一位外教都不简单<br>
                  懂教育的北美好外教是基础<br>
                  全球顶级师资是从未停止的追求
                </p>
              </div>
            </div>
            <div class="item-box">
              <div class="content">
                <div class="h4">
                  专属双外教
                </div>
                <p>
                  北美优质外教+藤校明星外教<br>
                  在VIPX，每一位学生,会匹配两位专属外教<br>
                  确保双倍教学效果,专属学习体验
                </p>
              </div>
            </div>
            <div class="item-box">
              <div class="content">
                <div class="h4">
                  孩子的固定专属外教
                </div>
                <p>
                  <strong>专属教师 · </strong>量身打造专属学习方案，真正做到因材施教<br>
                  <strong>长期陪伴 · </strong>更懂孩子的每一点兴趣，免去妈妈的约课烦恼
                </p>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="section section5">
          <div class="bg-img"></div>
          <div class="section-item">
            <div class="item-top">
              <div class="narrow">
                <div class="h1 border">
                  纯正培养目标
                </div>
                <p class="border">
                  英语教育不只是学语言那么简单，纯正美国课堂，让英语超越语言，成为一种思维方式，培养具备双语能力，融知识、思维、态度和价值观于一体的新时代未来公民。
                </p>
              </div>
            </div>
            <ul class="item-box">
              <li>
                <div class="inner">
                  <div class="h4">
                    文化意识
                  </div>
                  <p>
                    培养多元、<br>未知世界的探索者
                  </p>
                </div>
              </li>
              <li>
                <div class="inner">
                  <div class="h4">
                    思维品质
                  </div>
                  <p>
                    培养批判、创新的思想者
                  </p>
                </div>
              </li>
              <li>
                <div class="inner">
                  <div class="h4">
                    语言基础
                  </div>
                  <p>
                    培养流利、自信的英语表达者
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="section section6">
          <div class="bg-img"></div>
          <div class="section-item">
            <div class="item-top">
              <div class="h1 border gray">
                纯正美国测评
              </div>
              <p class="border gray">
                引入第三方美国本土、原版同步阅读能力测评，是我们对于学习效果的自信。我们深知，只有真正的学习效果，才能让家长放心；只有真正的学习进步，才是孩子持续学习的原动力。科学的测评，构筑健康的学习闭环。
              </p>
            </div>
            <ul class="item-box">
              <div class="btn-test">STAR测评</div>
              <p>全美超过6万所学校都在用<br>与美国同龄孩子阅读能力对标<br>在读学员专享免费测评，让学习效果看得见</p>
            </ul>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="section section7">
          <div class="bg-img"></div>
          <div class="section-item">
            <div class="item-top">
              <div class="h1">
                四大安心承诺<br>做教育有态度更有温度
              </div>
            </div>
            <ul class="item-box">
              <li>
                <div class="content">
                  <div class="h4">
                    专属辅导老师
                  </div>
                  <p>
                    7X24专属私人辅导老师<br>全程跟进学习效果<br>随时帮您解决问题
                  </p>
                  <div class="num">
                    01
                    <em class="icon service1"></em>
                  </div>
                </div>
              </li>
              <li>
                <div class="content">
                  <div class="h4">
                    无理由退费
                  </div>
                  <p>
                    对课程或服务不满意<br>可随时退费投诉<br>第二次课前可无条件全额退款
                  </p>
                  <div class="num">
                    02
                    <em class="icon service2"></em>
                  </div>
                </div>
              </li>
              <li>
                <div class="content">
                  <div class="h4">
                    安心透明课堂
                  </div>
                  <p>
                    100%透明课堂<br>家长随时回看课程<br>孩子的学习状态，家长尽在掌握
                  </p>
                  <div class="num">
                    03
                    <em class="icon service3"></em>
                  </div>
                </div>
              </li>
              <li>
                <div class="content">
                  <div class="h4">
                    无忧调课转班
                  </div>
                  <p>
                    课前一键轻松调转<br>紧急调换课有专属老师贴心安排<br>妈妈再也不用担心错过课程
                  </p>
                  <div class="num">
                    04
                    <em class="icon service4"></em>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="nav-bot" v-if="curIndex !== 0 && pyUid">
      <div class="txt-box">
        <div class="h6">报名价值288元体验周，仅需18元</div>
        <p class="tips">仅限即将升入幼儿园大班及1-4年级学员</p>
      </div>
      <div class="btn-fn">
        <a class="btn-get" v-on:click="goBind()">立即报名</a>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'peiyouTopic',
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 1,
        mousewheel: true,
        height: document.documentElement.clientHeight,
        on: {
          slideChangeTransitionStart: () => {
            this.curIndex = this.swiper.activeIndex;
          },
        },
      },
      uid: '',
      cityCode: '',
      curIndex: 0,
    };
  },
  methods: {
    goBind() {
      this.$router.push({
        name: 'bindMobile',
        query: {
          uid: this.uid,
          cityCode: this.cityCode,
        },
      });
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    pyUid() {
      if (this.$route.query.uid) {
        return this.$route.query.uid;
      }
      return '';
    },
  },
  mounted() {
    this.swiper.slideTo(0, 1000, false);
    if (this.$route.query.uid && this.$route.query.cityCode) {
      this.uid = this.$route.query.uid.replace(/\s/g, '+');
      this.cityCode = this.$route.query.cityCode;
    }
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
@import 'swiper/dist/css/swiper.css';

.peiyou-home{
  @col-h-gray: #323232;
  @col-h-yellow: #fdd22b;
  position: relative;
  height: 100%;
  .nav-bot{
    z-index: 2;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: .2rem .3rem 0;
    .wh(100%,1.1rem);
    background-color: rgba(0,0,0,.7);
    color: #fff;
    .txt-box{
      .h6{
        font-size: .3rem;
        margin-bottom: .1rem;
        line-height: .3rem;
      }
      .tips{
        position: relative;
        padding: 0 .2rem;
        height: .36rem;
        line-height: .34rem;
        border: .01rem solid #ffc453;
        border-radius: .3rem;
        font-size: .2rem;
        color: #ffc453;
      }
    }
    .btn-get{
      display: block;
      margin-top: .05rem;
      .wh(1.8rem,.6rem);
      line-height: .58rem;
      border-radius: .08rem;
      text-align: center;
      font-size: .34rem;
      color: #fff;
      border: .01rem solid #fff;
    }
  }
  .swiper-box,.section,.layer,.section-item {
    .wh(100%,100%);
  }
  .swiper-slide {
    height: 100%;
  }
  .section{
    position: relative;
    font-size: .3rem;
    // .layer{
    //   .pos-box(100%,100%);
    //   left: 0;
    //   top: 0;
    //   background-color: rgba(0,0,0,.7);
    // }
    .icon{
      display: inline-block;
      vertical-align: middle;
      .wh(.83rem,.83rem);
      .bg-m('@{img-path}/peiyou-home-icon.png');
      background-size: .83rem 5.81rem;
      &.arrow{
        .pos-box-lc(.83rem,.83rem);
        bottom: .4rem;
        background-position: center -4.98rem;
      }
      &.teacher{
        position: absolute;
        left: .2rem;
        bottom: .2rem;
        background-position: center 0rem;
      }
      &.time{
        position: absolute;
        right: .2rem;
        bottom: .2rem;
        background-position: center -.83rem;
      }
      &.service1, &.service2, &.service3, &.service4{
        position: absolute;
        right: 0;
        bottom: 0;
      }
      &.service1{
        background-position: center -1.66rem;
      }
      &.service2{
        background-position: center -2.49rem;
      }
      &.service3{
        background-position: center -3.32rem;
      }
      &.service4{
        background-position: center -4.15rem;
      }
    }
    .bg-img{
      .pos-box(100%,100%);
    }
    .section-item{
      position: relative;
      padding: 0 .5rem 1.2rem;
      color: @col-h-gray;
      p{
        line-height: .4rem;
        font-size: .24rem;
        &.border{
          position: relative;
          padding-bottom: .25rem;
          &:before{
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            .wh(100%,.02rem);
            background-color: #fff;
          }
          &.gray{
            &:before{
              background-color: rgba(47,47,47,1);
            }
          }
        }
        &.italic{
          font-style: italic;
        }
        &.hot-line{
          margin-top: .3rem;
          text-align: center;
          line-height: .36rem;
          color: #fff;
        }
      }
      .item-box{
        .content{
          position: relative;
          flex: 1;
          padding: .2rem .25rem;
          .h4{
            margin-bottom: .17rem;
            padding-bottom: .15rem;
            border-bottom: .01rem solid @col-h-gray;
          }
        }
      }
      .item-top{
        overflow: hidden;
        padding-top: 1.3rem;
        color: #fff;
        p{
          font-size: .28rem;
        }
        .narrow{
          display: inline-block;
          overflow: hidden;
          .h1{
            &:before{
              width: .97rem;
            }
            &:after{
              left: 1.01rem;
            }
          }
        }
      }
    }
    .h1{
      position: relative;
      margin-bottom: .25rem;
      padding-bottom: .25rem;
      line-height: .7rem;
      font-size: .52rem;
      color: #fff;
      &:before,&:after{
        content: '';
        position: absolute;
        bottom: 0;
        height: .07rem;
      }
      &:before{
        left: 0;
        width: 1.2rem;
        background-color: #fff;
      }
      &:after{
        left: 1.24rem;
        width: 100%;
        background-color: rgba(255,255,255,.5);
      }
      &.gray{
        &:before{
          background-color: rgba(47,47,47,1);
        }
        &:after{
          background-color: rgba(47,47,47,.5);
        }
      }
    }
    .h4{
      position: relative;
      margin-bottom: .2rem;
      line-height: .3rem;
      font-size: .25rem;
      &:before,&:after{
        display: none;
        content: '';
        position: relative;
        top: -.02rem;
        vertical-align: middle;
        .wh(.06rem,.4rem);
        background: @col-purple;
      }
    }
    .btn-purple{
      display: block;
      margin: 0 auto .4rem;
      .wh(100%,.7rem);
      line-height: .7rem;
      border-radius: .35rem;
      background: @col-purple;
      text-align: center;
      font-size: .36rem;
      color: #fff;
      &:first-of-type{
        margin-top: 2rem;
      }
    }
    &.section1{
      .bg-m('@{img-path}/peiyou-home-bg.jpg');
      background-size: 100% 100%;
      .bg-img{
        .bg-m('@{img-path}/peiyou-home-bg1.png');
        background-size: 100% auto;
      }
    }
    &.section2{
      .bg-m('@{img-path}/peiyou-home-bg2.png');
      background-size: 100% auto;
      background-color: #000;
      .section-item{
        .item-top{
          margin-bottom: .6rem;
        }
        .item-box{
          display: flex;
          justify-content: space-between;
          margin-bottom: .25rem;
          .wh(100%,2.73rem);
          background-color: rgba(255,255,255,.7);
          img{
            display: block;
            .wh(2.73rem,2.73rem);
          }
          &:nth-child(2){
            text-align: right;
          }
        }
      }
    }
    &.section3{
      .bg-m('@{img-path}/peiyou-home-bg3.jpg');
      background-size: 100% 100%;
      .bg-img{
        .bg-m('@{img-path}/peiyou-home-bg3.png',0,0);
        background-size: 4.7rem 7.14rem;
      }
      .section-item{
        .h1{
          min-height: 3.2rem;
          .bg-m('@{img-path}/peiyou-home-bg3-cover.png',right,-.5rem);
          background-size: 3.06rem 3.06rem;
        }
        .btn-material{
          margin: .4rem 0 .2rem;
          .l-h(.7rem);
          background-color: @col-h-yellow;
          text-align: center;
          color: @col-purple;
          font-size: .3rem;
        }
        .btn-material + p{
          text-align: center;
          color: #fff;
        }
      }
    }
    &.section4{
      .bg-m('@{img-path}/peiyou-home-bg.jpg');
      background-size: 100% 100%;
      .bg-img{
        .bg-m('@{img-path}/peiyou-home-bg4.png');
        background-size: 100% auto;
      }
      .section-item{
        .item-top{
          margin-bottom: .9rem;
        }
        .item-box{
          margin-bottom: .25rem;
          text-align: center;
          background-color: rgba(255,255,255,.7);
          .content{
            padding: .35rem .2rem;
          }
          &:nth-child(2){
            .content{
              display: inline-block;
            }
          }
          &:nth-child(3){
            p{
              text-align: left;
            }
          }
        }
      }
    }
    &.section5{
      background-color: #fff;
      .bg-img{
        .bg-m('@{img-path}/peiyou-home-bg5.png',0,-.01rem);
        background-size: 100% auto;
      }
      .section-item{
        .item-top{
          padding-top: 1.9rem;
        }
        .item-box{
          margin: .6rem auto 0;
          padding-top: 1rem;
          .wh(5.84rem,5.08rem);
          .bg-m('@{img-path}/peiyou-home-bg5-shape.png');
          background-size: 5.84rem 5.08rem;
          text-align: center;
          li{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 1.3rem;
            &:first-of-type{
              height: 1.56rem;
            }
          }
          .h4{
            margin-bottom: .06rem;
            color: @col-h-yellow;
          }
          p{
            color: #fff;
          }
        }
      }
    }
    &.section6{
      .bg-m('@{img-path}/peiyou-home-bg6.png',left,bottom);
      background-size: 100% auto;
      background-color: #fff;
      .bg-img{
        .bg-m('@{img-path}/peiyou-home-bg6-top.png',left,-1.4rem);
        background-size: 100% auto;
      }
      .section-item{
        .item-top{
          padding-top: 1.9rem;
        }
        .item-top,.h1{
          color: @col-h-gray;
        }
        .h1{
          height: 3.4rem;
        }
        .item-box{
          .btn-test{
            margin: .4rem 0 .2rem;
            .l-h(.7rem);
            background-color: @col-h-yellow;
            text-align: center;
            color: @col-purple;
            font-size: .3rem;
          }
          .btn-test + p{
            text-align: center;
          }
        }
      }
    }
    &.section7{
      .bg-m('@{img-path}/peiyou-home-bg7.png');
      background-size: 100% auto;
      background-color: #000;
      .section-item{
        padding: 0 .2rem 1.1rem;
        .item-top{
          padding-top: 1.9rem;
        }
        .h1{
          &:before,&:after{
            display: none;
          }
        }
        .item-box{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin: .4rem 0 0;
          .content{
            padding: 0;
            .h4{
              margin-bottom: .1rem;
            }
          }
          li{
            margin: .1rem;
            padding: .2rem;
            .wh(47%,3.26rem);
            background-color: rgba(255,255,255,.7);
          }
          p{
            padding-bottom: .1rem;
            font-size: .2rem;
          }
          .num{
            position: relative;
            line-height: .86rem;
            font-size: .86rem;
            color: #fff;
          }
        }
      }
    }
  }
  .swiper-slide-active{
    .section{
      .arrow{
        animation: arrow 1s ease-in-out .3s infinite;
      }
    }
  }
  @keyframes arrow {
    from {
      opacity: .2;
      transform: translate3d(0, 0, 0);
    }
    10% {
      opacity: 1;
      transform: translate3d(0, .04rem, 0);
    }
    to {
      opacity: 0;
      transform: translate3d(0, .16rem, 0);
    }
  }
}
</style>
