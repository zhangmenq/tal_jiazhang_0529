<template>
  <li class="item-box">
      <div class="order-infor" @click="redirect()">
        <div class="order_id">
          <span>订单编号：</span>{{ order.order_sn }}
        </div>
        <div class="order_item" v-if="order.mode != 2">
          <img :src="order.order_course[0].course.cover_url" alt="">
          <h4 v-if="order.presell">美国小学体验课 </h4>
          <h4 v-else>{{ order.order_course[0].package ? order.order_course[0].package.title : order.order_course[0].course.title }}</h4>
          <span class="item_price">￥{{ order.course_pay_fee | formatMoney }}</span>
        </div>
        <div class="order_item" v-if="order.order_book">
          <img :src="order.order_book.book.cover_url" alt="">
          <h4>{{ order.order_book.book.title }}</h4>
          <span class="item_price">￥{{ order.book_pay_fee | formatMoney }}</span>
        </div>

      <div class="total_price">
        共{{ order.order_book? order.order_course.length + 1 : order.order_course.length}}件 合计<span>￥{{ order.pay_fee | formatMoney }}</span>
      </div>
      <span class="status">
        <em class="pending" v-if="order.status === -3">退款中</em>
        <em class="paid-icon" v-if="order.status === 1"></em>
        <em class="cancel-icon" v-if="order.status === -1"></em>
        <em class="refund-icon" v-if="order.status === -4 || order.status === -3"></em>
      </span>
    </div>
    <div class="order-func" v-if="order.status === 0 || order.status === 1">
      <p class="remainingtime" v-if="order.status === 0 && showLeftTime">
        支付剩余时间
        <i>{{ Number(order.left_time) | format2CountDown }}</i>
      </p>
      <div class="btn-fn">
        <!-- <x-button v-if="(order.status === 0 && order.referer !== 5) || (order.referer === 5 && isReorderTime && order.status === 0)" @click.native="cancelOrder(order.id, $event)" class="btn-plain"> -->
        <x-button v-if="order.status === 0 && order.referer !== 5" @click.native="cancelOrder(order.id, $event)" class="btn-plain">
          取消订单
        </x-button>
        <x-button v-if="order.status === 0" @click.native="pay()" class="btn-purple">
          去支付
        </x-button>
         <x-button v-if="order.status === 1 && order.order_book && order.order_book.logistics_refund &&  order.order_book.logistics_refund.length > 0 && order.order_book.logistics_refund[0].id > 0" @click.native="sendBack(order.order_book.logistics_refund[0].id)" class="btn-purple">
          查看进度
        </x-button>
        <x-button v-if="bookBtnShow" @click.native="buyBook()" class="btn-purple">
          购买教材
        </x-button>
        <x-button v-if="order.status === 1 && order.order_book && order.order_book.order_id > 0" @click.native="logistics()" class="btn-purple">
          查看物流
        </x-button>
      </div>
    </div>
  </li>
</template>

<script>
/* eslint-disable */
import { XButton } from "vux";
import { sessionSet } from "@/utils/localStorage";
import { formatMoney } from "@/filters";
import { getBook, setPointLog } from "@/api";
import moment from "moment";

