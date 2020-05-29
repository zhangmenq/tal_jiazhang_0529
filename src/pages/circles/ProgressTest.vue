<template>
  <div class="progressTest">
    <div class="gradient">
      <span class="white-start"></span>
      <span class="bottom-icon">&nbsp;</span>
      <div class="content personalInfo">
        <div class="headimg"  v-if="info.student">
          <img :src="info.student.avatar_url" v-if="info.student.avatar_url"/>
          <img src="../../assets/default-photo.png" v-else>
        </div>
        <h3 v-if="info.student">
          {{info.student.enname || info.student.realname}}
        </h3>
        <h4>
          <i>年级：<font v-if="info.student">{{info.student.grade_name}}</font></i>
          <i>测评老师：<font v-if="info.teacher">{{info.teacher.realname}}</font></i>
        </h4>
        <div class="starLevel">
          <p class="star-icon"><em :style="'width:' +info.all_star*20+'%'" class="empty"></em></p>
          <p class="star-tit" v-if="info.all_star">{{startLevel[info.all_star-1]}}</p>
        </div>
      </div>
    </div>
    <div class="grade" v-if="info.test_point">
      <ul>
        <li v-for="(item,index) in info.test_point" :key="index">
          <h3>{{item.name}}</h3>
          <p><i>{{item.actual_score}}</i>/{{item.total_score}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getProgressTest } from '@/api';

export default {
  data() {
    return {
      startLevel: ['继续努力', '继续努力', '再接再厉', '棒棒哒', '完美'],
      info: {},
    };
  },
  computed: {
    scheduleId() {
      return this.$route.params.scheduleId;
    },
  },
  methods: {
    progressTestInfo() {
      return getProgressTest(this.scheduleId, 3).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.info = res.data;
      });
    },
  },
  async mounted() {
    await this.progressTestInfo();
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.gradient{
  .l-gradient(90deg,rgba(78, 102, 235, 1),rgba(218, 118, 215, 1));
  min-height: 200px;
  position: relative;
  span{
    position: absolute; 
    left: 0;
    display: block;
    &.white-start{
      top: 0;
      .wh(100%,100%);
      .bg-m('@{img-path}/starry-sky.png',0,0,repeat);
      z-index: 2;
    }
    &.bottom-icon{
      bottom: 0;
      .wh(100%,1.81rem);
      .bg-m('@{img-path}/tower-bg.png',0,0,no-repeat);
      background-size: auto 100%;
      z-index: 1;
    } 
  }
  .content{
    position: relative;
    z-index: 3;
  }
}
.progressTest{
  background: @col-bg;
  min-height: 100%;
  .personalInfo{
    text-align: center;
    padding: .3rem 0;
    color: @col-white;
    .headimg{
      .wh(1.6rem,1.6rem);
      margin: 0 auto;
      img{
        border-radius: 100%;
        display: block;
        .wh(100%,100%);
      }
    }
    h3{
      font-size: .36rem;
      padding: 0 .4rem;
      .l-h(.5rem);
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      margin: .08rem 0;
    }
    h4{
      i{
        font-size: .26rem;
        padding: 0 .3rem;
      } 
    }
    .starLevel{
      .star-icon{
        .wh(3.2rem,.4rem);
        margin: .22rem auto .08rem;
        .bg-m('@{img-path}/star-five.png',0,0,no-repeat);
        background-size: 100%;
        em{
          display: block;
          height: .4rem;
          .bg-m('@{img-path}/star-five.png');
          background-position: 0 -.42rem;
          background-size: auto .82rem;
          &.empty{
            width: 0%;
          }
        } 
      }
      .star-tit{
        font-size: .36rem;
      }
    }
  }
  .grade{
    li{
      float: left;
      .wh(44%,1.8rem);
      background: @col-white;
      margin: .3rem 0 0 3.7%;
      box-shadow:6px 0px 24px rgba(0,0,0,0.06);
      padding: .25rem .3rem 0;
      h3{
        font-size: .3rem;
      }
      p{
        color: @col-gray;
        font-size: .3rem;
        i{
          color: @col-purple;
          font-size: .6rem;
        }
      }
    }
  }
}
</style>
