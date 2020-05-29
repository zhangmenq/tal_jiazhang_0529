<template>
  <div class="pay-order-detail">
    <template v-if="!showProtocol">
      <!-- <div class="item-box-address"  v-if="orderInfo.status === 1 && book && book.id" @click="goLogistics">
      <span class="logistics-status">
        <em class="logistics-icon"></em>{{ book.confirm === 1 ? '已发货' : '待发货'}}
        <em class="arrow-icon"></em>
      </span>
    </div> -->
      <!-- <div class="item-box-fluid" v-else>
      <p class="paid-tit center" v-if="orderInfo.status === 1">
        <span><em><icon type="success-no-circle"></icon></em>订单已支付</span>
      </p>
      <p class="pay-tit" v-if="orderInfo.status === -1 || orderInfo.status === -2">已取消</p>
      <p class="pay-tit" v-if="orderInfo.status === -3 || orderInfo.status === -4">退款</p>
    </div>
    <div class="address-box" v-if="book && book.title">
      <p class="address-bar"></p>
      <div class="item-box-logistics" v-if="book.address">
        <div class="icon-box"><em class="address-icon"></em></div>
        <div class="logistics-address-info">
          <p>
            <span class="user-name">{{book.name}}</span>
            <span class="mobile" v-if="book.mobile">{{book.mobile | formatMobile}}</span>
          </p>
          <p class="address">{{book.area}} {{book.address}}</p>
          <x-button class="change-address"
            v-if="book.confirm === 0 && orderInfo.status !== -1 && orderInfo.status !== -3 && orderInfo.status !== -4"
            @click.native="changeAddress()">
            修改地址
          </x-button>
        </div>
      </div>
      <div class="item-box-logistics column" v-else>
        <div class="address-null">
          <p>您还没有填写收货地址，请尽快填写~</p>
          <p>否则教材无法邮寄</p>
        </div>
        <x-button class="change-address"
          v-if="book.confirm === 0 && orderInfo.status !== -1 && orderInfo.status !== -3 && orderInfo.status !== -4"
          @click.native="changeAddress()">
          添加地址
        </x-button>
      </div>
    </div> -->
      <div class="item-box" v-if="(orderInfo.status === -3 || orderInfo.status === -4) && orderInfo.refund">
        <div class="comm-tit">退款信息</div>
        <div class="logistics-infor">
          <p><span class="name">退款方式：</span><span class="val">{{orderInfo.refund.refund_way}}</span></p>
          <p><span class="name">申请退款：</span><span class="val">{{orderInfo.refund.created_at}}</span></p>
          <p><span class="name">退款金额：</span><span class="val">¥{{orderInfo.refund.refund_fee | formatMoney}}</span></p>
        </div>
      </div>
      <div class="item-box">
        <div class="comm-tit">{{orderInfo.buy_book?'商品清单':'课程清单'}}</div>
        <ul class="lists-item">
          <li @click="courseLists()" v-if="!orderInfo.buy_book">
            <p class="title-box">
              <span class="title">{{title}}</span>
              <span class="title-info">查看课程信息&nbsp;&gt;</span>
            </p>
            <div class="details-box" v-if="orderInfo.presell !== 1">
              <p class="time">{{start_at | formatDate('YYYY.MM.DD')}} - {{end_at | formatDate('YYYY.MM.DD')}}</p>
              <span class="price">
                <em class="current">¥{{price | formatMoney}}</em>
              </span>
            </div>
          </li>
          <li v-if="book && book.title" @click="bookDetails()">
            <p class="title-box">
              <span class="title">{{book.title}}</span>
              <span class="title-info">查看教材信息&nbsp;&gt;</span>
            </p>
            <div class="details-box">
              <span class="price">
                <em class="original" v-if="book.total_fee !== book.pay_fee">
                  ¥{{book.total_fee | formatMoney}}
                </em>
                <em class="current">¥{{book.pay_fee | formatMoney}}</em>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="item-box">
        <div class="comm-tit">费用明细</div>
        <div class="cost-details">
          <p v-if="!orderInfo.buy_book"><span class="name">课程费用</span><span class="val">¥{{price | formatMoney}}</span></p>
          <p v-if="book.title">
            <span class="name">教材费用</span>
            <span class="val">¥{{book.total_fee | formatMoney}}</span>
          </p>
          <br>
          <p v-if="orderInfo.gift_fee > 0">
            <span class="name">教材优惠</span>
            <span class="val">
              <i>-¥{{orderInfo.gift_fee | formatMoney}}</i>
            </span>
          </p>
          <p v-if="orderInfo.course_discount_fee > 0">
            <span class="name">课程折扣</span>
            <span class="val">
              <i>-¥{{orderInfo.course_discount_fee | formatMoney}} ({{orderInfo.course_discount}}折)</i>
            </span>
          </p>
          <p v-if="orderInfo.discount_fee > 0">
            <span class="name">员工折扣</span>
            <span class="val">
              <i>-¥{{orderInfo.discount_fee | formatMoney}} ({{orderInfo.discount}}折)</i>
            </span>
          </p>
          <p v-if="orderInfo.coupon_fee > 0">
            <span class="name">优惠券</span>
            <span class="val">
              <i>-¥{{orderInfo.coupon_fee | formatMoney}}</i>
            </span>
          </p>
        </div>
        <p class="total">应付金额<span class="money">￥{{orderInfo.pay_fee | formatMoney}}</span></p>
      </div>
      <div class="item-box">
        <div class="order-title">
          <p class="comm-tit">订单信息</p>
          <span class="btn-add" v-if="orderInfo.can_refund && orderInfo.status === 1">
            <x-icon type="ios-plus-outline" size="0.46rem" @click="popShow"></x-icon>
          </span>
        </div>
        <div class="logistics-infor">
          <p>
            <span class="name">订&nbsp;&nbsp;单&nbsp;&nbsp;号：</span>
            <span class="val">{{orderInfo.order_sn}}</span>
          </p>
          <p>
            <span class="name">下单时间：</span>
            <span class="val">{{orderInfo.created_at}}</span>
          </p>
          <p v-if="[1, -3, -4].indexOf(orderInfo.status) > -1">
            <span class="name">支付时间：</span>
            <span class="val">{{orderInfo.paid_at}}</span>
          </p>
          <p>
            <span class="name">支付方式：</span>
            <span class="val">{{orderInfo.pay_way}}</span>
          </p>
        </div>
      </div>
      <p class="hot-line" v-if="showAgreement">
        <span class="agreement" @click="showProtocol=true">
          已阅读并同意<i>《课程购买协议》</i>
        </span>
      </p>
      <p class="hot-line">
        <span class="inner">客服电话：
          <a href="tel:4008002211">4008002211</a> 转9
        </span>
      </p>
      <div v-transfer-dom class="cus-dialog">
        <popup v-model="showPop">
          <ul class="cus-popup">
            <li @click="refund()" v-if="orderInfo.refund_status">
              退款
            </li>
            <li class="gray" v-else>
              <p>退款</p>
              <p class="red">距开课时间不足24小时，该课次不予退款。</p>
            </li>
            <li>客服电话：
              <a href="tel:4008002211">4008002211</a>转9
            </li>
          </ul>
        </popup>
      </div>
    </template>
    <BuyProtocol v-if="showProtocol" @close="showProtocol=false" :agreement="2" :created_at="orderInfo.created_at"></BuyProtocol>
    <!-- 30天不能退款弹窗 -->
     <refund-dialog
      :show="dialogData.show"
      :tips="dialogData.tips"
      @RefundConfirm="refundCancl()"
      @onCancel="refundCancl()"
      :confirm-text="dialogData.confirmText"
      class="test-dialog">
    </refund-dialog>
    <!-- 退款确认 -->
     <refund-book
      :show="refundData.show"
      :tips="refundData.tips"
      :confirm-text="refundData.confirmText"
      @onConfirm="postRefund()"
      @onCancel="cancel()">
    </refund-book>
  </div>
