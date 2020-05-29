<template>
  <div class="course-details">
    <div class="cover">
      <div class="cover_img">
        <img :src="courseInfo.cover_url" v-if="courseInfo.cover_url">
        <img src="../../assets/cover-default.jpg" v-else>
      </div>
      <div class="course-main">
        <div class="write-border course-cont">
          <h2>{{courseInfo.title}}</h2>
          <h3>
            <i class="icom icontime"></i>
            {{courseInfo.start_at | formatDate}} -
            {{courseInfo.end_at | formatDate}}
          </h3>
          <h3><i class="icom class-number"></i>共{{courseInfo.lessons}}节</h3>
          <ul @click="showPopup = true">
            <li><i class="icom return-premium"></i>随时退费</li>
            <li><i class="icom exclusive"></i>专属固定外教</li>
            <li><i class="icom playback"></i>课程回放</li>
            <li><i class="icom moreicon"></i>...</li>
          </ul>
          <div v-transfer-dom>
            <popup v-model="showPopup" >
              <div class="Service note">
                <h2>服务说明</h2>
                <ul>
                  <li>
                    <i class="icom return-premium"></i>随时退费
                    <p>学员在个人中心，点击“购买记录”找到订单，点击“申请退款”按钮进行退款申请操作。</p>
                  </li>
                  <li>
                    <i class="icom exclusive"></i>专属固定外教
                    <p>学员在个人中心，点击“购买记录”找到订单，点击“申请退款”按钮进行退款申请操作。</p>
                  </li>
                  <li>
                    <i class="icom playback"></i>课程回放
                    <p>学员在个人中心，点击“购买记录”找到订单，点击“申请退款”按钮进行退款申请操作。</p>
                  </li>
                  <li>
                    <i class="icom moreicon"></i>课后及时跟踪
                    <p>学员在个人中心，点击“购买记录”找到订单，点击“申请退款”按钮进行退款申请操作。</p>
                  </li>
                </ul>
              </div>
            </popup>
          </div>
        </div>
        <div class="write-border">
          <sticky>
            <tab
              :line-width='6'
              v-model="tabIndex"
              active-color='#1c223d'
              disabled-color='#5b97f7'
              bar-active-color='#5b97f7'
              custom-bar-width='0.6rem'>
              <tab-item @click.native="switchTab(0)">课程介绍</tab-item>
              <tab-item @click.native="switchTab(1)">课程安排</tab-item>
            </tab>
          </sticky>
          <div class="courde courde-description"
            v-if="tabIndex === 0"
            v-html = 'courseInfo.course_detail.base'>
          </div>
          <div class="courde course-arrangement" v-if="tabIndex === 1">
            <ul>
              <li>
                <i class="icom description-time"></i>
                {{courseInfo.start_at | formatDate}} -
                {{courseInfo.end_at | formatDate}}
              </li>
              <li>
                <i class="icom description-hour"></i>
                共{{courseInfo.lessons}}课时 <em>|</em>
                每周{{courseInfo.week_lessons}}次 <em>|</em>
                {{courseInfo.lesson_time}}分钟/课时
              </li>
              <li>
                <i class="icom description-pattem"></i>一对一
              </li>
              <li v-if="courseInfo.type === 1">
                <i class="icom choose-time"></i>
                8:00-22:00任选时间（公开课、体验课除外)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="immediately-apply">
      <ul>
        <li class="price" v-if="courseInfo.is_mid && courseInfo.type === 1">
          <del><span>￥{{courseInfo.price | formatMoney}}</span></del>
          <em>会根据本学期剩余课次计算</em>
        </li>
        <li class="price" v-else>
          <span>￥{{ courseInfo.price | formatMoney }}</span>
        </li>
        <li>
          <x-button :gradients="['#da76d4', '#eb7d51']" @click.native="book()">
            {{ classroomId > 0 ? '已购买' : (orderId > 0 ? '未支付' : '立即报名') }}
          </x-button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup, Group, Tab, TabItem, XButton, Sticky } from 'vux';
import { isEmpty } from 'lodash';
import { formatDate, formatMoney } from '@/filters';
import { getCourseInfo, isOrdered } from '@/api';

