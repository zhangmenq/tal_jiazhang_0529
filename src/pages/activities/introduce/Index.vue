<template>
  <div>
    <div class="activity-offline">活动已下线</div>
    <div class="poster" v-if="false">
      <Loading v-if="loading" loadingText="加载中"></Loading>
      <div class="poster-page" v-if="currentStatus === 0 && !loading">
        <div class="poster-top-bg"></div>
        <div class="poster-bot-bg"></div>
        <div class="poster-page-content">
          <div class="poster-swiper">
            <swiper :options="swiperOption">
              <swiper-slide>
                <div class="template-introduce">
                  <div class="template-person template-person-one"></div>
                  <div class="template template-one"></div>
                  <div class="ewm"></div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="template-introduce">
                  <div class="template-person template-person-two"></div>
                  <div class="template template-two"></div>
                  <div class="ewm"></div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="template-introduce">
                  <div class="template-person template-person-three"></div>
                  <div class="template template-three"></div>
                  <div class="ewm"></div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          <div style="text-align:center; padding-bottom:.6rem">
            <div class="make-button" v-if="isMaking">
              <input type="file" accept="image/*" name="" id="" @change="uploadFile($event, true)">我要制作
            </div>
            <div class="make-button" @click="toJudge(1)" v-else>
              我要制作
            </div>
          </div>
        </div>
        <pop-up v-if="popShow === 0" popType="qualification" @close="closePop()"></pop-up>
      </div>
      <div class="poster-making" v-else-if="!resultImg && currentStatus === 1">
        <Loading v-if="isLoading" :loadingType="true"></Loading>
        <div class="template-make">
          <div class="img-crop" :class="'template'+selectedNum">
            <vueCropper
              v-if="imgData"
              ref="cropper"
              :img="imgData"
              :outputSize="0.5"
              outputType="png"
              :autoCropWidth="cropW"
              :autoCropHeight="cropH"
              :autoCrop="true"
              :fixedBox="true"
              :canMove="true"
              :canMoveBox="false"
              :original="true"
              :enlarge="enlarge"
              :high="false"
            ></vueCropper>
          </div>
          <img :src="qrcodeUrl" class="ewm ewm-nobg" alt="">
        </div>
        <ul class="template-select">
          <li v-for="(item,index) in 3"
            :key="index"
            :class="{'active':index === (selectedNum - 1)}" @click="changeTemplate(index + 1)">
          </li>
        </ul>
        <div class="button-make">
          <div class="make-button">
            <input type="file" accept="image/*" name="" id="" @change="uploadFile($event)">
            重新选图
          </div>
          <x-button :disabled="!imgData" @click.native="makePoster()">生成海报</x-button>
        </div>
        <pop-up v-if="popShow === 2" popType="gesture" @close="closePop()"></pop-up>
        <Loading v-if="loadingUpload" :loadingType="true" loadingText="图片加载中"></Loading>
      </div>
      <div class="poster-result" v-else-if="resultImg && currentStatus === 2 && !isLoading">
        <div>
          <img :src="resultImg" alt="">
          <!-- <img :src="previewImg"> -->
          <div class="notice">&nbsp;</div>
        </div>
      </div>
      <pop-up v-if="popShow === 1" popType="image" @close="closePop()"></pop-up>
    </div>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper';
import mergeImages from 'merge-images';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { isEmpty } from 'lodash';
import { XButton } from 'vux';
import { mapState } from 'vuex';
import { getUserInfo } from '@/api';
import { setItem, getItem } from '@/utils/localStorage';
import getOrigin from '@/utils/origin';
import wechatMenu from '@/mixins/wechatMenu.js';
import { getFileType } from '@/utils';
import creatQrcodeMixin from './creatQrcodeMixin';
import Loading from './Loading';
import PopUp from './PopUp';

