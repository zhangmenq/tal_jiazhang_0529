<template>
  <div class="homepage" ref="home">
    <!-- 轮播图 -->
    <banner :imgs="imgs" :imgUrls="imgUrls"></banner>
    <!-- <div class="box">
      <h3 class="box-title">课程指导</h3>
      <div class="box-body">
        <div class="box-item" @click="selTest">
          <div class="box-item-left">
            <span>入学测</span>
            <br>
            <span class="tiny-text">还没级别来测试 ></span>
          </div>
          <div class="box-item-right home-test-icon">
          </div>
        </div>
        <div class="box-item box-item-guide" @click="guide()">
          <div class="box-item-left">
            <span>常见问题</span>
            <br>
            <span class="tiny-text">产品使用指南 ></span>
          </div>
          <div class="box-item-right home-fq-icon">
          </div>
        </div>
      </div>
    </div>
    <div class="box" @click="selExp">
      <h3 class="box-title">选课</h3>
      <div class="box-body-exp">
        <div class="content">
          <h2>北美外教英语全能力诊断</h2>
          <span>仅限即将升入幼儿园大班及1-8年级学员</span>
          <a class="free-join">立即预约</a>
        </div>
      </div>
    </div> -->
    <!-- 入学测 -->
    <div class="newTestBox" @click="selTest" v-if="newUser">
      <div class="newTestContent">
        <p>一分钟了解适合你的课程<span></span></p>
      </div>
      <div class="newTestImg"></div>
    </div>
    <router-view></router-view>
    <!-- 了解vipx -->
    <p v-if="newUser" class="vipx_title">了解VIPX</p>
    <know-vipx v-if="newUser"></know-vipx>
    <vx-dialog
      :show="dialogData.show"
      :tips="dialogData.tips"
      @onConfirm="selTest()"
      @onCancel="cancelTest()">
    </vx-dialog>
    <!-- <transition name="pop">
      <reorder-dialog v-if="isReorder && (wechatBind || origin == 'peiyou')" @onClose="closeReorder" @goWaitOrder="goWaitOrder"></reorder-dialog>
    </transition> -->
    <div v-if="expPop > 0">
      <div class="common-dialog"></div>
      <div class="common-pop" v-if="expPop == 1">
        <p>确认预约吗？</p>
        <a class="cancel" @click="cancelExp()">再想想</a>
        <a class="confirm" @click="freeExp()">我要预约</a>
      </div>
      <div class="common-pop" v-if="expPop == 2">
        <p>在读学员本次体验不能领取哦！</p>
        <a class="fail-btn" @click="expPop = 0">我知道了</a>
      </div>
      <div class="common-pop" v-if="expPop == 3">
        <p>预约失败，请重试</p>
        <a class="fail-btn" @click="expPop = 0">我知道了</a>
      </div>
    </div>
      <!-- 入学测试提醒 -->
    <stage-dialog @closeDialog="closeStageTest" :showToast="showStageTest" @startTest="startTest"></stage-dialog>
    <!-- 春节放假弹框 -->
    <holiday-dialog v-if="moment().isBetween('2019-01-29 16:59:59', '2019-02-10 24:00:00', 'second')"></holiday-dialog>
    <!--短期班结业报告入口-->
    <div class="report_enter_box" v-if="showReportEnter">
      <img src="/static/imgs/report/index_report_icon.png" @click="goReport">
      <a href="javascript:;" class="report_enter_close" @click="showReportEnter=false"></a>
    </div>
    <!--续报入口-->
    <a href="javascript:;" v-if="isReorder && (!isReorderStart || !isReorderEnd)" class="renewal_fixed" @click="goReorder"><img src="/static/imgs/renewal/fixed_ico.png"></a>
    <!--续报开始提示-->
    <div class="renewal_pop" v-if="isReorderStart && renewal_type == 1">
      <div class="renewal_pop_mask" @click="closeReorderStart"></div>
      <div class="renewal_con">
        <a href="javascript:;" class="close_renewal" @click="closeReorderStart"></a>
        <a href="javascript:;" class="renewal_start" @click="goReorder">
          <img src="../../assets/ico2/reorderStart.png">
        </a>
      </div>
    </div>
    <!--续报结束提示-->
    <div class="renewal_pop" v-if="isReorderEnd && renewal_type == 2">
      <div class="renewal_pop_mask" @click="closeReorderEnd"></div>
      <div class="renewal_con">
        <a href="javascript:;" class="close_renewal" @click="closeReorderEnd"></a>
        <a href="javascript:;" class="renewal_end" @click="goReorder">
          <img src="../../assets/ico2/reorderEnd.png">
        </a>
      </div>
    </div>
    <!--购买教材提醒-->
    <div class="renewal_pop" v-if="showBookTips">
      <div class="renewal_pop_mask"></div>
      <div class="buy_book_tips">
        <div class="buy_book_con">
          与您购买的<span>{{bookOrderInfo.title}}</span>课程相配套的教材已为您匹配。可进入<span>“我的-我的订单-已付款列表”</span>找到对应的课程购买教材。
        </div>
        <a href="javascript:;" class="buy_book_btn" @click="buyBook">前往购买</a>
        <img src="../../assets/close.png" class="close_tips" @click="closeBookTips">
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
import { isEmpty } from 'lodash';
import { Tab, TabItem } from 'vux';
import { setItem, getItem, removeItem, sessionGet, sessionSet } from '@/utils/localStorage';
import { mapState } from 'vuex';
import { getUserInfo, getReorder, getBannerList, setPointLog, setApilog, checkBook } from '@/api';
import { isComplete, goTest } from '@/utils/index.js';
import getOrigin from '@/utils/origin';
import Banner from '@/components/home/Banner';
import setPaddingBottom from '@/mixins/setPaddingBottom';
import peiyou from '@/mixins/peiyou';
import VxDialog from '@/components/dialog/Index';
import ReorderDialog from '@/components/dialog/ReorderDialog';
import HolidayDialog from '@/components/dialog/HolidayDialog';
import StageDialog from '@/components/dialog/StageTest';
import knowVipx from '@/components/know-vipx/KnowIndex';
import Normal from './Normal';

