<template>
  <div class="making-page">
    <div class="making-page-bg" :class="{'loadingBg': isLoading}"></div>
      <!-- loadingBg loading的时候换成不同的背景 -->
    <div v-if="!isLoading">
      <h2 class="logo"></h2>
      <div class="making-box">
        <div class="upload-area">
          <div class="cover-bg" :class="'scene'+selectedNum">&nbsp;</div>
          <div class="videoImg" v-if="showStatus === 2 || showStatus === 3">
            <!-- 图片预览 -->
            <img v-if="showStatus === 2 && realFile" :src="realFile" alt="">
            <div v-show="showStatus === 3" class="video-preview">
              <div v-if="videoLoading">
                <div class="loadingIcon"></div>
              </div>
              <video id="videoPlayer"
                class="videoPlayer"
                :src="videoUrl"
                :poster="videoCover"
                controls
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                :class="{'vW':videoWidth > videoHeight,'vH':videoWidth < videoHeight}" v-else-if="!videoLoading && !videoBtn">
              </video>
            </div>
          </div>
          <x-button class="playVideo-btn"
            v-if="showStatus === 3 && !videoLoading && videoBtn"
            @click.native="getPlayAuth(video_id)">&nbsp;
          </x-button>
          <div class="videoImg-upload" v-if="(!imgData || !video_id) && showStatus < 0">
            <div class="videoImg-upload">
              <a href="javascript:;" class="file">
                <input type="file" name="" id="" @change="uploadFile($event)">
              </a>
              上传图片或视频
            </div>
          </div>
        </div>
      </div>
      <div class="making-btn">
        <ul>
          <li>
            <span class="changeImg">
              <a href="javascript:;" class="file">
                <!-- (imgData || video_id) && showStatus > 0 -->
                <input type="file" name="" id="" v-if="!videoLoading" @change="uploadFile($event)">
              </a>
            </span>重新做
          </li>
          <li>
            <span class="changeBorder" @click="showPop = true">&nbsp;</span>选模板</li>
          <li>
            <span class="changeOK" @click="saveFile()">&nbsp;</span>OK
          </li>
        </ul>
      </div>
      <div v-transfer-dom>
        <popup v-model="showPop">
          <ul>
            <li v-for="(item,index) in 5" :key="index" :class="{'active':index === (selectedNum - 1)}" @click="changeTemplate(index + 1)">
              <span :class="'num'+(index+1)">&nbsp;</span>
              00{{index+1}}
            </li>
          </ul>
          <!-- <div class="cancel-confirm">
            <x-button class="cancel" @click.native="cancel()">x</x-button>
            <x-button class="confirm" @click.native="confirm()">✔</x-button>
          </div> -->
        </popup>
      </div>
    </div>
    <div class="loadingPage" v-else>
      <div class="loading-icon">
        <h3></h3>
        <div class="progress">
          <div class="progress-bar">
            <div class="progress-shadow"></div>
          </div>
        </div>
        <h4>&nbsp;</h4>
      </div>
      <!-- <div class="loading-logo">&nbsp;1111</div> -->
    </div>
    <div class="popUp" v-show="popShow">
      <div class="popup-bg"></div>
      <div class="popup-box">
        <div class="close-btn" @click="closeBtn()">x</div>
        <p class="imgRule">不符合要求，请重新选择<br/>图片支持格式：JPEG、PNG；支持大小：5M以下<br/>视频支持格式：mp4、AVI、3GP、WMV、flv；支持大小：100M以下</p>
      </div>
    </div>
    <div class="cropper" v-if="imgData && showStatus === 1">
      <vueCropper
        ref="cropper"
        :img="imgData"
        :outputSize="0.5"
        outputType="jpeg"
        :autoCropWidth="cropW"
        :autoCropHeight="cropH"
        :autoCrop="true"
        :fixedBox="true"
        :centerBox="true"
        :high="false">
      </vueCropper>
      <div class="cropBtn">
        <x-button class="cropCancel" @click.native="cancelUpload()">取消</x-button>
        <x-button @click.native="previewImg()" class="cropComfirm">确定</x-button>
      </div>

    </div>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper';
import { TransferDom, Popup, XButton } from 'vux';
import { getFileType } from '@/utils';
import mergeImages from 'merge-images';
import { setSessionItem } from '@/utils/sessionStorage';
import videoMixins from '@/mixins/videoMixins.js';
import wechatMenu from '@/mixins/wechatMenu.js';

