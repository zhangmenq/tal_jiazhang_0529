<template>
  <div class="teacher-box">
          <template v-if="teacherInfo.intro_cn || teacherInfo.video_id">
            <p class="intro" v-show="teacherInfo.intro_cn">{{teacherInfo.intro_cn}}</p>
            <div class="cus-responsive video" v-show="teacherInfo.video_id">
              <video id="video" class="cus-responsive-item" playsinline webkit-playinline x5-playinline></video>
            </div>
          </template>
          <no-content
            v-else
            :tips="'暂无内容~'"
            :vertical="false">
          </no-content>
  </div>
</template>

<script>
  import NoContent from '@/components/common/NoContent';
  import playVideo from '@/utils/playVideo';

  export default {
    components: { NoContent },
    data() {
      return {
        videoPlayer: '',
      };
    },
    props: {
      teacherInfo: {
        type: Object,
        default: function () {
          return {};
        },
      },
      showPop: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      if (this.teacherInfo && this.teacherInfo.video_id) {
        this.$nextTick(() => {
          this.teacherVideo();
        });
      }
    },
    destroyed() {
      if (this.videoPlayer && this.teacherInfo.video_id) {
        this.videoPlayer.dispose();
      }
    },
    methods: {
      /* global TCPlayer */
      teacherVideo() {
        this.videoPlayer = TCPlayer('video', playVideo({
          width: '1500',
          height: '1000',
          fileID: this.teacherInfo.video_id,
          controlBar: {
            QualitySwitcherMenuButton: false,
            fullscreenToggle: false,
          },
        }));
      },
    },
    watch: {
      showPop(newVal) {
        if (!newVal && this.videoPlayer && this.teacherInfo.video_id) {
          this.videoPlayer.pause();
        }
      },
    },
  };
</script>

<style lang="less" scoped>
 .teacher-box{
      .intro{
        line-height: .46rem;
        font-size: .3rem;
      }
      .video{
        margin-top: .26rem;
        padding-bottom: 57%;
        border-radius: .08rem;
        overflow: hidden;
        .trump-setting{
          .setting-definition, .setting-definition-value-curr, .setting-definition-value{
            font-size: .3rem;
          }
        }
        .trump-setting-close{
          top: auto;
          bottom: .1rem;
          right: .1rem;
          font-size: .3rem;
        }
      }
    }
</style>

