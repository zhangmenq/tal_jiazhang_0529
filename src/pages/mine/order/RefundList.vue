<template>
  <div class="RefundList">
    <div class="comblock">
      <h2><span></span>订单详情</h2>
      <div class="detail-box">
        <div>实际支付金额(元）</div>
        <div>￥{{orderInfo.pay_fee | formatMoney}}</div>
      </div>
    </div>
    <div class="comblock">
      <h2><span></span>已上课次</h2>
      <div class="detail-box">
        <div>已上课次(周）</div>
        <div>{{refundInfo.learned_lessons || 0}}</div>
        <div class="price">-￥{{paidMoney | formatMoney}}</div>
      </div>
    </div>
    <div class="comblock" v-if="refundCourseMoney">
      <h2><span></span>扣款课次</h2>
      <div class="detail-box">
        <div>共{{ refundInfo.refund_lessons }}课次</div>
        <div class="price">-￥{{refundCourseMoney | formatMoney}}</div>
      </div>
    </div>
    <div class="comblock" v-if="orderInfo.book && orderInfo.book.id">
      <h2><span></span>教材状态</h2>
      <div class="detail-box" v-if="refundInfo.is_gift == 0 || oldOrderFlag">
        <div v-if="refundInfo.send_out_status === 0">未发货</div>
        <div v-else>已发货</div>
        <div class="price">-￥{{refundInfo.book_not_refund || 0 | formatMoney}}</div>
      </div>
      <div class="detail-box" v-else>
        <div v-if="refundInfo.send_out_status === 0">未发货</div>
        <div v-else-if="refundInfo.learned_lessons <= 9">已发货（实际消耗课次≤9）</div>
        <div v-else>实际消耗课次>9</div>
        <div class="price">-￥{{refundInfo.book_not_refund || 0 | formatMoney}}</div>
      </div>
    </div>
    <div class="comblock">
      <h2><span></span>退款金额</h2>
      <div class="detail-box">{{refundFormula}}</div>
    </div>
    <div class="comblock" v-if="refundInfo.exception_refund.length > 0">
      <div class="exception"><span class="icon">!</span>异常退费</div>
      <div class="detail-box exception" v-for="(item, index) in refundInfo.exception_refund" :key="index">
        <div>{{item.title}}</div>
        <div v-if="item.no > 0">{{item.no}}</div>
        <div class="price">已退款¥{{item.refunds_fee | formatMoney}}</div>
      </div>
    </div>
    <div class="comblock refund-hint">
      退款明细说明： <br/>
      <template v-if="isDateFlag === 1">
        一、课程退费规则<br/>
        1、同一级别，学员享有一次全额退款的权利，且全额退款指学员上完第一节课且在第二节课开课24小时之前可以全额退费。<br/>
        2、学员在第二次课开课后退费（含第二次课）<br/>
        应退金额=实际缴费金额 - 课单价原价（ Reach课程课单价原价为270元；HE课程课单价原价为192元）✖ 实际消耗课次（剩余课次按照1对1课程消耗课次计算）；<br/>
        二、Reach教材退费规则<br/>
        若学员购买Reach课程时，同时购买了教材，在发生退费时规则如下：<br/>
        &nbsp;（1）若教材未发货，则教材费可退；<br/>
        &nbsp;（2）若教材已发货，则教材费不可退。<br/>
        若学员购买Reach课程时，获赠且勾选了免费教材，在发生退费时规则如下：<br/>
        &nbsp;（1）若教材未发货，则无需扣除教材费；<br/>
        &nbsp;（2）若教材已发货，且甲方实际消耗的课程周数量小于10周课，则需要扣除教材费即按如下公式计算：<br/>
        &nbsp; 应退金额 = 实际缴费金额 - 课单价原价（270元）✖ 实际消耗课次-教材价格（599元）；<br/>
        &nbsp;（3）若教材已发货，且甲方实际消耗的课程周数量大于或等于10周课，则无需扣除教材费；<br/>
      </template>
      <template v-else-if="isDateFlag === 2">
        一、课程退费规则<br/>
        1.同一级别，学员享有一次全额退款的权利，且全额退款指学员上完第一节课且在第二节课开课24小时之前可以全额退费。<br/>
        2.学员在第二次课开课后退费（含第二次课）<br/>
        应退金额 = 实际缴费课程金额 - 课单价（见备注1） ✖️ 实际消耗课次<br/>
        备注：<br/>
        1.课单价 = ( 订单实际缴费金额 - 教材费 ) /  购买课节数<br/>
        2.如若订单中未购买教材，则该订单中的教材费为0元。<br/>
        3.学员在操作退费时，若最近一次课离上课时间小于24小时，该课节不予退费<br/>
        二、Reach教材退费规则<br/>
        若学员购买了教材，在发生退费时规则如下：<br/>
        &nbsp;（1）以学员购买成功当天计算，30天内且教材未拆封，可操作退费。<br/>
        &nbsp;（2）以学员购买成功当天计算，超过30天，则不可操作退费。<br/>
        &nbsp;（3）若教材已拆封，则不可操作退费。<br/>
      </template>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { orderDetail } from '@/api';
import { formatMoney } from '@/filters';

export default {
  name: 'refundList',
  data() {
    return {
      orderInfo: {
        total_fee_refund: 0,
        pay_fee: 0,
      },
      refundInfo: {
        exception_refund: [],
      },
      refundFormula: '', // 金额公式
      discount: 1, // 员工折扣
      paidMoney: 0, // 已上课需要付的
      oldOrderFlag: false, // 是否为老的订单
      refundCourseMoney: 0,
      isDateFlag: 0,
    };
  },
  filters: { formatMoney },
  computed: {
    orderId() {
      return this.$route.query.order_id || 0;
    },
    // isDateFlag() { // 日期
    //   return moment() < moment('2019-04-29');
    // },
  },
  methods: {
    getRefundInfo() {
      return this.$http.get(`${this.apiConfig.host}/order/orders/${this.orderId}/refund`).then((res) => {
        if (res.error_code === 0) {
          this.refundInfo = res.data;
        }
      });
    },
    formatMoney(money) {
      const theMoney = Number(money);
      return (theMoney / 100).toFixed(2);
    },
    getOrderInfo() {
      return orderDetail(this.orderId).then((res) => {
        if (res.error_code === 0) {
          this.orderInfo = res.data;
          const discount = this.orderInfo.discount / 10 || 1; // 员工折扣
          const learnedLessons = this.refundInfo.learned_lessons + this.refundInfo.refund_lessons; // 已上课次
          const lessonPrice = this.refundInfo.lesson_price; // 单节课金额
          // 退款金额
          let refundMoney = this.orderInfo.pay_fee;
          // 退款公式
          this.refundFormula = `${this.formatMoney(this.orderInfo.pay_fee)}`;
          if (this.orderInfo.book && this.orderInfo.book.id) { // 减去教材金额
            refundMoney -= this.refundInfo.book_not_refund;
            this.refundFormula += ` - ${this.formatMoney(this.refundInfo.book_not_refund)}`;
          }
          if (this.refundInfo.is_new_rules === 1) {
            // 已上完课的费用
            this.paidMoney = learnedLessons * lessonPrice || 0;
            this.refundFormula += ` - ${learnedLessons} x ${this.formatMoney(lessonPrice)}`;
          } else {
            // 已上完课的费用
            this.paidMoney = learnedLessons * lessonPrice * discount || 0;
            if (discount < 1) { // 是否有折扣
              this.refundFormula += ` - ${learnedLessons} x ${this.formatMoney(lessonPrice)} x ${discount}`;
            } else {
              this.refundFormula += ` - ${learnedLessons} x ${this.formatMoney(lessonPrice)}`;
            }
          }
          refundMoney -= this.paidMoney;
          refundMoney = refundMoney > 0 ? refundMoney : 0;
          this.refundFormula += ` = ${this.formatMoney(refundMoney)}`;
          if (moment(this.orderInfo.created_at) < moment('2018-11-05')) {
            this.oldOrderFlag = true;
          }
          if (moment(this.orderInfo.created_at) > moment('2019-05-04 23:00:00')) {
            this.isDateFlag = 2;
          } else {
            this.isDateFlag = 1;
          }
          if (this.refundInfo.refund_lessons > 0) {
            this.refundCourseMoney = this.refundInfo.refund_lessons * lessonPrice;
          }
        }
      });
    },
    getInfo() {
      return this.getRefundInfo().then(() => {
        this.getOrderInfo();
      });
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.getInfo();
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
};
</script>
<style lang="less">
@import '../../../styles/basic';

.RefundList{
  background: @col-bg;
  padding: .2rem;
  min-height: 100%;
  font-size: .36rem;
  .comblock{
    background: @col-white;
    padding: .2rem;
    .clearfix();
    margin-bottom: .2rem;
    border-radius: .1rem;
    h2{
      font-weight: bold;
      font-size: .36rem;
      .l-h(.5rem);
      margin-bottom: .2rem;
      span{
        display: inline-block;
        .wh(.06rem,.3rem);
        background: @col-purple;
        vertical-align: middle;
        margin: -.02rem .2rem 0 0;
      }
    }
    .exception{
      font-size: .3rem;
      .l-h(.42rem);
      margin-bottom: .2rem;
      .icon{
        font-size: .26rem;
        display: inline-block;
        .wh(.31rem, .31rem);
        border: .015rem solid @col-price;
        border-radius: 50%;
        color: @col-price;
        text-align: center;
        line-height: .3rem;
        margin-right: .15rem;
      }
    }
  }
  .detail-box{
    font-size: .3rem;
    margin-bottom: .1rem;
    padding-left: .2rem;
    display: flex;
    justify-content: space-between;
    &.exception{
      font-size: .28rem;
    }
    .price{
      color: @col-price;
    }
  }
  .refund-hint{
    font-size: .26rem;
    color: #A9A9A9;
  }
}
</style>
