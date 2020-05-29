<template>
  <div class="refunddetails">
    <div class="order-item">
      <div class="top">
        <h4>{{orders.course.title}}</h4>
      </div>
      <ul class="details">
        <li><span>订单编号：</span>{{orders.order_sn}}</li>
        <li><span>课程金额：</span>{{orders.total_fee | formatMoney}}元</li>
        <li><span>优惠金额：</span>{{orders.gift_Fee | formatMoney}}元</li>
        <li><span>实际支付：</span>{{orders.pay_fee | formatMoney}}元</li>
        <li><span>下单时间：</span>{{orders.created_at}}</li>
        <li><span>支付时间：</span>{{orders.paid_at}}</li>
        <li><span>支付方式：</span>{{orders.pay_way}}</li>
      </ul>
    </div>
    <div class="order-item" v-if="refundInfo !== ''">
      <ul class="details">
        <li><span>退款方式：</span>{{refundInfo.refund_way}}</li>
        <li><span>申请退款：</span>{{refundInfo.created_at}}</li>
        <li><span>退款金额：</span>{{refundInfo.refund_fee | formatMoney}}元</li>
        <li><span>实际支付：</span>{{refundInfo.pay_fee | formatMoney}}元</li>
        <li v-if="refundInfo.refund_fee > 0">
          <span>预计到账时间：</span>
          <font v-if="refundInfo.status === 1">{{refundInfo.arrive_account_at}}</font>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Flow, FlowState, FlowLine } from 'vux';
import { formatMoney } from '@/filters';

export default {
  name: 'mine',
  components: {
    Flow,
    FlowState,
    FlowLine,
  },
  filters: { formatMoney },
  data() {
    return {
      stepState: 1,
      orderId: 0,
      orders: {
        course: '',
      },
      refundInfo: '',
    };
  },
  methods: {
    getOrder() {
      this.$http.get(`${this.apiConfig.host}/order/orders/${this.orderId}`).then((res) => {
        this.orders = res.data;
      }).then(() => {
        this.$http.get(`${this.apiConfig.host}/order/orders/${this.orderId}/refunded`).then((res) => {
          this.refundInfo = res.data;
        });
      });
    },
    async init() {
      this.orderId = await this.$route.params.orderId;
      await this.getOrder();
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
    await this.init().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';

.refunddetails{
  min-height: 100%;
  background: @col-bg;
  padding: .2rem .2rem 0;
  .order-item{
    margin-bottom: .2rem;
    background: #fff;
    border-radius: .08rem;
    padding: .2rem .3rem;
    .top{
      margin-bottom: .2rem;
      padding-bottom: .2rem;
      border-bottom: .02rem solid @col-border;
      h4{
        padding-right:0.1rem;
        font-size: .36rem;
        .wordbreak;
      }
    }
    .details{
      li{
        display: flex;
        line-height: .46rem;
        font-size: .26rem;
        span{
          color: @col-gray;
          padding-right: .1rem;
        }
      }
    }
    .item{
      padding-bottom: .2rem;
    }
  }
  .weui-wepay-flow__li{
    .wh(.5rem,.5rem);
    .weui-wepay-flow__state{
      .wh(.5rem,.5rem);
      line-height: .46rem;
      font-size: .26rem;
      border-radius: 100%;
      background-color: transparent;
      border: .04rem solid @col-border;
    }
    .weui-wepay-flow__title-bottom{
      font-size: .26rem;
      top: .6rem;
    }
    &.weui-wepay-flow__li_done{
      .weui-wepay-flow__state{
        .bg-m('@{img-path}/flow-icon.png',center,center);
        border: .04rem solid @col-blue;
        background-color: @col-blue;
        background-size: .24rem .24rem;
        .box-shadow(0 .03rem .12rem rgba(90,151,247,.8));
      }
    }
  }
  .weui-wepay-flow__line{
    height: .04rem;
    background-color: @col-border;
  }
  .weui-wepay-flow__process{
    height: .04rem;
    background-color: @col-blue;
  }

}
</style>
