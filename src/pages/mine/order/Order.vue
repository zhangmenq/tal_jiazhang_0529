<template>
  <div class="myorder_mine">
    <div class="nav">
      <tab
        custom-bar-width="0.6rem"
        bar-active-color="#9A57C8"
        :line-width="6"
        v-model="index">
        <tab-item @click.native="go('unpayOrder')">待付款</tab-item>
        <tab-item @click.native="go('paidOrder')">已付款</tab-item>
        <tab-item @click.native="go('cancelOrder')">已取消</tab-item>
        <tab-item @click.native="go('refundOrder')">退款</tab-item>
      </tab>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Tab, TabItem, XButton } from 'vux';
import { setApilog } from '@/api';

export default {
  name: 'orderList',
  components: {
    Tab,
    TabItem,
    XButton,
  },
  data() {
    return {
      index: -1,
    };
  },
  methods: {
    go(routerName) {
      this.$router.replace({
        name: routerName,
      });
    },
  },
  mounted() {
    if (this.$route.name === 'unpayOrder') {
      this.index = 0;
    } else if (this.$route.name === 'paidOrder') {
      this.index = 1;
    } else if (this.$route.name === 'cancelOrder') {
      this.index = 2;
    } else if (this.$route.name === 'refundOrder') {
      this.index = 3;
    }
    setApilog({
      event_type: 70008,
      route: '/mine/order',
    });
  },
  beforeRouteLeave(to, from, next) {
    const lists = ['unpayOrder', 'paidOrder', 'cancelOrder', 'refundOrder'];
    if (lists.indexOf(from.name) === -1 && lists.indexOf(to.name) === -1) {
      this.$router.push({
        name: 'mine',
      });
    } else {
      next();
    }
  },
};
</script>
<style lang="less">
@import "../../../styles/basic.less";

.myorder_mine {
  min-height: 100%;
  background: @col-bg;
  .nav {
    .nav;
  }
  .orderlist {
    padding: 0 0.2rem 0.2rem;
    li {
      margin-top: 0.2rem;
      padding: 0.2rem 0.3rem;
      background: #fff;
      border-radius: 0.08rem;
      font-size: 0.36rem;
      .order-infor {
        position: relative;
        p {
          display: flex;
          .wordbreak;
        }
        .tit {
          color: @col-gray;
          flex: 0 0 1.9rem;
        }
        .status {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 0.3rem;
          line-height: 0.52rem;
          .pending {
            color: @col-blue;
          }
          .success {
            color: @col-lightred;
          }
        }
      }
      .order-func {
        margin-top: 0.2rem;
        padding-top: 0.2rem;
        border-top: 0.02rem solid @col-border;
        .remainingtime {
          margin-bottom: 0.2rem;
          text-align: right;
          font-size: 0.3rem;
          i {
            color: @col-lightred;
          }
        }
        .btn-fn {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.1rem;
          .weui-btn {
            margin: 0;
            & + .weui-btn {
              margin-top: 0;
            }
          }
        }
        .btn-cancel,
        .btn-view,
        .btn-pay {
          text-align: center;
          .wh(1.9rem,0.7rem);
          padding: 0;
          line-height: 0.66rem;
          border-radius: 0.08rem;
          font-size: 0.3rem;
          color: @col-darkgray;
          background-color: transparent;
        }
        .btn-cancel,
        .btn-view {
          border: 0.02rem solid @col-gray;
          &.weui-btn_disabled {
            color: @col-gray;
          }
        }
        .btn-pay {
          .box-shadow(0 0.06rem 0.12rem rgba(248,100,152,0.38));
        }
      }
    }
  }
}
</style>
