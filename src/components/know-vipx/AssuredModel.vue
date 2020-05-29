<template>
  <div class="assure-system">
        <h2 class="system-title"> 
          <span class="title-bg">四大安心承诺</span>
        </h2>
        <dl class="reach-text">
          <dt>
              <img src="../../../static/imgs/know/teacher.png" alt="">
            </dt>
            <dd>
              <h2>1V1专属辅导老师</h2>
              <ul>
                <li>
                  <span class="spot"></span>
                  <span class="text">1V1专业中教辅导，全程跟进学习效果 </span>
                </li>
                 <li>
                  <span class="spot"></span>
                  <span class="text">24小时在线，365天随时帮您解决问题</span>
                </li>
              </ul>
          </dd>
        </dl>
        <dl class="reach-text">
          <dt>
              <img src="../../../static/imgs/know/online.png" alt="">
            </dt>
            <dd>
              <h2>全透明在线课堂</h2>
              <ul>
                <li>
                  <span class="spot"></span>
                  <span class="text">无限次回看课程视频，课堂更透明 </span>
                </li>
                 <li>
                  <span class="spot"></span>
                  <span class="text">随时查看孩子上课状态，掌握孩子学习情况</span>
                </li>
              </ul>
          </dd>
        </dl>
        <dl class="reach-text">
          <dt>
              <img src="../../../static/imgs/know/change.png" alt="">
            </dt>
            <dd>
              <h2>灵活调课，便捷转班</h2>
              <ul>
                <li>
                  <span class="spot"></span>
                  <span class="text">微信、APP一键搞定调课转班，轻松快捷 </span>
                </li>
              </ul>
          </dd>
        </dl>
        <dl class="reach-text">
          <dt>
              <img src="../../../static/imgs/know/refund.png" alt="">
            </dt>
            <dd>
              <h2>无理由退费</h2>
              <ul>
                <li>
                  <span class="spot"></span>
                  <span class="text">首次报名的VIPX的学员第一次课不满意， 在第二次课开课前退费（不含第二次课）， 全额退费 </span>
                </li>
                 <li>
                  <span class="spot"></span>
                  <span class="text">具体内容详见《VIPX课程服务协议》</span>
                </li>
              </ul>
          </dd>
        </dl>
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
        .text{
          flex: .36rem 1;
          text-align: left;
          color:#999999;
          line-height: .46rem;
        }
    }
  }
}
</style>