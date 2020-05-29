<template>
  <div class="mine_new" ref="mine">
    <!--头部个人信息-->
    <div class="mine_info">
      <router-link class="mine_info_set" :to="{path: '/mine/set'}"></router-link>
      <div class="mine_info_con">
        <router-link class="mine_info_avatar" :to="{name: 'profile'}">
          <img v-if="resData.avatar_url" :src="resData.avatar_url"/>
          <img v-else src="../../assets/default-photo.png"/>
        </router-link>
        <div class="mine_info_txt">
          <router-link :to="{name: 'profile'}">
            <p class="username">{{resData.realname}}<img src="../../assets/ico2/mine-arr.png"/></p>
            <img class="sex" v-if="resData.sex === 1" src="../../assets/ico2/mine-boy.png"/>
            <img class="sex" v-if="resData.sex === 2" src="../../assets/ico2/mine-girl.png"/>
          </router-link>
        </div>
      </div>
    </div>
    <!--订单物流-->
    <div class="mine_items">
      <h4 class="mine_items_title">订单物流</h4>
      <div class="mine_items_con">
        <router-link class="item" :to="{path: '/mine/order'}">
          <span class="mine_order"></span>
          <p class="item_txt">我的订单</p>
        </router-link>
        <router-link class="item" :to="{path: '/mine/logistics'}">
          <span class="mine_express"></span>
          <p class="item_txt">快递查询</p>
        </router-link>
        <!-- <router-link class="item" :to="{path: '/mine/address'}">
          <span class="mine_address"></span>
          <p class="item_txt">收货地址</p>
        </router-link> -->
        <router-link class="item" :to="{path: '/mine/coupon'}">
          <span class="mine_coupon"></span>
          <p class="item_txt">优惠券</p>
        </router-link>
      </div>
    </div>
    <!--自助服务-->
    <div class="mine_items">
      <h4 class="mine_items_title">自助服务</h4>
      <div class="mine_items_con">
        <router-link class="item" :to="{path: '/mine/favorite'}">
          <span class="mine_teacher"></span>
          <p class="item_txt">关注老师</p>
        </router-link>
        <router-link v-if="isShowReport" class="item" :to="{path: '/mine/report'}">
          <span class="mine_report"></span>
          <p class="item_txt">我的报告</p>
        </router-link>
        <router-link class="item" :to="{path: '/mine/record/adjust'}">
          <span class="mine_class"></span>
          <p class="item_txt">调课记录</p>
        </router-link>
        <router-link class="item" :to="{path: '/mine/record/classroom'}">
          <span class="mine_change"></span>
          <p class="item_txt">转班记录</p>
        </router-link>
        <div class="item" @click="recommended(2)">
          <span class="mine_recommend"></span>
          <p class="item_txt">我的推荐</p>
        </div>
        <div class="item" @click="enterTest()">
          <span class="mine_test"></span>
          <p class="item_txt">入学测试</p>
        </div>
        <router-link class="item" :to="{path: '/guide'}">
          <span class="mine_qa"></span>
          <p class="item_txt">常见问题</p>
        </router-link>
        <!-- <router-link class="item" :to="{path: '/mine/coupon'}" style="visibility:hidden">
          <span class="mine_feedback"></span>
          <p class="item_txt">问题反馈</p>
        </router-link> -->
      </div>
    </div>
    <!--了解VIPX-->
    <div class="mine_items">
      <router-link :to="{path: '/about', query:{index: 0}}">
        <h4 class="mine_items_title">了解VIPX<span>></span></h4>
      </router-link>
      <div class="mine_items_con">
        <router-link class="item" :to="{path: '/about', query:{index: 0}}">
          <span class="mine_culture"></span>
          <p class="item_txt">培养目标</p>
        </router-link>
        <router-link class="item" :to="{path: '/about', query:{index: 1}}">
          <span class="mine_teaching"></span>
          <p class="item_txt">教学模式</p>
        </router-link>
        <router-link class="item" :to="{path: '/about', query:{index: 2}}">
          <span class="mine_book"></span>
          <p class="item_txt">教材体系</p>
        </router-link>
        <router-link class="item" :to="{path: '/about', query:{index: 3}}">
          <span class="mine_team"></span>
          <p class="item_txt">师资团队</p>
        </router-link>
      </div>
    </div>
    <pop-up v-show="popUp" popType="qualification" @close="popUp = false"></pop-up>
  </div>
</template>

<script>
import { Cell, Group, XButton } from 'vux';
import { getUserInfo, getMyReport, setApilog } from '@/api';
import getOrigin from '@/utils/origin';
import { goTest } from '@/utils/index.js';
import setPaddingBottom from '../../mixins/setPaddingBottom';
import { clearLocalStorage, getItem, setItem } from '../../utils/localStorage';
import { clearSessionStorage } from '../../utils/sessionStorage';
import PopUp from '../activities/introduce/PopUp';

