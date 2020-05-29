<template>
  <div class="assure-system">
      <div>
          <h2 class="system-title"> 
            <span class="title-bg">设备要求</span>
          </h2>
          <dl class="reach-text">
            <dt>
                <img src="../../../static/imgs/know/w-pc.png" alt="">
              </dt>
              <dd>
                <h2>Windows pc 版</h2>
                <ul>
                  <li>
                    <span class="spot spot-col"></span>
                    <span class="text text-col">操作系统：Windows7以上操作系统 </span>
                  </li>
                  <li>
                    <span class="spot spot-col"></span>
                    <span class="text text-col">暂不支持Apple Mac OS（苹果系统）</span>
                  </li>
                  <li>
                    <span class="spot"></span>
                    <span class="text">网络运营商：推荐使用联通、电信网络运营商 </span>
                  </li>
                  <li>
                    <span class="spot"></span>
                    <span class="text">网络连接：推荐使用网线连接电脑（无线网 络，信号需要满格）</span>
                  </li>
                  <li>
                    <span class="spot"></span>
                    <span class="text">下载方式：登录官网www.vipx.com , 点击客户端->选择“下载到电脑”即可</span>
                  </li>
                </ul>
            </dd>
          </dl>
          <dl class="reach-text">
            <dt>
                <img src="../../../static/imgs/know/ipad.png" alt="">
              </dt>
              <dd>
                <h2>iPad版</h2>
                <ul>
                  <li>
                    <span class="spot spot-col"></span>
                    <span class="text text-col">系统要求：ios 8.0以上系统 </span>
                  </li>
                  <li>
                    <span class="spot spot-col"></span>
                    <span class="text text-col">硬件要求：推荐iPad mini2及以上，iPad3以上</span>
                  </li>
                  <li>
                    <span class="spot"></span>
                    <span class="text">下载方式：访问APP Store搜索“VIPX”下载</span>
                  </li>
                </ul>
            </dd>
          </dl>
    </div>
    <div class="step-box">
      <h2 class="system-title"> 
            <span class="title-bg">预约体验课流程</span>
      </h2>
      <div class="step-item">
        <img src="../../../static/imgs/know/step.png" alt="">
      </div>
      <div class="text-box">
        <div class="text-item">预约体验课， 选择上课时间</div>
        <div class="text-item">专属学习顾问 一对一服务</div>
        <div class="text-item last-item">进入教室 正式上课</div>
      </div>
    </div>
    <div class="bottom-info">
      <p>课程顾问为您服务 </p>
      <p>4008002211转9 (8:00~21:00)</p>
    </div>
  </div>

</template>

<script>
export default {
  components: {},
  props: {},
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
@import "../../styles/basic.less";
.assure-system{
  margin: .6rem auto 0;
  text-align: center;
  color:@new-text-gray;
  padding-bottom: 0.23rem;
  .system-title{
    font-size:.36rem;
    font-weight:bold;
    color:@new-col-title-dark;
    line-height:.5rem;
    .title-mark{
      position: absolute;
      top:50%;
      transform:translate(0,-50%);
      content: '';
      width:.4rem;
      height: .2rem;
      border-radius: .09rem;
     background:rgba(136,73,248,0.21);
    }
    .title-bg{
      position: relative;
      &::before{
        .title-mark;
        left:-.3rem;
      }
      &::after{
        .title-mark;
        right:-.3rem;
      }
    }
  }
   .reach-text{
    font-size: .26rem;
    padding: .6rem .36rem 0 .4rem;
    display: flex;
    img{
      .wh(100%,100%);
    }
    dt{
      .wh(1.04rem,1.04rem);
      margin-right: .14rem;
    }
    dd{
      flex: 1.14rem  1; 
      text-align: left;
      h2{
        font-size: .34rem;
        color:@new-col-title-dark;
        font-weight: bold;
        line-height: .48rem;
        margin-bottom: .1rem;
      }
    }
    li{
      display: flex;
      span{
         display: block;
      }
      .spot{
        display: block;
        .wh(.1rem,.1rem);
        margin-right: .1rem;
        margin-top:.16rem;
        background:rgba(173,171,177,1);
        border-radius: 50%;
        }
        .spot-col{
          background:@new-col-orange;
        }
        .text{
          flex: .36rem 1;
          text-align: left;
          color:#999999;
          line-height: .46rem;
        }
         .text-col{
          color:@new-col-orange;
        }
    }
  }
  .step-box{
    padding: 0 .32rem;
    margin-top: .6rem;
    img{
      .wh(100%,100%);
    }
    .step-item{
      margin-top:.6rem;
    }
  }
  .text-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:#7F7793;
    .text-item{
      width: 1.56rem;
    }
    .last-item{
      width: 1.28rem;
      padding-right: .24rem;
    }
  }
  .bottom-info{
    margin-top: 1.06rem;
    font-size: .3rem;
    color:#999999;
  }
}
</style>