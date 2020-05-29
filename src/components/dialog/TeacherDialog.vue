<template>
  <div class="cus-dialog" v-if="isShow">
    <div class="dialog-layer" @click="hidePop"></div>
    <div class="dialog-content" >
      <div class="teacher-box">
        <template v-if="infor.intro_cn || infor.video_id">
          <p class="intro" v-show="infor.intro_cn">{{infor.intro_cn}}</p>
          <div v-if="infor.video_id">
            <video class="video-box" :id="('video'+infor.id)"  preload="auto" playsinline webkit-playinline x5-playinline></video>
          </div>
        </template>
        <no-content
          v-else
          :tips="'暂无内容~'"
          :vertical="false">
        </no-content>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  // import { TransferDom, Popup } from 'vux';
  import NoContent from '@/components/common/NoContent';
  
  export default {
    // directives: { TransferDom },
    components: {
      // Popup,
      NoContent,
    },
    created() {
      this.state = this.isShow;
      // this.vPlayer = this.videoPlayer;
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      infor: {
        type: Object,
        def0ault: {},
      },
      videoPlayer: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        state: false,
        vPlayer: '',
      };
    },
    watch: {
      state: function (newValue) {
        console.log(newValue,'1');
        if(this.infor.video_id){
          this.vPlayer = this.videoPlayer;
          this.teacherVideo();
        }
      },
    },
    methods: {
      hidePop() {
        if(this.infor.video_id){
          this.vPlayer.pause();
          // this.vPlayer = '';
        }
        console.log('aa');
        this.$emit('hidePop');
      },
      teacherVideo() {
        this.vPlayer = TCPlayer(`video${this.infor.id}`, {
          fileID: this.infor.video_id,
          appID: '1253886863',
        });
        console.log('li');
      },
    },
    // mounted() {
    //   if (this.infor.video_id) {
    //     console.log('a');
    //     this.teacherVideo();
    //   }
    // },
  };
</script>
<style lang="less">
@import '../../styles/basic.less';

.cus-dialog{
  position: fixed;
  left: 0;
  top: 0;
  .wh(100%,100%);
  z-index: 100;
  .dialog-layer{
    position: fixed;
    left: 0;
    top: 0;
    .wh(100%,100%);
    background-color: rgba(0,0,0,.6);
  }
  .dialog-content{
    position: absolute;
    left: 0; 
    bottom: 0;
    padding:.3rem;
    .wh(100%,70%);
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto; 
    .teacher-box{
      .intro{
        line-height: .46rem;
        font-size: .3rem;
      }
      .video-box{
        margin-top: .26rem;
        padding-top: 57%;
        max-width: 100%;
        width: 100%;
        height: 0;
      }
    }
  }
}

</style>