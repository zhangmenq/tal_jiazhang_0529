<template>
  <div class="teacher-details">
    <div class="video-box" v-if="teacherInfor && introList.length > 0">
      <div class="img-container" :style="{width:contentWidth+'px'}">
        <v-touch class="touch-inner" @swipeleft="swipeleft" @swiperight="swiperight">
          <div class="img-box" :style="{width:listWidth+'px', left:contentLeft+'px'}">
            <div class="item" v-for="(item, idx) in introList" :key="idx" @click="dialogShow(idx)" :style="{width:contentWidth+'px'}">
              <a class="video"  v-if="item.type === 1 || item.type === 2"></a>
              <span class="photo"  v-else>
                <img class="item"  :src="`${apiConfig.oss_host}${item.url}`"/>
              </span>
            </div>
          </div>
        </v-touch>
        <div class="tab" id="tab">
          <div v-for="(item, index) in introList.length" :key="index" class="tab-dot"></div>
        </div>
      </div>
    </div>
    <div v-else class="video-box-two" :style="{width:contentWidth+'px'}">
      <div class="default-img" :style="{width:contentWidth+'px'}"></div>
    </div>
    <div class="dialog-slider" v-if="dialog.diaLogState">
      <a class="close" @click="dialog.diaLogState = false"></a>
        <div class="dialog-hc">
          <div class="item" v-for="(item, idx) in introList" :key="idx" @click="dialogShow(idx)" v-if="idx === dialog.index">
            <player :videoId="item.url" v-if="item.type === 1"></player>
            <player :videoId="item.url" v-else-if="item.type === 2"></player>
            <!-- <video :src="item.url" controls="controls" v-else-if="item.type === 2">
              您的浏览器不支持 video 标签。
            </video> -->
            <img class="item" :src="`${apiConfig.oss_host}${item.url}`" v-else/>
          </div>
        </div>
    </div>
    <div class="top-box">
      <div class="inner">
        <div class="avatar">
          <img :src="teacherInfor.avatar_url" v-if="teacherInfor.avatar_url">
          <img src="../../assets/default-photo-teacher.png" v-else>
        </div>
        <div class="inner-mid">
          <div class="inner-mid-box">
            <p class="name-intro">
              <span class="name">{{teacherInfor.realname}}</span>
              <!-- <span class="sex" :class="{'male': teacherInfor.sex === 1, 'female': teacherInfor.sex === 2}"></span> -->
            </p>
            <p class="education" v-if="teacherInfor.degrees || teacherInfor.teaching_age"><span v-if="teacherInfor.degree">{{teacherInfor.degrees}}</span><span v-if="teacherInfor.teaching_age">{{teacherInfor.teaching_age}}教龄</span></p>
          </div>
        </div>
        <div class="inner-right">
          <a class="btn-attention" v-if="teacherInfor.is_attenttion === 0" @click="setFavorite(1)"><em></em>+关注</a>
          <a class="btn-unattention" v-else @click="setFavorite(0)">已关注</a>
        </div>
      </div>
    </div>
    <teacher-details :info="teacherInfor"></teacher-details>
  </div>
</template>
<script>
import { getTeacherDetails, setFavorite, setApilog } from '@/api';
import TeacherDetails from '@/components/teacher/TeacherDetails';
import Player from '@/components/common/Player.vue';

export default {
  components: {
    TeacherDetails,
    Player,
  },
  data() {
    return {
      teacherInfor: {},
      isDisabled: false,
      introList: [],
      // 滑动轮播
      contentWidth: '',
      contentLeft: 0,
      listWidth: '',
      dialog: {
        diaLogState: false,
        index: 0,
      },
    };
  },
  computed: {
    teacherId() {
      return this.$route.params.id;
    },
  },
  methods: {
    dialogShow(idx) {
      this.dialog.diaLogState = true;
      this.dialog.index = idx;
    },
    swipeleft() {
      if (this.dialog.index === this.introList.length - 1) {
        this.dialog.index = 0;
        this.contentLeft = 0;
      } else {
        this.dialog.index += 1;
      }
      this.contentLeft = -(this.dialog.index * this.contentWidth);
      this.transDot();
    },
    swiperight() {
      if (this.dialog.index === 0) {
        this.dialog.index = this.introList.length - 1;
      } else {
        this.dialog.index -= 1;
      }
      this.contentLeft = -(this.dialog.index * this.contentWidth);
      this.transDot();
    },
    getTeacherDetails() {
      return getTeacherDetails(this.teacherId).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.teacherInfor = res.data;
        if (this.teacherInfor.video_and_phont) {
          this.introList = this.teacherInfor.video_and_phont;
        }
        this.listWidth = this.introList.length * this.contentWidth;
        if (this.introList.length !== 0) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.transDot();
            }, 0);
          });
        }
      });
    },
    setFavorite(params) {
      if (!this.isDisabled) {
        this.isDisabled = true;
      }
      const data = {
        teacher_id: this.teacherId,
        tab: params,
      };
      setFavorite(data).then(() => {
        this.getTeacherDetails();
        this.isDisabled = false;
      });
    },
    transDot() {
      const oTab = document.getElementById('tab');
      const aDot = oTab.getElementsByClassName('tab-dot');
      for (let i = 0; i < aDot.length; i += 1) {
        if (this.dialog.index === i) {
          aDot[i].classList.add('selected');
        } else {
          aDot[i].classList.remove('selected');
        }
      }
    },
  },
  mounted() {
    this.getTeacherDetails();
    this.contentWidth = document.body.clientWidth;
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let num = 1;
      if (from.name === 'teachers') {
        num = 2;
      }
      setApilog({
        event_type: 20020,
        route: '/teachers',
        ext1: num,
        ext2: vm.teacherId,
      });
    });
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