export default {
  name: '',
  components: {
    VueCropper,
    TransferDom,
    Popup,
    XButton,
  },
  directives: { TransferDom },
  data() {
    return {
      showPop: false,
      popShow: false,
      selectedNum: 1, // 选中的模板
      fileType: -1, // 0上传视频 1图片
      imgData: '',
      cropImg: '',
      realFile: '',
      showStatus: -1, // 1裁剪图片 2展示裁剪后的图片 3上传视频
      options: {
        title: '',
        fname: '',
      },
      video_id: '',
      videoLoading: false,
      authOpt: {},
      isLoading: false,
      cropW: 594,
      cropH: 677,
      videoBase64: '',
    };
  },
  mixins: [videoMixins, wechatMenu],
  methods: {
    changeTemplate(type) {
      this.selectedNum = type;
    },
    closeBtn() {
      this.popShow = false;
    },
    uploadFile(event) {
      this.imgData = '';
      this.video_id = '';
      this.file = event.target.files[0];
      if (this.file && getFileType(this.file.name) === 'image') {
        this.fileType = 1;
        this.uploadImg();
      } else if (this.file && getFileType(this.file.name) === 'video') {
        this.fileType = 0;
        this.addVideo();
      } else {
        this.popShow = true; // 不符合格式
        return false;
      }
    },
    uploadImg() {
      if (this.file.size > 1024 * 1024 * 5) {
        this.popShow = true;
        return false;
      }
      this.showStatus = 1;
      const reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.imgData = data;
      };
      reader.readAsArrayBuffer(this.file);
    },
    previewImg() {
      this.showStatus = 2;
      this.$refs.cropper.getCropData((data) => {
        this.realFile = data;
      });
    },
    cancelUpload() {
      this.showStatus = -1;
      this.fileType = -1;
    },
    addVideo() {
      if (this.file.size > 1024 * 1024 * 100) {
        this.popShow = true;
        return false;
      }
      this.showStatus = 3;
      this.videoLoading = true;
      this.options.fname = this.file.name;
      this.options.title = this.file.name.split('.')[0];
      this.startUploadVideo();
    },
    saveFile() {
      if (this.fileType < 0) {
        this.errorrMsg('请上传图片或视频');
        return false;
      }
      this.isLoading = true;
      const type = this.fileType === 1 ? 1 : 2;
      const url = `${this.apiConfig.host}student/count?type=${type}`; // 统计接口
      if (this.fileType === 1) { // 图片生成海报
        mergeImages([
          { src: '/static/imgs/thanks-giving-Bimg.png', x: 0, y: 0 },
          { src: this.realFile, x: 38, y: 34 },
          { src: `/static/imgs/thanks-giving-img${this.selectedNum + 17}.png`, x: 0, y: 0 },
        ]).then((base64) => {
          setSessionItem('imageUrl', base64);
          this.isLoading = false;
          this.posterResult(1);
          this.$http.get(url).then((res) => {
            console.log(res);
          });
        });
      } else if (this.fileType === 0 && !this.videoLoading) { // 视频生成海报
        this.$http.get(`${this.apiConfig.host}system/aliyun-play-auth?video_id=${this.video_id}`).then((response) => {
          if (response.error_code === 0) {
            setTimeout(() => {
              this.isLoading = false;
              this.posterResult(0, this.selectedNum, this.video_id);
              this.$http.get(url);
            }, 500);
          } else {
            this.isLoading = false;
            this.errorrMsg('视频制作失败，请稍后重试');
            return false;
          }
        });
      } else {
        this.isLoading = false;
        this.errorrMsg('请上传图片或视频');
        return false;
      }
    },
    posterResult(type = 1, selectedNum = 1, id = '') { // 海报结果页
      /* this.$router.push({
        name: 'thanksGivingResult',
        query: {
          type: type,
          selectedNum: selectedNum,
          videoId: id,
        },
      }); */
      location.href = `/activity/thanks-giving/result?type=${type}&selectedNum=${selectedNum}&videoId=${id}`;
    },
  },
  mounted() {
    // if(window.devicePixelRatio > 2.1){
    //    this.cropW = 790 / window.devicePixelRatio;
    //    this.cropH = 901 / window.devicePixelRatio;
    // }
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';


@c-purple: #6b1982;
.cropper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  .cropBtn{
    position: absolute;
    bottom: .2rem;
    right: 0;
    text-align: center;
    width: 100%;
  }
  .weui-btn{
    display: inline-block;
    .wh(1.8rem,.8rem);
    line-height: .8rem;
    font-size: .3rem;
    margin: 0 .4rem;
    &.cropComfirm{
      background: @c-purple;
      color: @col-white;
      border: .01rem solid @c-purple;
    }
    // &.cropCancel{

    // }
  }
}
.making-page{
  position: relative;
  min-height:100%;
  background: -webkit-linear-gradient(top,#6b1982,#662eb8);
  padding: .7rem 0 .6rem;
  .making-page-bg{
    position: absolute;
    top: 0;
    left: 0;
    // .wh(100%,100%);
    width:100%;
    min-height:100%;
    .bg-m('@{img-path}/thanks-giving-img3.png');
    background-size: 100% 100%;
    background-position: 0 bottom;
    &.loadingBg{
      .bg-m('@{img-path}/thanks-giving-img27.png');
      background-size: 100% 100%;
    }
  }
  h2.logo{
    .wh(2.5rem,.4rem);
    .bg-m('@{img-path}/thanks-giving-img17.png');
    background-position: 0 -.49rem;
    background-size: 2.5rem 1rem;
    margin: 0 auto .5rem;
  }
  .making-box{
    .wh(6.67rem,8.62rem);
    margin: 0 auto;
    .bg-m('@{img-path}/thanks-giving-com.png');
    background-size: 100% 100%;
    .upload-area{
      position: relative;
      padding: .7rem 0 0 0;
      min-height: 7.2rem;
      .videoImg{
        position:absolute;
        top: .32rem;
        left: .38rem;
        display: flex;
        justify-content: center;
        align-items: center;
        .wh(5.94rem,6.8rem);
        overflow: hidden;
        img{
          width: 100%;
        }
        .video-preview{
          display: flex;
          align-items: center;
          justify-content: center;
          .wh(100%,100%);
          position: relative;
          z-index: 2;
          overflow: hidden;
          .videoPlayer{
            width: 1px;
            &.vW{
              width: 99%;
            }
            &.vH{
              height: 99%;
              width: auto;
            }
          }
        }
      }
      .cover-bg{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        .wh( 6.67rem,8.62rem);
        &.scene1{
          .bg-m('@{img-path}/thanks-giving-img6.png');
          background-size: 100% 100%;
        }
        &.scene2{
          .bg-m('@{img-path}/thanks-giving-img7.png');
          background-size: 100% 100%;
        }
        &.scene3{
          .bg-m('@{img-path}/thanks-giving-img8.png');
          background-size: 100% 100%;
        }
        &.scene4{
          .bg-m('@{img-path}/thanks-giving-img9.png');
          background-size: 100% 100%;
        }
        &.scene5{
          .bg-m('@{img-path}/thanks-giving-img10.png');
          background-size: 100% 100%;
        }
      }
      .videoImg-upload{
        position: relative;
        z-index: 1;
        color: @c-purple;
        font-size: .28rem;
        text-align: center;
        font-weight: bold;
        letter-spacing: .07rem;
        .file {
            position: relative;
            display: block;
            margin: 1.4rem auto .2rem;
            .wh(1.43rem,1.43rem);
            overflow: hidden;
            .bg-m('@{img-path}/thanks-giving-img11.png');
            background-size: 1.43rem 1.43rem;
        }
        .file input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
        }
      }
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
    }
  }
  .making-btn{
    width: 5rem;
    height: 2rem;
    text-align: center;
    color: @col-white;
    font-size: .22rem;
    margin: 0 auto;
    padding: .7rem 0 0 0;
    ul{
      display: flex;
      justify-content: space-between;
    }
    li{
      span{
        position: relative;
        display: block;
        .wh(.99rem,.99rem);
        border-radius: 100%;
        background: @col-white;
        margin: 0 0 .2rem 0;
        &::before{
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          content: "";
          .bg-m('@{img-path}/thanks-giving-img4.png');
          background-size: 1rem 1.9rem;
        }
        &.changeImg{
          &::before{
            .wh(.52rem,.44rem);
            margin: -.22rem 0 0 -.26rem;
            background-position: 0 0;
          }
          .file {
            position: relative;
            display: block;
            .wh(100%,100%);
            overflow: hidden;
            background: none;
          }
          .file input {
              position: absolute;
              font-size: 100px;
              right: 0;
              top: 0;
              opacity: 0;
          }
        }
        &.changeBorder{
          &::before{
            .wh(.38rem,.46rem);
            margin: -.23rem 0 0 -.19rem;
            background-position: 0 -.5rem;
          }
        }
        &.changeOK{
          &::before{
            .wh(.52rem,.51rem);
            margin: -.255rem 0 0 -.26rem;
            background-position: 0 -.94rem;
          }
        }
      }
    }
  }
  .popUp{
    position: fixed;
    top: 0;
    left: 0;
    .wh(100%,100%);
    z-index: 3;
    .popup-bg{
      position: absolute;
      top: 0;
      left: 0;
      .wh(100%,100%);
      background: #000;
      opacity: .5;
      // z-index: 11;
    }
    .popup-box{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 12;
      .wh(6rem,3rem);
      margin: -2.2rem 0 0 -3rem;
      background: @col-white;
      border-radius: .1rem;
      .close-btn{
        position: absolute;
        top: -.2rem;
        right: -.2rem;
        .wh(.5rem,.5rem);
        background: #444040;
        border-radius: 100%;
        font-size: .26rem;
        color: @col-white;
        text-align: center;
      }
      .imgRule{
        font-size: .28rem;
        padding: .3rem .2rem 0;
      }
    }

  }
  .loadingPage{
    width: 2.2rem;
    margin: 2rem auto;
    .progress {
      background-color: #9665b7;
      height: .07rem;
      position: relative;
      width: 2.2rem;
      border-radius: 1.1rem;
    }
    .progress-bar {
      animation-duration: 4s;
      animation-name: width;
      background: #fff;
      height: 100%;
      position: relative;
      border-radius: 1.1rem;
    }
    .loading-icon{
      h3{
        .wh(2.19rem,2.76rem);
        .bg-m('@{img-path}/thanks-giving-img25.png');
        background-size: 2.19rem 2.76rem;
        margin-bottom: .36rem;
        transform: scale(1) rotatez(-7deg) translate(-17px, 1px);
        animation: 1s init, 0.2s aa 1s, 1s ab 1.7s infinite;
      }
      h4{
        .wh(2.19rem,.4rem);
        .bg-m('@{img-path}/thanks-giving-img26.png');
        background-size: 2.19rem .4rem;
        margin: .25rem 0 0 0;
      }
    }
    @keyframes init {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
    @keyframes aa {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1) rotatez(-7deg) translate(-17px, 1px);
      }
    }

    @keyframes ab {
      0% {
        transform: rotatez(-7deg) translate(-17px, 1px);
      }
      50% {
        transform: rotatez(7deg) translate(17px, 1px);
      }
      100% {
        transform: rotatez(-7deg) translate(-17px, 1px);
      }
    }
    @keyframes width {
      0%, 100% {
        transition-timing-function: cubic-bezier(1, 0, 0.65, 0.85);
      }
      0% {
        width: 0;
      }
      100% {
        width: 100%;
      }
    }
  }
}
.vux-popup-dialog{
  background: @col-white!important;
  padding: .44rem 0;
  .cancel-confirm{
    padding: 0 .4rem;
    .weui-btn{
      .wh(1.7rem,.66rem);
      border-radius: .66rem;
      line-height: .66rem;
      color: @c-purple;
      padding: 0;
      margin: 0;
      font-size: .4rem;
      background: @col-white;
      border: none;
      vertical-align: middle;
      box-shadow: 0 0 .2rem .05rem #f8f8fa;
      &::after{
        display: none;
      }
      &.cancel{
        float: left;
      }
      &.confirm{
        float: right;
      }
    }
  }

  ul{
    display: flex;
    padding: 0 .64rem .3rem;
    li{
      width: 20%;
      color: @c-purple;
      font-size: .28rem;
      text-align: center;
      font-weight: bold;
      &.active{
        color: #fdd000;
      }
      span{
        display: block;
        height: 1.04rem;
        margin: 0 auto .28rem;
        .bg-m('@{img-path}/thanks-giving-img12.png');
        background-size: 6rem 1.04rem;
        &.num1{
          width: .88rem;
          background-position: 0 0;
        }
        &.num2{
          width: .6rem;
          background-position: -1.25rem 0;
        }
        &.num3{
          width: 1.02rem;
          background-position: -2.4rem 0;
        }
        &.num4{
          width: .64rem;
          background-position: -3.9rem 0;
        }
        &.num5{
          width: 1.07rem;
          background-position: -4.9rem 0;
        }
      }
    }
  }
}
.loadingIcon{
  .wh(.92rem,.92rem);
  .bg-m('@{img-path}/dialog-box-icon.png');
  background-position: 0 -3rem;
  background-size: .92rem 4rem;
  animation: myMove1 2s linear infinite;
  // -webkit-animation: myMove1 4s ease-in infinite alternate;
}
@keyframes myMove1 {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
// @-webkit-keyframes myMove1 {
//     from {transform: rotate(0deg);}
// };
</style>