export default {
  components: {
    Tab,
    TabItem,
    Banner,
    Normal,
    VxDialog,
    ReorderDialog,
    HolidayDialog,
    StageDialog,
    knowVipx,
  },
  data() {
    return {
      newUser: '',
      courseType: -1,
      // showExpBox: false,
      dialogData: {
        show: false,
        tips: '您离开好久了呢，为保证孩子上课质量，需要参加级别测试',
        confirmText: '参加',
        cancelText: '不参加',
      },
      isReorder: false,
      isReorderStart: false,
      isReorderEnd: false,
      orderId: 0,
      reorderNum: 0,
      renewal_type: 0,
      imgs: [],
      imgUrls: [],
      expOrderId: 0,
      expClassroomId: 0,
      expPop: 0,
      testId: 0,
      showReportEnter: false,
      showStageTest: false, // 开始测试的弹窗
      showBookTips: false,
      bookOrderInfo: {},
    };
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
    /**微信账号是否已经绑定 */
    wechatBind() {
      const wechatKey = 'openid';
      return typeof this.$route.query[`${wechatKey}`] !== 'undefined' || getItem('openid');
    },
    routeName() {
      return this.$route.name;
    },
    origin() {
      return getOrigin();
    },
  },
  mounted() {
    this.init().catch((e) => {
      if (e === 'uncomplete') {
        this.$router.push({
          name: 'completeInformation',
        });
        return false;
      }
    });
    this.isNewUser();
    setTimeout(() => {
      const t = window.performance.timing;
      const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      const loadTime2 = t.loadEventEnd - t.navigationStart;
      const allTime = loadTime + loadTime2;
      setApilog({
        event_type: 20000,
        route: '/index',
        ext1: '1',
        ext2: `dom时长：${loadTime}`,
        ext3: `请求时长：${loadTime2}`,
        ext4: `总时长：${allTime}`,
      });
    }, 1000);
  },
  destroyed() {
    this.$vux.toast.hide();
  },
  mixins: [setPaddingBottom, peiyou],
  methods: {
    isNewUser() {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            if (res.data.member_level !== 0) {
              this.newUser = false;
            } else {
              this.newUser = true;
            }
          } else {
            console.log('请求失败');
          }
        });
      } else {
        console.log('no token');
      }
    },
    // 关闭购买教材弹窗
    closeBookTips() {
      this.showBookTips = false;
      setItem('book_pop', 1);
    },
    //购买教材
    buyBook() {
      this.$router.push({
        name: 'orderMaterial',
        query: {
          order_id: this.bookOrderInfo.order_id,
        },
      });
    },
    // 测试弹窗
    showTestDialog() {
      if (sessionGet('isFirstShowStageTest') === '1') return false;
      if (this.$store.state.userInfo.read_short_test === 1) {
        this.showStageTest = true;
        sessionSet('isFirstShowStageTest', '1');
      }
    },
     // 开始测试
    startTest() {
      goTest();
    },
    //关闭测试
    closeStageTest(val) {
      this.showStageTest = val;
    },
    //阅读结业证书
    goReport() {
      location.href = this.userInfo.read_short_report_url;
    },
    //检测微信是否绑定
    checkWechatBind() {
      if (this.wechatBind) {
        setItem('openid', this.$route.query.openid || getItem('openid'));
      }
      if (getOrigin() === 'wechat' && !this.wechatBind && process.env.NODE_ENV !== 'development') {
        const url = `${this.apiConfig.host}/wechat/check-openid`;
        this.$http.get(url).then((res) => {
          if (typeof res.data.url !== 'undefined') {
            location.href = res.data.url;
            return false;
          }
        });
      }
    },
    //获取用户信息并检测是否完整
    checkUserInfo() {
      return getUserInfo().then(() => {
        if (!isComplete(this.$store.state.userInfo)) {
          this.$router.push({
            name: 'completeInformation',
          });
          return;
        }
        if (this.$store.state.userInfo.read_short_report_url !== '') {
          this.showReportEnter = true;
        }
        this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.$store.state.userInfo.id}&grade_id=${this.$store.state.userInfo.grade_id}&level_id=${this.$store.state.userInfo.level_id}`).then((res) => {
          if (res.data.id) {
            this.testId = res.data.id;
          }
        });
      });
    },
    //bannerList
    setBannerList() {
      getBannerList().then(() => {
        this.imgs = this.$store.state.bannerList;
        for (let i = 0; i < this.imgs.length; i += 1) {
          this.imgUrls.push(this.imgs[i].url);
          this.imgs[i].url = '';
        }
      });
    },
    // 获取续报订单
    getReorder() {
      getReorder().then((res) => {
        if (res.error_code !== 0) {
          this.isReorderStart = false;
          this.isReorderEnd = false;
          return false;
        }
        this.orderId = res.data.order_id;
        this.reorderNum = res.data.order_num;
        this.renewal_type = res.data.renewal_type;
        this.isReorder = true;
        if (!getItem('reorderStartNew')) {
          setItem('reorderStartNew', 1);
          this.isReorderStart = true;
        } else if (getItem('reorderStartNew') === 2) {
          this.isReorderStart = false;
        } else if (getItem('reorderStartNew') === 1) {
          this.isReorderStart = true;
        }
        if (!getItem('reorderEndNew')) {
          setItem('reorderEndNew', 1);
          this.isReorderEnd = true;
        } else if (getItem('reorderEndNew') === 2) {
          this.isReorderEnd = false;
        } else if (getItem('reorderEndNew') === 1) {
          this.isReorderEnd = true;
        }
      });
    },
    //续报跳转
    goReorder() {
      this.$router.push({
        name: 'waitPay',
        query: {
          order_id: this.orderId,
        },
      });
      sessionSet('dataSource', 1);
      setPointLog(121, '/home', 1);
    },
    // 0元预约体验课
    freeExp() {
      this.expPop = 0;
      const url = `${this.apiConfig.host}order/orders/presell`;
      const userInfo = this.$store.state.userInfo;
      const data = {
        mobile: userInfo.mobile,
        grade_id: userInfo.grade_id,
        channel: 4,
        is_old: 1,
        is_check: 0,
        city_id: 7,
      };
      if (getItem('peiyou-uid')) {
        this.$set(data, 'channel', 2);
      }
      this.$http.post(url, data).then((res) => {
        if (res.error_code === 0 || res.error_code === 20401) {
          this.$router.push({ // 预约成功
            name: 'appointSucceed',
          });
        } else {
          this.expPop = 3;
        }
      });
      setApilog({
        event_type: 20004,
        route: '/index',
        ext1: '1',
        ext5: 'sure',
      });
    },
    cancelExp() {
      this.expPop = 0;
      setApilog({
        event_type: 20005,
        route: '/index',
        ext1: '1',
        ext5: 'cancel',
      });
    },
    selExp() {
      if (this.userInfo) {
        const url = `${this.apiConfig.host}course/temp/book-status`;
        this.$http.get(url).then((res) => {
          if (Number(res.data.order_status) === 0) {
            this.$router.push({
              name: 'waitPay',
              query: {
                order_id: res.data.order_id,
              },
            });
          } else if (Number(res.data.order_status) === 1) {
            this.$router.push({
              name: 'scheduleList',
              params: {
                classroomId: res.data.classroom_id,
              },
            });
          } else {
            // this.$router.push({
            //   name: 'expTime',
            // });
            // 判断是否有资格预约新生报
            const presellParams = {
              mobile: this.userInfo.mobile,
              grade_id: this.userInfo.grade_id,
              channel: 4,
              is_old: 1,
              is_check: 1, // 0-生成预售单 1-检查预售单
              city_id: 7,
            };
            if (getItem('peiyou-uid')) {
              this.$set(presellParams, 'channel', 2);
            }
            this.$http.post(`${this.apiConfig.host}order/orders/presell`, presellParams).then((response) => {
              if (Number(response.error_code) === 20401) { // 有预售单
                this.$router.push({
                  name: 'appointSucceed',
                });
              } else if (Number(response.error_code) === 20307) { // 在读学员
                this.expPop = 2;
              } else {
                this.expPop = 1;
              }
            });
          }
        });
      }
      setApilog({
        event_type: 20006,
        route: '/index',
        ext1: '1',
        ext5: 'subscribe',
      });
    },
    selTest() {
      if (!isEmpty(this.userInfo) && (this.testId === 0 || this.userInfo.level_id === 67)) {
        goTest();
      } else {
        this.$router.push({
          name: 'testRecord',
        });
      }
      setApilog({
        event_type: 20002,
        route: '/index',
        ext1: '1',
        ext5: 'entrancetest',
      });
    },

    cancelTest() {
      this.dialogData.show = false;
    },

    closeReorderEnd() {
      setItem('reorderEndNew', 2);
      this.isReorderEnd = false;
    },

    closeReorderStart() {
      setItem('reorderStartNew', 2);
      this.isReorderStart = false;
    },

    goWaitOrder() {
      if (this.reorderNum > 1) {
        this.$router.push({
          name: 'unpayOrder',
        });
        return;
      }
      this.$router.push({
        name: 'waitPay',
        query: {
          order_id: this.orderId,
        },
      });
    },

    guide() {
      this.$router.push({
        name: 'guide',
      });
    },

    moment(date) {
      return moment(date);
    },
    getChannel() {
      const queryChannel = this.$route.query.channel;
      if (getItem('channel')) {
        removeItem('channel');
      }
      if (queryChannel) {
        setItem('channel', this.$route.query.channel);
      }
    },
    //确认是否有续报购买的教材
    checkBook() {
      checkBook().then((res) => {
        if (res.error_code === 0) {
          const bookPop = getItem('book_pop');
          if (!bookPop) {
            this.showBookTips = true;
            this.bookOrderInfo = res.data;
          }
        }
      });
    },
    async init() {
      await this.getChannel();
      await this.checkPeiyouLogin();
      /* await this.$store.dispatch('updateLoading', {
        loading: true,
      }); */
      await this.setBannerList();
      await this.checkWechatBind();
      await this.checkUserInfo();
      await this.showTestDialog();
      // await this.checkExp();
      await this.getReorder();
      await this.checkBook();
      await this.$store.dispatch('updateLoading', {
        loading: false,
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.homepage{
  position: relative;
  min-height: 100%;
  background: @new-col-white;
  color: @col-darkgray;
  padding-bottom: 1rem !important;
  .newTestBox{
    margin: 0.88rem 0.4rem 0.46rem 0.4rem;
    background: @new-col-white;
    position: relative;
    height: 1rem;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      top: 0.1rem;
      height:1.02rem;
      background:linear-gradient(90deg,rgba(246,200,72,0.2) 0%,rgba(240,143,56,0.2) 100%);
      border-radius: 0.5rem;
      width: 100%;
    }
    .newTestContent{
      background: linear-gradient(90deg,rgba(246,200,72,1) 0%,rgba(240,143,56,1) 100%);
      border-radius: 0.5rem;
      height: 1rem;
      padding: 0 0.35rem;
      width: 100%;
      position: absolute;
      p{
        font-size: 0.3rem;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: @new-col-white;
        line-height: 1rem;
        text-align: right;
        span{
          .wh(.20rem,.27rem);
          .bg-m('@{img-path}/Combined-shape.png');
          background-size: 100%, 100%;
          margin-left: 0.2rem;
          display: inline-block;
        }
      }
    }
    .newTestImg{
      .wh(2.92rem,1.88rem);
      .bg-m('@{img-path}/newUser-head.png');
      background-size: 100%, 100%;
      position: absolute;
      top: -0.61rem;
      left: 0;
    }
  }
  .renewal_fixed{
    display: block;
    width: 1.42rem;
    height: 1.44rem;
    position: fixed;
    right: .2rem;
    bottom: 2.28rem;
    img{
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .renewal_pop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    .renewal_pop_mask{
      width: 100%;
      height: 100%;
      background: rgba(37,37,37,.8);
    }
    .buy_book_tips{
      width: 5.99rem;
      height: 7.46rem;
      background: url(../../assets/home_book_tips.png) no-repeat 0 0;
      background-size: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .buy_book_con{
        font-size: .3rem;
        padding: 3.72rem 0.52rem 0 0.6rem;
        color: #000;
        line-height: .48rem;
        span{
          color: #9A57C8;
          font-weight: bold;
        }
      }
      .buy_book_btn{
        display: block;
        font-weight: bold;
        width: 3.63rem;
        height: .76rem;
        position: absolute;
        bottom: .4rem;
        left: 1.18rem;
        background:linear-gradient(270deg,rgba(177,26,255,1),rgba(144,0,255,1));
        box-shadow:0 .06rem .06rem 0 rgba(180,1,255,0.3);
        border-radius:.38rem;
        font-size: .3rem;
        color: #fff;
        text-align: center;
        line-height: .76rem;
      }
      .close_tips{
        display: block;
        width: .4rem;
        height: .4rem;
        position: absolute;
        left: 50%;
        bottom: -.8rem;
        transform: translate(-50%, 0);
      }
    }
    .renewal_con{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .close_renewal{
        display: block;
        width: .4rem;
        height: .4rem;
        position: absolute;
        top: 0;
        right: .2rem;
        background: url(/static/imgs/report/close.png) no-repeat 0 0;
        background-size: 100% 100%;
      }
      .renewal_start{
        display: block;
        width: 5.41rem;
        height: 6.88rem;
      }
      .renewal_end{
        display: block;
        width: 6.87rem;
        height: 8.57rem;
      }
      img{
        display: block;
        width: 100%;
        height: auto;
      }
    }
  }
  .report_enter_box{
    width: 1.42rem;
    position: fixed;
    top: 8rem;
    right: .2rem;
    z-index: 501;
    img{
      display: block;
      width: 100%;
      height: auto;
    }
    .report_enter_close{
      display: block;
      width: .24rem;
      height: .24rem;
      margin: .1rem auto 0;
      background:url(/static/imgs/report/index_close.png) no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
  .nav{
    .nav;
  }
  .box {
    padding-bottom: .08rem;
    background: #fff;
    .box-title {
      height: .34rem;
      padding: 0 0 .05rem .35rem;
      line-height: .32rem;
      color:#1C223D;
      font-size: .36rem;
      font-weight: bold;
      font-family: PingFang-SC-Bold;
    }
    .box-body {
      display: flex;
      justify-content: space-around;
      padding: 0 .18rem;
    }

    .box-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 3.53rem;
      height: 1.83rem;
      margin-top: .1rem;
      padding: 0 .5rem 0 .31rem;
      .bg-m('../assets/home-test-bg.png', 0, 0, no-repeat);
      background-size: 3.53rem 1.83rem;
      color: #fff;
      .box-item-left {
        font-size: .34rem ;
        font-weight: bold;
        .tiny-text {
          font-size: .20rem;
          font-weight: lighter;
        }
      }
      .box-item-right {
        width: .6rem;
        height: .78rem;
        font-size: .36rem;
        .bg-m('../assets/home-test-icon.png', 0, 0, no-repeat);
        background-size: .6rem .78rem;

        &.home-fq-icon {
          .bg-m('../assets/home-fq-icon.png', 0, 0, no-repeat);
          background-size: .6rem .78rem;
        }
      }
    }
    .box-item-guide {
      .bg-m('../assets/home-guide-bg.png', 0, 0, no-repeat);
      background-size: 3.53rem 1.83rem;
    }
    /* 体验课选课样式 */
    .box-body-exp {
      position: relative;
      height: 2.4rem;
      margin: .2rem .35rem;
      background-image: -webkit-linear-gradient(0deg, #7e63e3, #a263e3);
      border-radius: .1rem;
      &::before{
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        content:"";
        width: 50%;
        height: 2.4rem;
        .bg-m('../assets/free-exp-bg.png', 0, 0, no-repeat);
        background-size: auto 100%;
      }
      .content{
        position: absolute;
        top: .38rem;
        right: .4rem;
        color: #fff;
        font-size: .2rem;
        text-align: right;
        h2{
          font-size: .38rem;
          line-height: .6rem;
          font-weight: 600;
          text-shadow: 0 .04rem .08rem rgba(95,19,254,1);
        }
        span{
          text-shadow: 0 .04rem .08rem rgba(95,19,254,1);
        }
        .free-join{
          display: block;
          width: 1.47rem;
          height: .53rem;
          line-height: .53rem;
          color: #A46534;
          text-align: center;
          background: #FFF32A;
          box-shadow: 0 .04rem .1rem 0 rgba(95,19,254,1);
          border-radius: .08rem;
          margin: .14rem 0 0 2.8rem;
        }
      }
    }
  }
  // 0元预约确认弹窗
  .common-pop{
    width: 6.5rem;
    height: 3.7rem;
    border-radius: .1rem;
    background: @col-white;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -3.25rem;
    margin-top: -1.85rem;
    z-index: 99999;
    padding: .85rem .72rem;
    p{
      text-align: center;
      font-size: .36rem;
      line-height: .5rem;
      margin-bottom: .76rem;
    }
    a{
      display: inline-block;
      width: 1.8rem;
      height: .7rem;
      border-radius: .1rem;
      text-align: center;
      font-size: .3rem;
      background: #fff;
      line-height: .7rem;
      &.cancel{
        color: #9A57C8;
        border: .02rem solid #9A57C8;
        margin-right: 1rem;
      }
      &.confirm{
        color: #fff;
        background: #9A57C8;
      }
      &.fail-btn{
        display: block;
        color: #fff;
        background: #9A57C8;
        margin: 0 auto;
      }
    }
  }
}
.pop-enter-active, .pop-leave-active {
  animation: pop .5s;
}
.vipx_title{
  height: 0.5rem;
  font-size: 0.36rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: @new-col-title-dark;
  line-height: 0.5rem;
  padding: 0 .4rem;
}
</style>
