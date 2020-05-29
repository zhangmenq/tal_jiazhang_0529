<template>
  <div class="confirm-order">
    <div class="write-border">
      <h2>{{ courseInfo.title }}</h2>
      <p class="bottom-line"></p>
      <ul>
        <li><span>学习时长：</span> {{ courseInfo.start_at }} — {{ courseInfo.end_at }}</li>
        <li><span>上课时间：</span> {{ time ? times : orderInfo.time }}</li>
        <li><span>共计课时：</span> {{ lessons }}节</li>
        <li v-if="courseInfo.type == 1 && time">
          <span>授课老师：</span>
          {{ teacherInfo.realname }}
          <img :src="teacherInfo.avatar_url" class="head-portrait" v-if="teacherInfo.avatar_url"/>
          <img src="../../assets/default-photo-teacher.png" class="head-portrait" v-if="!teacherInfo.avatar_url" />
        </li>
        <li v-else-if="courseInfo.type == 1">
          <span>授课老师：</span>
          {{ orderInfo.teacher.realname }}
          <img :src="orderInfo.teacher.avatar_url" class="head-portrait" v-if="orderInfo.teacher.avatar_url"/>
          <img src="../../assets/default-photo-teacher.png" class="head-portrait" v-if="!orderInfo.teacher.avatar_url" />
        </li>
      </ul>
    </div>
    <div class="write-border block-show" v-if="origin === 'time' && userInfo.balance > 0">
      <label class="radio-checkbox-label">
        <input class="comcheckbox"
          type="checkbox"
          name="demo-checkbox1"
          v-model="useBalance"
          :disabled="isDisabled">
        <span class="comcheckboxInput"></span>
        使用账户余额
      </label>
      <span>
        剩余<i class="price">{{ remindBalance | formatMoney }}</i>元
      </span>
    </div>

    <div class="write-border" v-if="origin === 'time'">
      <h2>费用明细</h2>
      <ul class="cost-details">
        <li>
          <span>课程费用</span>
          <i>￥{{ courseFee | formatMoney }}</i>
        </li>
        <!-- <li>
          <span>讲义费用</span>
          <i>￥20</i>
        </li> -->
        <li v-show="useBalance > 0">
          <span>余额支付</span>
          <i class="price">-￥{{ balanceFee | formatMoney }}</i>
        </li>
        <!-- <li>
          <span>折扣优惠</span>
          <i class="price">-￥200</i>
        </li> -->
      </ul>
      <p class="bottom-line"></p>
      <p class="actually-paid">实付￥{{ payFee | formatMoney }}</p>
    </div>

    <div class="write-border" v-if="origin === 'unpay'">
      <h2>费用明细</h2>
      <ul class="cost-details">
        <li>
          <span>课程费用</span>
          <i>￥{{ orderInfo.total_fee | formatMoney }}</i>
        </li>
        <!-- <li>
          <span>讲义费用</span>
          <i>￥20</i>
        </li> -->
        <li v-show="orderInfo.balance_fee > 0">
          <span>余额支付</span>
          <i class="price">-￥{{ orderInfo.balance_fee | formatMoney }}</i>
        </li>
        <!-- <li>
          <span>折扣优惠</span>
          <i class="price">-￥200</i>
        </li> -->
      </ul>
      <p class="bottom-line"></p>
      <p class="actually-paid">实付￥{{ orderInfo.total_fee | formatMoney }}</p>
    </div>

    <p class="service-tel"><i>&nbsp;</i>客服电话：<span>4008002211</span>转9</p>
    <div class="immediately-apply">
      <x-button :gradients="['#4d6ff5', '#67b9f9']"
        @click.native="peparePay()">
        ￥{{ time ? payFee : orderInfo.total_fee | formatMoney }}
        <em>{{ !isDisabled ? '去支付' : '支付中...' }}</em>
      </x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';
import pay from '@/mixins/pay.js';

