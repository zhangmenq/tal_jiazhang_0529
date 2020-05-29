<template>
  <div class="text-system">
    <div class="system-list">
        <h2 class="system-title"> 
          <span class="title-bg">高效同步美国小学学习体系</span>
        </h2>
         <div class="img-content">
          <img src="../../../static/imgs/know/text.png" alt="">
        </div>
    </div>
    <div class="system-list">
      <h2 class="system-title"> 
        <span class="title-bg">美国国家地理学习原版教材Reach</span>
      </h2>
      <div class="img-box">
        <img src="../../../static/imgs/know/book.png" alt="">
      </div>
      <ul class="reach-text">
        <li v-for="(item,idx) in reachList" :key="idx">
          <span class="spot"></span>
          <span class="text">{{item.text}}</span>
        </li>
      </ul>
    </div>
    <div class="system-list">
      <h2 class="system-title"> 
        <span class="title-bg">沉浸式双外教课堂</span>
      </h2>
      <div class="class-type">
        <dl>
          <dt>
            <img src="../../../static/imgs/know/class_e.png" alt="">
          </dt>
          <dd>美国语文课</dd>
        </dl>
        <dl class="right" >
          <dt>
              <img src="../../../static/imgs/know/class_a.png" alt="">
          </dt>
          <dd>文学通识课</dd>
        </dl>
      </div>
      <ul class="reach-text class-text">
        <li>
          <span class="spot"></span>
          <span class="text text-big">每周80分钟语言浸泡</span>
        </li>
        <li>
          <span class="spot"></span>
          <span class="text  text-big">40分钟一对一美国语文课，掌握语言之用，开启思维能力；</span>
        </li>
        <li>
          <span class="spot"></span>
          <span class="text text-big">40分钟一对多文学通识课，领略文学之美， 探索大千世界。</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      reachList: [{
        text: '美国国家地理学习出版社研发，美国本土重点学校使用的教材',
      },
      {
        text: '对标美国共同核心州立标准（CCSS）的最新教材',
      },
      {
        text: '覆盖欧洲共同语言参考标准（CEFR）对应级别的语言技能',
      },
      {
        text: '可对接剑桥YLE/MSE等国际性测评',
      },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
@import "../../styles/basic.less";
.text-system{
  margin: .3rem auto .25rem;
  text-align: center;
  color:@new-text-gray;
  padding-bottom: 0.16rem;
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
  .img-content{
    .wh(7.11rem,7.22rem);
    margin: .3rem auto .6rem;
    img{
      .wh(100%,100%);
    }
  }
  .img-box{
    .wh(4.77rem,4.76rem);
    margin: .3rem auto .3rem;
    img{
      .wh(100%,100%);
    }
  }
  .reach-text{
    font-size: .26rem;
    padding: 0 .38rem 0 .54rem;
    margin-bottom: .54rem;
    li{
      display: flex;
      margin-bottom: .1rem;
      span{
         display: block;
      }
      .spot{
        display: block;
        .wh(.1rem,.1rem);
        margin-right: .24rem;
        margin-top:.16rem;
        background:rgba(173,171,177,1);
        border-radius: 50%;
        }
        .text{
          flex: .36rem 1;
          text-align: left;
        }
        .text-big{
          font-size: .28rem;
        }
    }
  }
  .class-text{
    padding: 0 .86rem 0 .54rem;
  }
  .class-type{
      display: flex;
      justify-content: center;
      align-items: center;
     margin: .4rem 0  .4rem 0;
    dl{
      flex:1;
      border-right:.01rem dashed rgba(151,151,151,1);
      dt{
         margin:0 auto;
        .wh(1.19rem,1.19rem);
      }
      dd{
        color:@new-col-title-dark;
        font-size: .24rem;
        line-height: .33rem;
        margin-top: .1rem;
      }
    }
   .right{
     border-right:none;
   }
  }
}
</style>