export default {
  name: "orderItem",
  components: {
    XButton
  },
  props: {
    order: {
      type: Object,
      default: {}
    },
    status: {
      type: Number,
      default: 0
    },
    serverTime: "",
    isReorderTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bookBtnShow: false,
      bookOrder:1,
      showLeftTime: false,
    };
  },
  created() {
    if (this.order.referer !=5 || (this.order.referer == 5 && this.order.left_time <= (12 * 3600))) {
      this.showLeftTime = true;
    }
    if (this.order.order_course.length > 0) {
      const timer = moment(this.order.order_course[0].course.end_at) > moment();
      if (this.order.status === 1 && this.order.mode !== 2 && timer) {
        if ((this.order.order_book && this.order.order_book.status !== 1) || 
        (!this.order.order_book && this.order.order_course[0].course.book_id) || 
        (this.order.order_book && this.order.order_book.book_id != this.order.order_course[0].course.book_id && this.order.order_book.is_logistics.length > 0)) {
          this.bookBtnShow = true;
        }
      }
    }
  },
  filters: {
    format2CountDown(leftTime) {
      const d = parseInt(leftTime / (24 * 60 * 60), 10);
      const h = parseInt((leftTime / (60 * 60)) % 24, 10);
      let m = parseInt((leftTime / 60) % 60, 10);
      let s = parseInt(leftTime % 60, 10);
      m = m >= 10 ? m : `0${m}`;
      s = s >= 10 ? s : `0${s}`;
      if (d > 0) {
        return `${d}天${h}小时${m}分${s}秒`;
      }
      return `${h}小时${m}分${s}秒`;
    },
    formatMoney
  },
  methods: {
    redirect() {
      if (this.status !== 0) {
        //todo 跳往订单详情页面
        this.$router.push({
          name: "orderDetails",
          params: {
            orderId: this.order.id
          }
        });
      } else {
        this.$router.push({
          name: "waitPay",
          query: {
            order_id: this.order.id
          }
        });
      }
    },
    buyBook() {
      getBook(this.order.id).then(res => {
        if (res.error_code === 0) {
          this.$router.push({
            name: "orderMaterial",
            query: {
              order_id: this.order.id
            },
          })
        } else if (res.error_code === 10307){
          this.$vux.toast.show({
            time: 2000,
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
            type: 'warn',
          });
          setTimeout( () => {
            location.href = '/mine/order';
          }, 2000);
          return;
        } else {
          this.$vux.toast.show({
            text: res.error_msg,
            type: "warn",
            time: 2000,
            width: "17.6em"
          });
          return;
        }
      });
      if (this.order.referer === 5) {
        setPointLog(124, "/mine/order/paid", 2);
      }
    },
    pay() {
      // location.href = `/pay/wait-pay?order_id=${this.order.id}`;
      this.$router.push({
        name: "waitPay",
        query: {
          order_id: this.order.id
        }
      });
      sessionSet("dataSource", 2);
      setPointLog(121, "/mine/order", 2);
    },
    cancelOrder(orderId, event) {
      //orderId
      event.stopPropagation();
      this.$emit("cancelOrder", {
        order_id: orderId
      });
    },
    logistics() {
      this.$router.push({
        name: "notShipped"
        // query: {
        //   order_id: this.order.id,
        // },
      });
    },
    sendBack(refundId) {
      this.$router.push({
        name: "sendBack",
        query: {
          id: refundId,
          bookOrder:this.bookOrder
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  @import "../../styles/basic.less";

  li {
    font-size: 0.3rem;
    padding: 0.3rem 0.2rem;
    border-radius: 0.1rem;
    background: #fff;
    margin: 0.2rem 0.3rem 0;
    .order-infor {
      position: relative;
      .order_id {
        line-height: 0.42rem;
        span {
          color: #b2b7ce;
        }
      }
      .order_item {
        padding: 0.3rem 0 0.3rem 1.4rem;
        border-bottom: 1px solid #ece8e7;
        position: relative;
        min-height: 1.8rem;
        img {
          display: block;
          width: 1.2rem;
          height: 1.2rem;
          position: absolute;
          left: 0;
          top: 0.3rem;
        }
        h4 {
          line-height: 0.42rem;
          padding-right: 0.8rem;
        }
        .item_price {
          display: block;
          position: absolute;
          right: 0.1rem;
          bottom: 0.4rem;
        }
      }
      .total_price {
        padding: 0.2rem 0.1rem;
        line-height: 0.42rem;
        text-align: right;
        span {
          color: #fe763a;
        }
      }
      .btn_box {
        height: 0.55rem;
        font-size: 0.24rem;
        .purple_btn {
          display: block;
          width: 1.4rem;
          line-height: 0.55rem;
          float: right;
          background: #9a57c8;
          border-radius: 0.1rem;
          text-align: center;
          color: #fff;
        }
      }
      p {
        display: flex;
        .wordbreak;
      }
      .tit {
        color: @col-gray;
        flex: 0 0 1.6rem;
      }
      .status {
        position: absolute;
        right: 0;
        top: 0.5rem;
        font-size: 0.3rem;
        line-height: 0.52rem;
        .pending,
        .success {
          display: block;
          text-align: right;
        }
        .pending {
          color: @col-orange;
        }
        .success {
          color: @col-lightred;
        }
        em.paid-icon,
        em.cancel-icon,
        em.refund-icon {
          display: block;
          margin-top: -0.1rem;
          .wh(1.1rem, 1.1rem);
          .bg-m("@{img-path}/order-status-bg.png");
          background-size: 1.1rem 3.3rem;
          &.cancel-icon {
            background-position: 0 0;
          }
          &.paid-icon {
            background-position: 0 -1.1rem;
          }
          &.refund-icon {
            background-position: 0 -2.2rem;
          }
        }
      }
    }
    .order-func {
      .remainingtime {
        margin-bottom: 0.2rem;
        text-align: right;
        font-size: 0.3rem;
        i {
          color: @col-orange;
        }
      }
      .btn-fn {
        display: flex;
        justify-content: flex-end;
        padding-bottom: 0.1rem;
        .weui-btn {
          margin-left: 0.26rem;
          margin-right: 0;
          .weui-btn(1.88rem);
        }
      }
      // .btn-cancel,
      // .btn-view,
      // .btn-pay {
      //   text-align: center;
      //   .wh(1.9rem,0.7rem);
      //   padding: 0;
      //   line-height: 0.66rem;
      //   border-radius: 0.08rem;
      //   font-size: 0.3rem;
      //   color: @col-darkgray;
      //   background-color: transparent;
      // }
      // .btn-cancel,
      // .btn-view {
      //   border: 0.02rem solid @col-gray;
      //   &.weui-btn_disabled {
      //     color: @col-gray;
      //   }
      // }
      // .btn-pay {
      //   .box-shadow(0 0.06rem 0.12rem rgba(248,100,152,0.38));
      // }
    }
  }
</style>