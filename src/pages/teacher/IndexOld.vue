<template>
  <div class="teacher-details">
    <div class="introduce" id="introduce">
      <div class="cont">
        <h1 class="head-portrait">
          <img v-if="teacherInfo.avatar_url" :src="teacherInfo.avatar_url">
          <img v-else src="../../assets/default-photo-teacher.png">
          <div class="audioicon" v-if="teacherInfo.audiointro">
            <em class="layer" v-if="teacherInfo.audiointro"></em>
            <span @click="pause()"
              class="suspend-btn"
              v-if="audioPlayStatus">
            </span>
            <span @click="play()" v-else></span>
          </div>
        </h1>
        <h2 class="name">
          <p>
            {{teacherInfo.realname}}
            <i :class="{'man': teacherInfo.sex === 1, 'woman': teacherInfo.sex === 2}">&nbsp;</i>
          </p>
        </h2>
        <ul class="charm-show">
          <li v-for="(item, index) in teacherInfo.tags" :key="index">
            {{item.tag_name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="self-introduction">
      <p>{{teacherInfo.intro_cn}}</p>
      <video id="video" playsinline webkit-playinline x5-playinline></video>
    </div>
    <p class="service-tel"><i>&nbsp;</i>客服电话：<span>4008002211</span>转9</p>
  </div>
</template>
<script>
/* eslint-disable */
import AudioPlay from '@/components/common/AudioPlay';
import playVideo from '@/utils/playVideo';

export default {
  components: {
    AudioPlay,
  },
  data() {
    return {
      id: 0,
      teacherInfo: {},
      audioPlayer: new Audio(),
      videoPlayer: '',
      audioPlayStatus: false,
    };
  },
  methods: {
    getTeacherInfo() {
      this.id = this.$route.params.id;
      this.$http.get(`${this.apiConfig.host}teacher/teachers/${this.id}`).then((response) => {
        if (response.error_code !== 0) {
          return false;
        }
        this.teacherInfo = response.data;
        if (this.teacherInfo.video_id) {
          this.teacherVideo();
        }
      });
    },

    teacherVideo() {
      this.videoPlayer = TCPlayer('video', playVideo({
        width: Number((window.devicePixelRatio * 900)/ 3),
        height: Number(window.devicePixelRatio * 600 / 3),
        fileID: this.teacherInfo.video_id,
        controlBar: {
          QualitySwitcherMenuButton: false,
        },
      }));
      this.videoPlayer.on('playing', () => {
        if (this.audioPlayStatus) {
          this.audioPlayer.pause();
          this.audioPlayStatus = false;
        }
      });
    },
    play() {
      if (!this.audioPlayer.paused) {
        return;
      }
      this.audioPlayer = new Audio(this.teacherInfo.audiointro);
      this.audioPlayer.play();
      this.audioPlayStatus = true;
      this.audioPlayer.oncanplay = () => {
        //如果视频在播放，关闭视频
        if(this.videoPlayer){
          this.videoPlayer.pause();
        }
        this.audioPlayStatus = true;
        this.audioPlayer.play();
      };
      this.audioPlayer.onended = () => {
        this.audioPlayStatus = false;
      };
    },
    pause() {
      if (!this.audioPlayer.paused) {
        this.audioPlayer.pause();
        this.audioPlayStatus = false;
      }
      this.audioPlayer.oncanplay = () => {
        this.audioPlayStatus = false;
      };
      this.audioPlayer.onended = () => {
        this.audioPlayStatus = false;
      };
    },
  },
  mounted() {
    this.getTeacherInfo();
  },
  destroyed() {
    if (this.videoPlayer && this.teacherInfo.video_id) {
      this.videoPlayer.dispose();
    }
    this.audioPlayer.pause();
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.teacher-details{
  background:@col-bg;
  padding:0 0 0.3rem 0;
  min-height: 100%;
  overflow-x: hidden;
  .introduce{
    padding:1.4rem 0 0 0;
    .bg-m('../assets/teacher-details-img1.png',0,0,no-repeat);
    background-size: 100%;
    .cont{
      background: @col-white;
      // background: @col-blue;
      width: 90%;
      margin: 0 auto;
      border-radius: .2rem;
      position: relative;
      min-height: 2rem;
      h1{
        position: absolute;
        .wh(1.6rem,1.6rem);
        border-radius: 100%;
        top:-.8rem;
        left:.4rem;
        img{
          .wh-img();
          border-radius: 100%;
        }
      }
      h2{
        position: absolute;
        display: table;
        top:-0.8rem;
        left:2.5rem;
        color: @col-white;
        font-size: .36rem;
        line-height: .4rem;
        vertical-align: middle;
        p{
          display: table-cell;
          vertical-align:middle;
          word-break: break-all;
          height: .8rem;
          width: 4.5rem;
        }
        i{
          display: inline-block;
          vertical-align: middle;
          margin: 0 0 0 0.2rem;
          .wh(0.26rem,0.26rem);
          .bg-m('@{img-path}/sex-icon.png',0,0,no-repeat);
          background-size: 100%;
          &.man{
            background-position: center -.26rem;
          }
          &.woman{
            background-position: center 0;
          }
        }
      }
      .charm-show{
        display: flex;
        flex-wrap: wrap;
        padding:0.9rem .4rem .2rem;
        font-size: .26rem;
        li{
          margin: 0 .56rem 0 0;
          line-height: .6rem;
        }
      }
    }
  }
  .self-introduction{
    width: 90%;
    margin:0.3rem auto;
    padding-bottom: 0.3rem;
    background:@col-white;
    border-radius: .2rem;
    word-break: break-all;
    p{
      font-size: 0.3rem;
      padding:.3rem .2rem .5rem;
      color: @col-darkgray;
     }
  }
  .viveo-js{
    .vjs-big-play-button{
      background: #f60;
      top:50%;
      left:50%;
    }
  }
  .trump-setting .setting-definition{
  font-size: .3rem;
  }
  .trump-setting .setting-definition-value-curr, .trump-setting .setting-definition-value{
    font-size: .3rem;
  }
  .trump-error{
    font-size: .26rem;
  }
  .tcplayer {
      margin: 0 auto;
    }
  .player-size {
    margin: 0 auto;
    width: 6rem;
    height: 4rem;
  }

  .audioicon{
    .layer{
      .pos-box(100%,100%);
      background-color: rgba(0,0,0,.2);
      border-radius: 100%;
    }
    span{
      position: absolute;
      top:0;
      left:0;
      margin:0;
      display:block;
      .wh(100%,100%);
        .bg-m('../assets/teacher-details-img5.png',center,center,no-repeat);
        background-size: .3rem .4rem;
      &.suspend-btn{
        .bg-m('../assets/teacher-details-img6.png',center,center,no-repeat);
        background-size: .3rem .4rem;
      }
    }
  }
}
.video-js .vjs-control-bar{
  font-size: .28rem!important;
}
.vjs-playback-rate{
  display: none!important;
}
.vjs-menu {
  display: none!important;
}
.vjs-spacer {
  display: none!important;
}
.vjs-menu-button{
  display: none!important;
}
</style>
