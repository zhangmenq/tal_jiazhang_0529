<template>
  <div class="adjustTeacher">
    <search @search="search" v-if="showSearch"></search>
    <div class="cont" v-else>
      <sticky v-if="!date || !time">
        <div class="mycourse-tab">
          <tab
              :line-width='6'
              active-color='#1c223d'
              disabled-color='#b2b7ce'
              bar-active-color='#4964f4'
              custom-bar-width='.6rem'>
              <tab-item selected @click.native="reload()">按老师选</tab-item>
              <tab-item @click.native="selTime(0)">按时间选</tab-item>
          </tab>
          <span class="search-icon" @click="showSearch = true">&nbsp;</span>
        </div>
      </sticky>
      <div class="choose-teacher">
        <ul v-if="list.length > 0">
          <li v-for="(item, index) in list" :key="index">
            <div class="head-portrait">
              <img v-if="item.avatar_url === ''" src="../../assets/default-photo-teacher.png">
              <img v-else :src="item.avatar_url">
              <audio-play
                v-if="item.audiointro_url !== ''"
                :audioUrl="item.audiointro_url"
                :playing="index === currentIndex"
                :index="index"
                @playEnd="playEnd"></audio-play>
            </div>
            <div class="teacher-cont">
              <h3>{{item.realname}} <i :class="{'man': item.sex === 1, 'woman': item.sex === 2}">&nbsp;</i></h3>
              <x-button mini type="primary" @click.native="adjustTeacher(item.id)">立即预约</x-button>
              <p>{{item.intro_cn}}</p>
            </div>
          </li>
        </ul>
        <div class="nocontent" v-else>
          <div class="inner noteacher">
            <span class="nocontent-img"></span>
            <p class="tips">
              抱歉！没有找到老师哦~
              <a @click="selTime(0)">我要换时间</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Sticky, Tab, TabItem, XButton } from 'vux';
import AudioPlay from '../../components/common/AudioPlay';
import Search from '../../components/common/Search';
import adjustTeacher from '../../mixins/adjustTeacher';

export default {
  components: {
    Tab,
    TabItem,
    Sticky,
    XButton,
    AudioPlay,
    Search,
  },
  data() {
    return {
      url: '/src/assets/music1.mp3',
      currentIndex: -1,
      player: '',
    };
  },
  mixins: [adjustTeacher],
  methods: {
    playEnd(item) {
      if (this.player !== '') { // 暂停上一个音频
        this.player.pause();
        this.player.currentTime = 0;
      }
      this.player = item.player;
      // 当前播放index
      this.currentIndex = item.index;
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.adjustTeacher{
  background: @col-bg;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  .cont{
    height: 100%;
  }
  .mycourse-tab{
    box-shadow: 0 .2rem .2rem #ededed;
    z-index: 500;
    .search-icon{
      position: absolute;
      right: .3rem;
      top: .46rem;
      .wh(.3rem,.3rem);
      .bg-m('../assets/search-img1.png',0,0,no-repeat);
      background-size: 100% 100%;
    }
  }
  .vux-tab{
    font-size: .3rem;
    height: 1.2rem;
    .vux-tab-item{
      font-size: .3rem;
      background:none;
      line-height: 1.2rem;
    }
    .vux-tab-bar-inner{
      border-radius: .03rem;
    }
  }
  .choose-teacher{
    height: 100%;
    overflow-y: auto;
    ul{
      background: @col-white;
      padding: .2rem 0 1.1rem 0;
      li{
        padding: .3rem;
        display: flex;
        justify-content:flex-start;
      }
    }
    .head-portrait{
      .wh(1rem,1rem);
      float: left;
      img{
        border-radius: 100%;
        .wh(1rem,1rem);
      }
      position: relative;
      span{
        position: absolute;
        left:0;
        top:0;
        margin: 0;
        display:block;
        .wh(100%,100%);
        .bg-m('../assets/teacher-details-img5.png',center,center,no-repeat);
        background-size: .3rem,.4rem;
        &.suspend-btn{
          .bg-m('../assets/teacher-details-img6.png',center,center,no-repeat);
          background-size: .3rem,.4rem;
        }
      }
    }
    .teacher-cont{
      margin: 0 0 0 0.3rem;
      width: 78%;
      float: left;
      // flex:1;
      position: relative;
      h3{
        width: 4.8rem;
        line-height: .4rem;
        // height: .6rem;
        font-size: .32rem;
        color: @col-darkblue;
        margin-bottom: .3rem;
        i{
          display: inline-block;
          .wh(.26rem,.26rem);
          .bg-m("../assets/sex-icon.png",0,0,no-repeat);
          background-size: 100%;
          vertical-align: middle;
          &.man{
            background-position: 0 -.28rem;
          }
          &.woman{
            background-position: 0 0;
          }
        }
      }
      p{
        font-size: .28rem;
        color: @col-darkgray;
      }
      .weui-btn{
        .wh(1.44rem,.6rem);
        font-size: .24rem;
        padding:0;
        position: absolute;
        top: 0;
        right: 0;
      }
      .weui-btn_primary {
        background-color: @col-lightred;
      }

    }
  }
}

</style>