export default {
  components: {
    VueCropper,
    XButton,
    swiper,
    swiperSlide,
    Loading,
    PopUp,
  },
  mixins: [creatQrcodeMixin, wechatMenu],
  data() {
    return {
      currentStatus: 0,
      studentId: '',
      loading: true,
      isLoading: false,
      loadingUpload: false,
      selectedNum: 1,
      cropW: 325 * window.devicePixelRatio,
      cropH: 415 * window.devicePixelRatio,
      enlarge: 2 / window.devicePixelRatio,
      imgData: '',
      resultImg: '',
      previewImg: '',
      isMaking: false, // 制作
      popShow: -1, // 0无资格弹窗 1图片不符合格式 2手势
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
        },
      },
    };
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
    wechatBind() {
      const wechatKey = 'openid';
      return typeof this.$route.query[`${wechatKey}`] !== 'undefined' || getItem('openid');
    },
    openid() {
      return getItem('openid');
    },
  },
  mounted() {
    this.checkWechatBind();
    this.$nextTick(() => {
      this.toJudge();
    });
  },
  methods: {
    // 检测微信openid是否获取
    checkWechatBind() {
      if (this.wechatBind) {
        setItem('openid', this.$route.query.openid || getItem('openid'));
      }
      if (getOrigin() === 'wechat' && !this.wechatBind) {
        const url = `${this.apiConfig.host}/wechat/introduce-openid?back_type = introduces`;
        this.$http.get(url).then((res) => {
          if (typeof res.data.url !== 'undefined') {
            location.href = res.data.url;
            return false;
          }
        });
      }
    },
    // 判断是否登录及有无资格
    toJudge(type = 0) {
      this.$http.get(`${this.apiConfig.host}student/active-count?type=index_pv`);
      this.isMaking = false;
      if (getItem('token')) {
        getUserInfo().then(() => {
          if (!isEmpty(this.userInfo)) {
            this.$http.get(`${this.apiConfig.host}student/introduce-qualification`).then((res) => {
              this.loading = false;
              if (res.error_code === 0 && res.data === 1) {
                this.isMaking = true;
                this.qrcodeSize = 122;
                this.createQrcode();
              } else { // 无资格弹框显示
                if (type > 0) {
                  this.popShow = 0;
                }
                return false;
              }
            });
          } else {
            this.loading = false;
            if (type > 0) {
              this.introduceLogin();
            }
          }
        });
      } else {
        this.loading = false;
        if (type > 0) {
          this.introduceLogin();
        }
      }
    },
    introduceLogin() {
      this.$router.push({
        name: 'introduceLogin',
        query: {
          open_id: this.openid,
          type: 1,
        },
      });
    },
    closePop() {
      this.popShow = -1;
      return false;
    },
    changeTemplate(type) {
      this.selectedNum = type;
    },
    uploadFile(event, isGesture = false) {
      const file = event.target.files[0];
      if (getFileType(file.name) !== 'image' || file.size > 1024 * 1024 * 5) {
        this.popShow = 1;
        return false;
      }
      this.currentStatus = 1;
      const reader = new FileReader();
      this.loadingUpload = true;
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.imgData = data;
        setTimeout(() => {
          this.loadingUpload = false;
          if (isGesture) { // 首次进来显示引导手势
            this.popShow = 2;
            this.$http.get(`${this.apiConfig.host}student/active-count?type=my_make_click`);
          }
        }, 500);
      };
      reader.readAsArrayBuffer(file);
    },
    makePoster() {
      this.isLoading = true;
      this.$refs.cropper.getCropData((data) => {
        this.previewImg = data;
        mergeImages([
          { src: data, x: 0, y: 0 },
          { src: `/static/imgs/introduce-template-bg${this.selectedNum}.png`, x: 0, y: 0 },
          { src: this.qrcodeUrl, x: 498, y: 687 },
        ]).then((base64) => {
          setTimeout(() => {
            this.resultImg = base64;
            this.currentStatus = 2;
            this.isLoading = false;
            this.$http.get(`${this.apiConfig.host}student/active-count?type=individuation_poster_make`);
          }, 1000);
        });
      });
    },
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';
@import 'swiper/dist/css/swiper.css';
[v-cloak] {
  display: none!important;
}
.activity-offline{
  padding-top: 75%;
  font-size: 30px;
  text-align: center;
}
.poster{
  position: relative;
  overflow-x: hidden;
  .wh(100%, 100%);
  .make-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-align: center;
    .wh(3.4rem, .8rem);
    line-height: .8rem;
    border-radius: .4rem;
    color: #bd5407;
    font-size: .36rem;
    background:rgba(255,236,23,1);
    box-shadow:0px 6px 0px 0px rgba(250,154,49,1);
    input {
      position: absolute;
      right: 0;
      top: 0;
      .wh(100%, 100%);
      opacity: 0;
    }
  }
  .vue-cropper {
    background:#fff;
  }
  .template1{
    .cropper-modal{
      .bg-m('/static/imgs/introduce-template-bg1.png');
      background-size: 6.5rem 8.3rem;
    }
  }
  .template2{
    .cropper-modal{
      .bg-m('/static/imgs/introduce-template-bg2.png');
      background-size: 6.5rem 8.3rem;
    }
  }
  .template3{
    .cropper-modal{
      .bg-m('/static/imgs/introduce-template-bg3.png');
      background-size: 6.5rem 8.3rem;
    }
  }
  .template4{
    .cropper-modal{
      .bg-m('/static/imgs/introduce-template-bg4.png');
      background-size: 6.5rem 8.3rem;
    }
  }
  .template5{
    .cropper-modal{
      .bg-m('/static/imgs/introduce-template-bg5.png');
      background-size: 6.5rem 8.3rem;
    }
  }
  .cropper-crop-box{
    display: none;
  }
}
.poster-page {
  position: relative;
  width: 100%;
  min-height: 100%;
  background: #eee1ff;
  .poster-top-bg {
    position: absolute;
    top: 0;
    left: 0;
    .wh(100%, 5.78rem);
    font-size: .36rem;
    .bg-m('@{img-path}/introduce-img2.png');
    background-size: 100%;
  }
  .poster-bot-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    .wh(100%, 3rem);
    .bg-m('@{img-path}/introduce-img3.png');
    background-position: center bottom;
    background-size: 100%;
  }
  .poster-page-content {
    z-index: 2;
    padding-top: .85rem;
  }
  .poster-swiper {
    margin: 0 auto .42rem;
    width: 6.5rem;
    height: 9.08rem;
    .swiper-wrapper {
      width: 6.5rem;
      height: 9.08rem;
    }
  }
  .swiper-wrapper .swiper-slide {
    .wh(6.5rem, 8.3rem);
  }
  .swiper-pagination-bullets {
    bottom: .2rem;
    .swiper-pagination-bullet {
      margin: 0 .1rem;
      .wh(.18rem, .18rem);
      background: #b3b9d1;
      opacity: 1;
    }
    .swiper-pagination-bullet-active{
      background: @col-purple;
    }
  }
}
.poster-making {
  text-align: center;
  padding: .4rem 0;
  .template-make{
    position: relative;
    margin: 0 auto .4rem;
    .wh(6.5rem, 8.3rem);
    .img-crop{
      .wh(6.5rem, 8.3rem);
    }
  }
  .template-select {
    li {
      display: inline-block;
      margin: 0 .2rem .5rem;
      .wh(1rem, 1.26rem);
      border: .08rem solid #fff;
      &:nth-child(1) {
        .bg-m('@{img-path}/introduce-template-bgs1.png');
        background-position: center center;
        background-size: .92rem 1.18rem;
      }
      &:nth-child(2) {
        .bg-m('@{img-path}/introduce-template-bgs2.png');
        background-position: center center;
        background-size: .92rem 1.18rem;
      }
      &:nth-child(3) {
        .bg-m('@{img-path}/introduce-template-bgs3.png');
        background-position: center center;
        background-size: .92rem 1.18rem;
      }
      &:nth-child(4) {
        .bg-m('@{img-path}/introduce-template-bgs4.png');
        background-position: center center;
        background-size: .92rem 1.18rem;
      }
      &:nth-child(5) {
        .bg-m('@{img-path}/introduce-template-bgs5.png');
        background-position: center center;
        background-size: .92rem 1.18rem;
      }
      &.active{
        box-shadow: 0px 4px 6px 0px rgba(0,0,0,0.2);
        border: .08rem solid #ffec17;
      }
    }
  }
  .button-make {
    text-align: center;
    .make-button {
      margin: 0 .25rem;
      .wh(2.3rem, .76rem);
      vertical-align: middle;
      font-size: .3rem;
      box-shadow: none;
    }
    .weui-btn {
      display: inline-block;
      vertical-align: middle;
      margin: 0 .25rem;
      .wh(2.3rem, .76rem);
      line-height: .76rem;
      border-radius: .38rem;
      font-size: .3rem;
      color: @col-white;
      background: @col-purple;
    }
    .select-image {
      color: #BD5407;
    }
  }
}
.poster-result {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5rem 0;
  min-height: 100%;
  text-align: center;
  background: #f8f8f8;
  img {
    .wh(6.5rem, 8.3rem);
    margin-bottom: .3rem;
  }
  .notice {
    margin: 0 auto;
    .wh(6.5rem, 2.6rem);
    .bg-m('@{img-path}/introduce-img5.png');
    background-size: 6.5rem 2.6rem;

  }
}
.template-introduce {
  position: relative;
  .wh(6.5rem, 8.3rem);
  .template-person{
    position: absolute;
    z-index: 1;
    &.template-person-one{
      left: 1.9rem;
      top: 2.4rem;
      .wh(2.6rem, 2.6rem);
      .bg-m('@{img-path}/introduce-template-per4.png');
      background-size: 2.6rem 2.6rem;
    }
    &.template-person-two{
      left: .77rem;
      top: 1.34rem;
      .wh(5.18rem, 5.37rem);
      .bg-m('@{img-path}/introduce-template-per5.png');
       background-size: 5.18rem 5.37rem;
    }
    &.template-person-three{
      left: .54rem;
      top: 1.2rem;
      .wh(5.56rem, 6.06rem);
      .bg-m('@{img-path}/introduce-template-per1.png');
      background-size: 5.56rem 6.06rem;
    }
    &.template-person-four{
      left: 2.75rem;
      top: 1.3rem;
      .wh(1.72rem, 1.72rem);
      .bg-m('@{img-path}/introduce-template-per2.png');
      background-size: 1.72rem 1.72rem;
    }
    &.template-person-five{
      left: 1.48rem;
      top: 2.29rem;
      .wh(3.49rem, 3.49rem);
      .bg-m('@{img-path}/introduce-template-per3.png');
      background-size: 3.49rem 3.49rem;
    }
  }
  .template {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    .wh(6.5rem, 8.3rem);
    &.template-one {
      .bg-m('/static/imgs/introduce-template-bg1.png');
      background-size: 6.5rem 8.3rem;
    }
    &.template-two {
      .bg-m('/static/imgs/introduce-template-bg2.png');
      background-size: 6.5rem 8.3rem;
    }
    &.template-three {
      .bg-m('/static/imgs/introduce-template-bg3.png');
      background-size: 6.5rem 8.3rem;
    }
    &.template-four {
      .bg-m('/static/imgs/introduce-template-bg4.png');
      background-size: 6.5rem 8.3rem;
    }
    &.template-five {
      .bg-m('/static/imgs/introduce-template-bg5.png');
      background-size: 6.5rem 8.3rem;
    }
  }
}
.ewm {
  position: absolute;
  right: .3rem;
  bottom: .21rem;
  z-index: 3;
  .wh(1.22rem, 1.22rem);
  .bg-m('@{img-path}/wechat-img.png');
  background-size: 100% 100%;
  &.ewm-nobg {
    background:none;
  }
}

</style>