export default {
  components: {
    Popup,
    Group,
    Tab,
    TabItem,
    XButton,
    Sticky,
  },
  directives: {
    TransferDom,
  },
  filters: { formatDate, formatMoney },
  data() {
    return {
      tabIndex: 0,
      showPopup: false,
      courseInfo: {
        course_detail: {},
      },
      courseId: 0,
      courseType: 0,
      midCourse: false,
      toastTips: '正在取消，请稍后...',
      showToast: true,
      classroomId: 0,
      orderId: 0,
    };
  },
  methods: {
    switchTab(idx) {
      if (this.tabIndex !== idx) {
        this.tabIndex = idx;
      }
    },
    book() {
      if (this.classroomId) {
        this.$router.push({
          name: 'scheduleList',
          params: {
            classroomId: this.classroomId,
          },
        });
        return;
      }
      if (this.orderId) {
        this.$router.push({
          name: 'unpayOrder',
        });
        return;
      }
      this.$router.push({
        name: 'time',
        query: {
          course_id: this.courseInfo.id,
          type: this.courseInfo.type,
        },
      });
    },
    async init() {
      await getCourseInfo(this.courseId, this.courseType);
      this.courseInfo = this.$store.state.courseInfo;
      if (this.courseType) {
        await isOrdered(this.courseId).then((res) => {
          if (isEmpty(res.data)) {
            this.ordered = 0;
          } else {
            this.classroomId = res.data.status === 1 ? res.data.classroom_id : 0;
            this.orderId = res.data.status === 0 ? res.data.order_id : 0;
          }
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    this.courseId = this.$route.query.course_id;
    this.courseType = this.$route.query.type;
    this.init().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.course-details{
  background: @col-bg;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding-bottom:1.1rem;

  .cover{
    & .cover_img{
      position: relative;
      z-index: 1;
      & img{
        width: 100%;
      }
    }
  };
  .course-main{
    position: relative;
    z-index: 2;
    margin-top: -2rem;
  }
  .write-border{
    padding:0rem 0.3rem 0.3rem 0.3rem;
    background: @col-white;
    border-radius: 0.2rem;
    // min-height: 3rem;
    margin: 0 0.3rem 0.2rem;
    em{
      color: @col-gray;
    }
  }
  .course-cont{
    color: @col-darkgray;
    h2{
      font-size: .47rem;
      padding-top: 0.2rem;
    }
    h3{
      font-size: .26rem;
      margin:0.2rem 0 0 0;
    }
    ul{
      .l-h(.86rem);
      width: 100%;
      overflow: hidden;
      border-top: .01rem solid @col-gray;
      margin-top: .25rem;
      li{
        margin:0 .1rem 0 0;
        display: inline-block;
      }
    }
  }
  .immediately-apply{
    position:absolute;
    bottom:0;
    left:0;
    width:100%;
    height: 1.1rem;
    background:@col-white;
    padding:0 0.3rem;
    z-index: 500;
    ul{
      display: flex;
      height: 1.1rem;
      justify-content:space-between;
      align-items:center;
      .price{
        color:@col-lightred;
        font-size: .48rem;
        em{
          display: block;
          font-size: 0.2rem;
          color: @col-gray;
          margin:-.1rem 0 0 0;
        }
      }
      .weui-btn{
        .wh(1.88rem,.7rem);
        font-size: 0.3rem;
        box-shadow: 0.05rem 0.08rem 0.2rem #fdd0df;
      }
    }
  }
  .vux-tab{
    font-size: 0.3rem;
    height: 1.2rem;
    .vux-tab-item{
      font-size: 0.3rem;
      background:none;
      line-height: 1.2rem;
    }
    .vux-tab-bar-inner{
      border-radius: .03rem;
    }
  }
  .courde{
    font-size: 0.26rem;
    color: @col-darkgray;
    padding:0.3rem 0 0 0;
    min-height: 2rem;
    &.courde-description p{
      font-size: .3rem;
      word-break: break-all;
      margin-bottom: .15rem;
      a{
        color: @col-darkblue;
      }
      img{
        width: 100%!important;
        margin: .1rem 0;
      }
    }
    li{
      margin:0 0 0.15rem 0;
    }
  }
  .vux-fixed{
    left: 0;
    background: @col-white;
  }
}
.v-transfer-dom{
  .vux-popup-dialog{
    background: @col-white;
    padding:.3rem;
    h2{
      text-align: center;
      line-height: .5rem;
      margin:0 0 0.1rem 0;
      font-size: .3rem;
      color: @col-darkgray;
    }
    li{
      p{
        color: @col-gray;
        font-size: .24rem;
        padding:0.05rem 0 0.1rem 0;
      }
    }
  }
}
i.icom{
  display: inline-block;
  vertical-align: middle;
  margin:-.02rem 0.05rem 0 0;
  .wh(.4rem,.27rem);
  .bg-m('@{img-path}/course-details-icon.png');
  background-size:100%;
  &.icontime{
    background-position: center 0;
  }
  &.class-number{
    background-position: center -.28rem;
  }
  &.return-premium{
    background-position: center -1.29rem;
  }
  &.exclusive{
    background-position: center -1.58rem;
  }
  &.playback{
    background-position: center -1.88rem;
  }
  &.moreicon{
    background-position: center -2.14rem;
  }
  &.description-hour{
    background-position: center -.53rem;
  }
  &.description-pattem{
    background-position: center -.8rem;
  }
  &.choose-time{
    background-position: center -1.02rem;
  }
}
</style>