.teacher-details{
  padding-bottom: 1rem;
  .video-box{
    .img-container{
      position: relative;
      height: 3.9rem;
      overflow: hidden;
      .img-box {
        position: absolute;
        height: 3.9rem;
      }
    }
    .item{
      float: left;
      vertical-align: middle;
      width: 100%;
      height: 3.9rem;
      .photo {
        display: block;
        height: 3.9rem;
      }
      .video{
        .bg-m('@{img-path}cover-video.png');
        background-size: 100% 100%;
        position: relative;
        .photo;
        &:before{
          content: '';
          .pos-box-cc(1.1rem,1.1rem);
          .bg-m('@{img-path}teacher-play.png');
          background-size: 100% 100%;
        }
      }
    }
    .tab{
      position: absolute;
      top: 85%;
      right: 0.21rem;
      .tab-dot{
        float: left;
        width:0.12rem;
        height:0.12rem;
        background:rgba(255,255,255,0.7);
        border-radius: 50%;
        margin-right: 0.1rem;
      }
      .selected {
        background: @new-col-white;
        width: 0.3rem;
        height: 0.12rem;
        border-radius: 0.06rem;
      }
    }
  }
  .video-box-two{
    .default-img{
      height:3.9rem;
      .bg-m('@{img-path}cover-video.png');
      background-size: 100% 100%;
    }
  }
  .dialog-slider{
    .close{
      position: absolute;
      right: .3rem;
      top: .9rem;
      .wh(.6rem,.6rem);
      .bg-m('@{img-path}dialog-close-icon.png');
      background-size: 100% 100%;
    }
    .cus-dialog-box;
    .item{
      position: relative;
      display: flex;
      justify-content: center;
      .wh(100%,100%);
      img{
        height: 5.6rem;
        width: auto;
      }
      video{
        .pos-box(100%,100%);
      }
      .video{
        position: relative;
        display: block;
        .wh(100%,100%);
        .bg-m('@{img-path}cover-video.png');
        background-size: 100% 100%;
        &:before{
          content: '';
          .pos-box-cc(1.6rem,1.6rem);
          .bg-m('@{img-path}teacher-play.png');
          background-size: 100% 100%;
        }
      }
    }
  } 
  .top-box{
    background: @new-col-white;
    box-shadow: 0 .04rem .2rem 0 rgba(163,163,163,0.15);
    border-radius: 0.1rem;
    margin: -0.3rem .4rem 0;
    position: relative;
    .inner{
      width: 6.7rem;
      display: flex;
      padding: 0.32rem 0.21rem;
    }
    .avatar{
      width: 1.6rem;
      display: inline-block;
      .wh(1.6rem,1.6rem);
      border-radius: 100%;
      overflow: hidden;
      img{
        .wh-img;
      }
    }
    .inner-mid{
      width: 2.8rem;
      .inner-mid-box{
        height:1.6rem;
        display: table-cell;
        vertical-align: middle;
      }
      .name-intro{
        margin-left: 0.3rem;
        font-size: 0.36rem;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: @new-col-title-dark;
        line-height: 0.5rem;
        .wordbreak;
        .wordbreak-en;
      }
      .education{
        height: 0.37rem;
        font-size: 0.26rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: @new-col-font-gray;
        line-height: 0.37rem;
        margin-top: 0.07rem;
        span{
          margin-left: 0.3rem;
        }
      }
    }
    .inner-right{
      width: 1.24rem;
      height: 0.58rem;
      box-shadow: 2px 2px 4px 0px rgba(163,163,163,0.4);
      border-radius: 0.29rem;
      text-align: center;
      .btn-attention{
        background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
        color: @new-col-white;
      }
      .btn-unattention{
        background: @new-col-line-gray;
        color: @new-col-font-gray;
      }
      position: absolute;
      top: 50%;
      margin-top: -0.29rem;
      right: 0.20rem;
      a{
        height: 0.58rem;
        font-size: 0.28rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        line-height: 0.58rem;
        display: inline-block;
        width: 1.24rem;
        border-radius: 0.29rem;
      } 
    }
  }
}
</style>


