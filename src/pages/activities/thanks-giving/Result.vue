<template>
  <div class="result-page">
    <!-- <div class="layer" v-if="thanksType === 0"></div> -->
    <div class="share-video" v-if="thanksType === 0 && !videoQuery.isShare">&nbsp;</div>
    <div class="share-img" v-if="thanksType === 1">&nbsp;</div>
    <div class="result-h" v-if="!isLoading">
      <img :src="imgSrc" alt="">
      <div class="video-preview" v-if="thanksType === 0">
        <video id="videoPlayer" controls :src="videoUrl" :poster="videoCover"></video>
      </div>
    </div>
  </div>
</template>
<script>
import { getSessionItem } from '@/utils/sessionStorage';
import videoMixins from '@/mixins/videoMixins.js';
import { XButton } from 'vux';
import wechatMenu from '@/mixins/wechatMenu.js';
import mergeImages from 'merge-images';

export default {
  components: {
    XButton,
  },
  data() {
    return {
      imgSrc: '',
      isLoading: true,
    };
  },
  mixins: [videoMixins, wechatMenu],
  computed: {
    imageUrl() {
      return getSessionItem('imageUrl');
    },
    thanksType() {
      return Number(this.$route.query.type);
    },
    videoQuery() {
      return this.$route.query;
    },
  },
  methods: {
    getPoster() {
      if (this.thanksType === 0) {
        mergeImages([
          { src: '/static/imgs/thanks-giving-Bvideo.png', x: 0, y: 0 },
          { src: `/static/imgs/thanks-giving-img${Number(this.videoQuery.selectedNum) + Number('17')}.png`, x: 0, y: 0 },
        ]).then((base64) => {
          this.isLoading = false;
          this.imgSrc = base64;
          this.getPlayAuth(this.videoQuery.videoId);
        });
      } else {
        this.isLoading = false;
        this.imgSrc = this.imageUrl;
      }
    },
  },
  mounted() {
    this.getPoster();
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';

#videoPlayer{
  width: 100%;
  height: 100%;
  // object-fit: fill;
}
.result-page {
  position: relative;
  display: flex;
   align-items: center;
  background-image: -webkit-linear-gradient(top,#6b1a85,#6437cf);
  padding: .5rem 0;
  min-height: 100%;
  .layer{
    position: fixed;
    top: 0;
    left: 0;
    .wh(100%,100%);
    background: #000;
    opacity: .5;
    z-index: 2;
  }
  .share-video{
    position: absolute;
    top: .1rem;
    right: .3rem;
    .wh(4.71rem,2.27rem);
    .bg-m('@{img-path}/thanks-giving-img23.png');
    background-size: 4.71rem 2.27rem;
    z-index: 3;
  }
  .share-img{
    position: absolute;
    top: .4rem;
    left: 50%;
    .wh(5.78rem,.7rem);
    margin: 0 0 0 -2.89rem;
    .bg-m('@{img-path}/thanks-giving-img24.png');
    background-size: 5.78rem .7rem;
    z-index: 3;
  }
  .result-h{
    position: relative;
    width: 6.65rem;
    margin: 0 auto;
    img{
      width: 100%;
    }
    .video-preview{
      .wh(5.91rem,6.75rem);
      position: absolute;
      left: .38rem;
      top: .36rem;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .playVideo-btn{
        position: absolute;
        top: 50%;
        left: 50%;
        .wh(1.5rem,1.5rem);
        margin: -.75rem 0 0 -.75rem;
        .bg-m('@{img-path}/thanks-giving-img28.png');
        background-size: 1.5rem 1.5rem;
        z-index: 2;
        &::after{
          display: none;
        }
      }
      img{
        .wh(auto,100%);
      }
    }
  }
}
</style>