export default {
  name: 'mine',
  components: {
    Cell,
    Group,
    XButton,
    PopUp,
  },
  mixins: [setPaddingBottom],
  data() {
    return {
      resData: '',
      pyUid: '',
      popUp: false,
      testId: 0,
      isShowReport: false,
    };
  },
  computed: {
    origin() {
      if (getOrigin().startsWith('peiyou')) {
        return true;
      }
      return false;
    },
  },
  methods: {
    btnExit() {
      const openId = getItem('openid') || '';
      const bookPop = getItem('book_pop');
      this.$http.delete(`${this.apiConfig.host}/oauth2/token?open_id=${openId}`).then((res) => {
        if (res.error_code === 0) {
          clearLocalStorage();
          clearSessionStorage();
          if (bookPop) {
            setItem('book_pop', 1);
          }
          window.location.href = '/login';
        }
      });
    },
    getUserInfor() {
      return getUserInfo().then(() => {
        this.resData = this.$store.state.userInfo;
        this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.resData.id}&grade_id=${this.resData.grade_id}&level_id=${this.resData.level_id}`).then((res) => {
          if (res.data.id) {
            this.testId = res.data.id;
          }
        });
      });
    },
    enterTest() {
      if (this.testId === 0 || this.resData.level_id === 67) {
        goTest(this.resData.grade_id, this.resData.level_id);
      } else {
        this.$router.push({
          name: 'testRecord',
        });
      }
    },
    recommended(type) {
      this.$http.get(`${this.apiConfig.host}student/introduce-qualification`).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        if (res.data === 1) {
          if (type === 1) {
            if (this.origin) { // 培优统计
              this.$http.get(`${this.apiConfig.host}student/active-count?type=peiyou_recommend_click`);
            } else {
              this.$http.get(`${this.apiConfig.host}student/active-count?type=my_recommend_click`);
            }
            this.$router.push({ // 推荐有奖
              name: 'introduceRecommendedPrize',
            });
          } else {
            this.$router.push({ // 我的推荐
              name: 'introduceMyRecommended',
            });
          }
        } else {
          this.popUp = true;
        }
      });
    },
    //获取是否有我的报告
    getMyReport() {
      getMyReport().then((res) => {
        if (res.error_code !== 0) {
          return;
        }
        if (res.data.length > 0) {
          this.isShowReport = true;
        }
      });
    },
  },
  async mounted() {
    this.pyUid = getItem('peiyou-uid');
    await this.getUserInfor();
    await this.getMyReport();
    await setApilog({
      event_type: 70005,
      route: '/mine',
    });
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
@new-col-yellow: #FEC90D;
@new-col-darkpurple: #35255E;

.mine_new{
  padding: .4rem .36rem 1.2rem;
  min-height: 100%;
  .mine_info{
    height: 2.82rem;
    .bg-m('@{img-path}/ico2/mine-banner.png');
    background-size: 100%;
    position: relative;
    .mine_info_set{
      display: block;
      width: .4rem;
      height: .38rem;
      position: absolute;
      right: .34rem;
      top: .3rem;
      .bg-m('@{img-path}/ico2/mine-set.png');
      background-size: 100%;
    }
    .mine_info_con{
      padding: .56rem 0 0;
      margin: 0 .74rem 0 .4rem;
      display: flex;
      .mine_info_avatar{
        width: 1rem;
        height: 1rem;
        border: .05rem solid @new-col-yellow;
        border-radius: 50%;
        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .mine_info_txt{
        margin-left: .2rem;
        .username{
          padding-top: .05rem;
          line-height: .5rem;
          font-size: .36rem;
          color: #fff;
          img{
            width: .13rem;
            height: .22rem;
            margin-left: .1rem;
          }
        }
        .sex{
          display: block;
          width: .28rem;
          height: .28rem;
          margin-top: .05rem;
        }
      }
    }
  }
  .mine_items{
    margin: .2rem .04rem 0;
    .mine_items_title{
      color: @new-col-darkpurple;
      font-size: .36rem;
      line-height: .5rem;
      font-weight: bold;
      span{
        float: right;
        font-weight: normal;
      }
    }
    .mine_items_con{
      display: flex;
      // flex-direction: row;
      // justify-content: space-between;
      padding-bottom: .54rem;
      border-bottom: .02rem solid #EEEEEE;
      flex-wrap: wrap;
      .item{
        width: 25%;
        text-align: center;
        margin: .48rem 0 0;
        span{
          display: block;
          width: .52rem;
          height: .52rem;
          margin: 0 auto;
          background-image: url(../../assets/ico2/mine-icon.png);
          background-repeat: no-repeat;
          &.mine_order{
            background-position: 0 0;
            background-size: 100% auto;
          }
          &.mine_express{
            background-position: 0 -.52rem;
            background-size: 100% auto;
          }
          &.mine_address{
            background-position: 0 -1.04rem;
            background-size: 100% auto;
          }
          &.mine_coupon{
            background-position: 0 -1.56rem;
            background-size: 100% auto;
          }
          &.mine_teacher{
            background-position: 0 -2.08rem;
            background-size: 100% auto;
          }
          &.mine_report{
            background-position: 0 -2.6rem;
            background-size: 100% auto;
          }
          &.mine_class{
            background-position: 0 -3.12rem;
            background-size: 100% auto;
          }
          &.mine_change{
            background-position: 0 -3.64rem;
            background-size: 100% auto;
          }
          &.mine_recommend{
            background-position: 0 -4.16rem;
            background-size: 100% auto;
          }
          &.mine_test{
            background-position: 0 -4.68rem;
            background-size: 100% auto;
          }
          &.mine_qa{
            background-position: 0 -5.2rem;
            background-size: 100% auto;
          }
          &.mine_feedback{
            background-position: 0 -5.72rem;
            background-size: 100% auto;
          }
          &.mine_culture{
            background-position: 0 -6.24rem;
            background-size: 100% auto;
          }
          &.mine_teaching{
            background-position: 0 -6.76rem;
            background-size: 100% auto;
          }
          &.mine_book{
            background-position: 0 -7.28rem;
            background-size: 100% auto;
          }
          &.mine_team{
            background-position: 0 -7.8rem;
            background-size: 100% auto;
          }
        }
        .item_txt{
          font-size: .3rem;
          line-height: .32rem;
          color: #35255E;
          margin-top: .20rem;
        }
      }
    }
    
  }
}
</style>