</template>
<script>
import { isEmpty } from 'lodash';
import { TransferDom, Popup, Icon, XButton } from 'vux';
import { orderDetail } from '@/api';
import { formatMobile, formatMoney, formatDate } from '@/filters';
import BuyProtocol from '@/components/common/BuyProtocol';
import refundDialog from '@/components/dialog/refundDialog';
import refundBook from '@/components/dialog/refundBook';


export default {
  components: {
    Popup,
    Icon,
    XButton,
    BuyProtocol,
    refundDialog,
    refundBook,
  },
  directives: {
    TransferDom,
  },
  filters: { formatMobile, formatMoney, formatDate },
  data() {
    return {
      showPop: false,
      orderInfo: {},
      book: {},
      title: '',
      start_at: '',
      end_at: '',
      price: 0,
      logistics: '',
      showProtocol: false,
      showAgreement: false,
      buyBook: 0, // 1表示是教材退费
      isThirty: 0, // 1表示大于30天，buy_book为1
      isconfirm: 0, //0表示未发货，1表示已发货
      dialogData: {
        show: false,
        tips: '教材退费申请只能在购买成功后30天内操作，您当前已超过退款时限。',
        confirmText: '知道了',
      },
      refundData: {
        show: false,
        tips: '确定要退款吗？',
        confirmText: '确认',
      },
    };
  },
  computed: {
    orderId() {
      return this.$route.params.orderId;
    },
  },
  methods: {
    refundCancl() {
      this.dialogData.show = false;
    },
    cancel() {
      this.refundData.show = false;
    },
    goLogistics() {
      this.$router.push({
        name: 'logistics',
        query: {
          order_id: this.orderId,
        },
      });
    },
    popShow() {
      this.showPop = true;
    },
    getOrderInfo() {
      orderDetail(this.orderId).then((res) => {
        this.orderInfo = res.data;
        this.isThirty = this.orderInfo.is_thirty;
        this.buyBook = this.orderInfo.buy_book ? this.orderInfo.buy_book : 0;
        this.price = this.orderInfo.total_fee;
        if (!res.data.buy_book) {
          if (res.data.presell) {
            this.title = '美国小学体验课';
            this.start_at = !isEmpty(this.orderInfo.course)
              ? this.orderInfo.course[0].start_at
              : '';
            this.end_at = !isEmpty(this.orderInfo.course)
              ? this.orderInfo.course[0].end_at
              : '';
            this.orderInfo.paid_at = this.orderInfo.created_at;
            this.orderInfo.pay_way = '免费';
          } else {
            if (!isEmpty(this.orderInfo.package)) {
              this.title = this.orderInfo.package.title;
              this.start_at = this.orderInfo.package.start_at;
              this.end_at = this.orderInfo.package.end_at;
            }
            if (isEmpty(this.orderInfo.package)) {
              this.title = this.orderInfo.course[0].title;
              this.start_at = this.orderInfo.course[0].start_at;
              this.end_at = this.orderInfo.course[0].end_at;
            }
          }
        }
        if (!isEmpty(this.orderInfo.book)) {
          this.book = res.data.book;
          this.price = this.price - this.book.total_fee;
          if (this.book.confirm && this.book.logistics.length) {
            this.logistics = '已发货 (';
            this.book.logistics.forEach((item) => {
              if (Number(item.logistics_num) !== 0) {
                this.logistics += `订单号：${item.logistics_num}、`;
              }
            });
            if (this.logistics) {
              this.logistics = this.logistics.substring(
                0,
                this.logistics.length - 1,
              );
            }
            this.logistics += ')';
          } else {
            this.logistics = '未发货';
          }
        }
        if (isEmpty(this.orderInfo.course)) {
          this.showAgreement = false;
        } else {
          const courseType = this.orderInfo.course[0].type;
          this.showAgreement =
            courseType !== 2 &&
            courseType !== 5 &&
            this.orderInfo.course[0].class_type !== 1;
        }
      });
    },
    refund() {
      this.showPop = false;
      // 购买了教材并且大于30天
      if (this.buyBook === 1 && this.isThirty === 1) {
        this.dialogData.show = true;
        return false;
      }
      // 购买教材并且小于30天,confirm: 1表示已经发货，0表示未发货
      if (this.buyBook === 1 && this.isThirty === 0 && (Number(this.book.confirm) === 1)) {
        this.postRefund();
        return false;
      }
       // 购买教材并且小于30天,confirm: 1表示已经发货，0表示未发货
      if (this.buyBook === 1 && this.isThirty === 0 && (Number(this.book.confirm) === 0)) {
        this.refundData.show = true;
        return false;
      }
      this.$router.push({
        name: 'refund',
        params: {
          orderId: this.orderId,
        },
      });
    },
    postRefund() {
      this.refundData.show = false;
      const params = {
        order_id: this.orderId,
      };
      this.$http.post(`${this.apiConfig.host}/order/orders/${this.orderId}/book-refund`, params).then((res) => {
        if (res.error_code !== 0) {
          this.dialogData.show = true;
          return;
        }
        if (res.data.refund_success === 0) {
          this.$router.push({
            name: 'sendBack',
            query: {
              id: res.data.logistics_refund_id,
              bookOrder: res.data.is_book_order,
            },
          });
          return;
        }
        let msg = '提交成功，预计三日后到账';
        if (this.isFree) {
          msg = '提交成功';
        }
        this.$vux.toast.show({
          type: 'success',
          text: msg,
          width: '15em',
          time: '2000',
          isShowMask: true,
        });
        const timer = setTimeout(() => {
          clearTimeout(timer);
          this.$router.push({ path: '/mine/order' });
        }, 2000);
      });
    },
    courseLists() {
      if (this.orderInfo.presell === 1) {
        this.$vux.toast.show({
          time: 3000,
          type: 'text',
          isShowMask: true,
          position: 'middle',
          text: '课程顾问老师会尽快联系您，请注意接听我们的电话哦~',
          width: '17.6em',
        });
      } else {
        this.$router.push({
          name: 'courseLists',
          query: {
            order_id: this.orderId,
            teacher_id: this.orderInfo.teacher_id,
          },
        });
      }
    },
    bookDetails() {
      if (isEmpty(this.book)) {
        return false;
      }
      this.$router.push({
        name: 'material',
        params: {
          bookId: this.book.id,
        },
      });
    },
    changeAddress() {
      if (isEmpty(this.book)) {
        return false;
      }
      this.$router.push({
        name: 'buyMaterial',
        params: {
          bookId: this.book.id,
        },
        query: {
          order_id: this.orderId,
        },
      });
    },
  },
  mounted() {
    this.getOrderInfo();
  },
  destroyed() {
    this.$vux.toast.hide();
  },
};
</script>
<style lang="less">
  @import "../../../styles/basic.less";

  .pay-order-detail {
    overflow: hidden;
    position: relative;
    padding: 0 0 0.3rem;
    min-height: 100%;
    background: @col-bg;
    color: @col-darkgray;
    .item-box-address {
      position: relative;
      padding: 0.3rem 0.5rem;
      background: #fff;
      .logistics-status {
        color: @col-orange;
        .logistics-icon {
          float: left;
          display: block;
          margin: 0.05rem 0.2rem 0 0;
          .wh(0.38rem, 0.3rem);
          .bg-m("@{img-path}/logistics-icon.png");
          background-size: 100% 100%;
        }
        .arrow-icon {
          float: right;
          display: block;
          .wh(0.16rem, 0.32rem);
          .bg-m("@{img-path}/arrow-icon.png");
          background-size: 100% 100%;
        }
      }
    }
    .item-box-fluid {
      .item-box-fluid;
      p {
        line-height: 0.36rem;
        font-size: 0.3rem;
      }
      .pay-tit {
        text-align: center;
        color: @col-orange;
      }
      .paid-tit {
        &.center {
          text-align: center;
          &:after {
            content: "";
          }
        }
        .i {
          position: relative;
          top: -0.04rem;
          font-size: 0.36rem;
          color: #93cea4;
        }
      }
      .tips {
        margin-top: 0.1rem;
        color: @col-gray;
      }
    }
    .item-box {
      .item-box;
    }
    .address-bar {
      .wh(100%, 0.06rem);
      .bg-m("@{img-path}/address-bar.png");
      background-size: 100% 100%;
    }
    .item-box-logistics {
      background-color: @col-bg-address;
      margin-bottom: 0.2rem;
      padding: 0.29rem 0.46rem 0.32rem 0.38rem;
      display: flex;
      flex-direction: row;
      .icon-box {
        margin-right: 0.2rem;
        .address-icon {
          margin-top: 0.2rem;
          display: inline-block;
          .wh(0.3rem, 0.36rem);
          .bg-m("@{img-path}/address-icon.png");
          background-size: 100% 100%;
        }
      }
      .logistics-address-info {
        flex: 1;
        font-size: 0.3rem;
        .user-name {
          padding-right: 0.6rem;
        }
        .address {
          .wordbreak;
        }
      }
      &.column {
        flex-direction: column;
        .address-null {
          font-size: 0.3rem;
          text-align: center;
        }
      }
    }
    .order-title {
      display: flex;
      justify-content: space-between;
      .h4 {
        padding-right: 0.1rem;
        .l-h(0.46rem);
        font-size: 0.3rem;
        .wordbreak;
      }
      .btn-add {
        line-height: 0.4rem;
      }
      .vux-x-icon {
        .wh(0.46rem, 0.46rem);
        fill: @col-gray;
      }
      & + .logistics-infor {
        padding-top: 0.1rem;
      }
    }
    .comm-tit {
      .comm-tit(0.36rem, @col-darkgray);
    }
    .name {
      color: @col-gray;
    }
    .val {
      flex: 1;
      i {
        color: @col-orange;
      }
    }
    .lists-item {
      padding-top: 0.2rem;
      li {
        margin-top: 0.2rem;
        padding-top: 0.2rem;
        border-top: 0.01rem solid @col-border;
        &:first-of-type {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }
        .title-box {
          display: flex;
          justify-content: space-between;
          font-size: 0.28rem;
          .title {
            width: 3.5rem;
            height: 0.5rem;
            color: #1c223d;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .title-info {
            width: 2.2rem;
            height: 0.5rem;
            color: #b2b7ce;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .details-box {
          position: relative;
          min-height: 0.36rem;
          p {
            margin-top: 0.16rem;
            line-height: 0.36rem;
          }
          .time {
            &:before {
              content: "";
              display: inline-block;
              vertical-align: top;
              margin: 0.05rem 0.04rem 0 0;
              .wh(0.4rem, 0.27rem);
              .bg-m("@{img-path}/course-details-icon.png");
              background-size: 0.4rem 4.5rem;
            }
          }
          .price {
            position: absolute;
            right: 0;
            bottom: 0;
            line-height: 0.36rem;
            font-size: 0.3rem;
            .original {
              font-size: 0.26rem;
              text-decoration: line-through;
              color: @col-gray;
            }
            .current {
              padding-left: 0.16rem;
              // color: @col-orange;
            }
          }
        }
      }
    }
    .logistics-infor,
    .cost-details {
      padding-top: 0.2rem;
      p {
        display: flex;
        line-height: 0.36rem;
        font-size: 0.3rem;
        & + p {
          margin-top: 0.1rem;
        }
        .name {
          width: 1.6rem;
        }
      }
    }
    .cost-details {
      p {
        justify-content: space-between;
        .val {
          text-align: right;
        }
      }
    }
    .total {
      margin-top: 0.2rem;
      padding-top: 0.2rem;
      border-top: 0.01rem solid @col-border;
      font-size: 0.3rem;
      text-align: right;
      .money {
        color: @col-orange;
      }
    }
    .hot-line {
      margin-bottom: 0.2rem;
      .hot-line;
    }
  }
  .cus-dialog {
    .vux-popup-dialog {
      background: #fff;
      .cus-popup {
        padding: 0 0.4rem;
        li {
          font-size: 0.36rem;
          .l-h(1.1rem);
          text-align: center;
          &.gray {
            line-height: 0.4rem;
            padding: 0.15rem 0;
            color: #999;
            font-size: 0.3rem;
            .red {
              color: red;
              font-size: 0.28rem;
            }
          }
          a {
            color: @col-purple;
          }
          & + li {
            border-top: 0.02rem solid @col-border;
          }
        }
      }
    }
  }
  .change-address {
    margin-top: 0.23rem;
    width: 70% !important;
    .l-h(0.6rem);
    border: 0.02rem solid @col-gray!important;
    border-radius: 0.06rem;
    font-size: 0.26rem;
    font-weight: 500;
    background: @col-bg-address!important;
    // color: @col-purple!important;
  }
  .confirm-box {
    position: absolute;
    top: 5rem;
    left: 15%;
    width: 70%;
    height: 4.1rem;
    background-color: rgba(255, 255, 255, 1);
    border-radius: .1rem;
    text-align: center;
    .confirm-title {
      margin: .5rem auto .46rem;
      font-size: .3rem;
      color: #1b223f;
      line-height: .5rem;
    }
    .confirm-body {
      margin-bottom: .42rem;
      color: #b0b7d1;
      font-size: .3rem;
      .tips {
        font-size: .24rem;
        line-height: .46rem;
      }
      .tel {
        color: #9157c8;
      }
      .confirm-footer {
        display: flex;
        justify-content: space-around;
        margin-top: .42rem;
      }
      .confirm-btn {
        margin-top: 0;
        background: @col-purple;
        color: @col-white;
        .wh(1.4rem, .7rem);
        font-size: .3rem;
        border-radius: .1rem;
      }
      .cancel {
        background: @col-white;
        color: @col-purple;
        border: .02rem solid @col-purple;
      }
    }
  }
</style>

