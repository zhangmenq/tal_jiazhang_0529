<template>
  <div class="audioicon">
    <span @click="pause()"
      class="suspend-btn"
      v-if="playStatus && playing">
    </span>
    <span @click="play()"
      v-else>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    audioUrl: {
      type: String,
      default: '',
    },
    playing: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      playStatus: false,
      player: new Audio(),
      listenTime: 0,
    };
  },
  methods: {
    play() {
      if (!this.player.paused) {
        return;
      }
      this.player = new Audio(this.audioUrl);
      this.player.play();
      // 关闭上一个音频
      this.$emit('playEnd', {
        index: this.index,
        player: this.player,
      });
      // 播放时间
      this.player.currentTime = this.listenTime;
      this.player.oncanplay = () => {
        this.playStatus = true;
      };
      this.player.onended = () => {
        this.playStatus = false;
      };
    },
    pause() {
      // 暂停当前播放
      if (!this.player.paused) {
        this.player.pause();
        this.playStatus = false;
        this.listenTime = this.player.currentTime;
      }
      this.player.oncanplay = () => {
        this.playStatus = false;
      };
      this.player.onended = () => {
        this.playStatus = false;
      };
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.audioicon{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  span{
    position: absolute;
    top: 0;
    left: 0;
    display:block;
    .wh(100%,100%);
      .bg-m('../assets/teacher-details-img5.png',center,center,no-repeat);
      background-size: .3rem .39rem;
    &.suspend-btn{
      .bg-m('../assets/teacher-details-img6.png',center,center,no-repeat);
      background-size: .3rem .39rem;    
    }
  }
}

</style>

