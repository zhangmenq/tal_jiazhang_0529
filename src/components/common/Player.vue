<template>
  <video id="playerId" preload="auto" playsinline webkit-playsinline></video>
</template>
<script>
import playVideo from '@/utils/playVideo';

export default {
  props: {
    videoId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      videoPlayer: '',
    };
  },
  methods: {
    /* global TCPlayer */
    teacherVideo() {
      this.videoPlayer = TCPlayer('playerId', playVideo({
        width: '1500',
        height: '1000',
        fileID: this.videoId,
        controlBar: {
          QualitySwitcherMenuButton: false,
          fullscreenToggle: false,
        },
      }));
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.teacherVideo();
      }, 500);
    });
    console.log('videoId+', this.videoId);
  },
  destroyed() {
    if (this.videoPlayer && this.videoId) {
      this.videoPlayer.dispose();
    }
  },
};
</script>