/* eslint-disable no-undef */
export default {
  name: 'payOrder',
  components: {
    XButton,
  },
  mixins: [pay],
  data() {
    return {
      teacherId: 0,
      balance: 0,
      useBalance: 0, // 是否使用账户余额
      courseFee: 0, // 课程总金额
      couponFee: 0, // 优惠券金额
      discountFee: 0, // 折扣金额
      courseInfo: {},
      lessons: 0, //课节数
      midCourse: false, //插班报
      teacherInfo: {},
      userInfo: {},
      orderId: '',
      orderInfo: { teacher: {}, course: {} },
      timer: '',
    };
  },
  computed: {
    week() {
      if (this.$route.query.week) {
        return this.$route.query.week;
      }
    },
    time() {
      if (this.$route.query.time) {
        return this.$route.query.time;
      }
    },
    times() {
      if (this.$route.query.time) {
        return this.computeTimes(this.week, this.time);
      }
    },
    courseId() {
      if (this.$route.query.course_id) {
        return this.$route.query.course_id;
      }
    },
    courseType() {
      return this.$route.query.type || 1;
    },
    // 实际支付的金额
    payFee() {
      if (this.$route.query.order_id) {
        return this.orderInfo.pay_fee;
      }
      return this.courseFee - this.balanceFee;
    },
    // 余额支付的金额
    balanceFee() {
      if (this.useBalance) {
        return this.courseFee >= this.userInfo.balance
          ? this.userInfo.balance
          : this.courseFee;
      }
      return 0;
    },
    remindBalance() {
      if (this.$route.query.week) {
        if (this.useBalance) {
          return this.courseFee >= this.userInfo.balance
            ? 0
            : this.userInfo.balance - this.courseFee;
        }
        return this.userInfo.balance;
      }
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.confirm-order{
  background: @col-bg;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding-bottom: 1.1rem;
  .write-border{
    padding: 0 .3rem;
    background: @col-white;
    border-radius: .2rem;
    margin: .2rem .2rem 0 .2rem;
  }
  h2{
    font-size: .36rem;
    color: @col-darkgray;
    padding: .3rem 0;
  }
  .bottom-line{
    border-bottom: .01rem solid @col-gray;
  }
  ul{
    padding-bottom: .3rem;
    &.cost-details{
      li{
        display: flex;
        justify-content: space-between;
      }
    }
    li{
      margin-top: .2rem;
      font-size: .26rem;
      color: @col-darkgray;
      span{
        color: @col-gray;
      }
      .head-portrait{
        .wh(.4rem,.4rem);
        border-radius: 100%;
        vertical-align: middle;
      }
    }
  }
  .block-show{
    font-size: .26rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.1rem;
    span{
      color: @col-gray;
    }
  }
  .price{
    color: @col-lightred;
  }
  .actually-paid{
    text-align: right;
    font-size: .3rem;
    color: @col-darkgray;
    .l-h(1.1rem);
  }
  .immediately-apply{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.1rem;
    background: @col-white;
    z-index: 500;
    .weui-btn{
      height: 100%;
      font-size: .48rem;
      em{
        font-size: .36rem;
        margin: 0 0 0 .1rem;
      }
    }
  }
  .radio-checkbox-label{
    margin:.2rem .2rem 0 0;
    display:inline-block;
    .comcheckbox{display:none}
    .comcheckboxInput{
      background: @col-white;
      border: .02rem solid @col-gray;
      border-radius: 100%;
      display: inline-block;
      .wh(.28rem,.28rem);
      margin-right: .1rem;
      margin-top: -.001rem;
      vertical-align: middle;
      line-height: 1
    }
    .comcheckbox:checked + .comcheckboxInput:after{
      .bg-m('@{img-path}/confirm-order-img1.png',0,0,no-repeat);
      border-radius: 100%;
      content: "";
      margin: -.01rem 0 0 -.01rem;
      display: inline-block;
      .wh(.3rem,.3rem);
    }
  }
}
</style>
