<template>
  <div class="coupon">
    <div class="nav">
      <tab
        custom-bar-width="0.6rem"
        bar-active-color="#9A57C8"
        :line-width="6"
        v-model="tabIndex">
        <tab-item @click.native="changeType('usable')">可用优惠券({{couponInfo.usable_total}})</tab-item>
        <tab-item @click.native="changeType('disable')">不可用优惠券({{couponInfo.disabled_total}})</tab-item>
      </tab>
    </div>

    <router-view></router-view>

    <a class="btn-instructions" @click="showPop = true"><span><icon type="info"></icon></span>使用说明</a>
    <div v-transfer-dom class="cus-dialog">
      <popup v-model="showPop" style="height: 5.4rem; overflow-y: auto;">
        <div class="instructions">
          <h1>使用说明：</h1>
          <p>1、优惠券不可提现、不可找零、不可兑换、不可叠加使用。</p>
          <p>2、优惠券有其所适用的范围，以优惠券上的具体使用说明为准，不在范围内的课程无法使用优惠券。</p>
          <p>3、优惠券过期后不可再使用。</p>
          <p>4、未支付订单取消，优惠券返还用户账户。</p>
          <p>5、已支付订单退费，应退金额=实际缴费金额-优惠后课单价原价*实际消耗课次，优惠券不返还。</p>
          <p>6、优惠券使用的最终解释权归学而思VIPX所有。</p>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { Tab, TabItem, Icon, TransferDom, Popup } from 'vux';
  import { setApilog } from '@/api/index';

  export default{
    components: {
      Tab,
      TabItem,
      Icon,
      Popup,
    },
    directives: { TransferDom },
    data() {
      return {
        showPop: false,
        tabIndex: -1,
        couponInfo: {},
      };
    },
    methods: {
      changeType(routerName) {
        this.$router.replace({
          name: routerName,
        });
      },
      getCoupon() {
        const url = `${this.apiConfig.host}student/coupons/?type=1&page=1`;
        this.$http.get(url).then((res) => {
          if (res.error_code !== 0) {
            return false;
          }
          this.couponInfo = res.data;
        });
      },
    },
    mounted() {
      this.getCoupon();
      if (this.$route.name === 'disable') {
        this.tabIndex = 1;
      } else {
        this.tabIndex = 0;
      }
      setApilog({
        event_type: 70011,
        route: '/mine/coupon',
      });
    },
  };
</script>
<style lang="less">
  @import '../../../styles/basic.less';

  .coupon{
    padding-bottom: 1.8rem;
    min-height: 100%;
    background: @col-bg;
    ul{
      padding: .2rem .3rem;
    }
    .nav {
      .nav;
    }
    .btn-instructions{
      position: fixed;
      right: 0;
      bottom: .77rem;
      padding: 0 .3rem 0 0;
      .l-h(.7rem);
      background: @col-bg-purple;
      border-top-left-radius: .35rem;
      border-bottom-left-radius: .35rem;
      font-size: .26rem;
      color: @col-purple;
      span{
        position: relative;
        display: inline-block;
        vertical-align: top;
        top: -.04rem;
      }
      .weui-icon-info{
        font-size: .5rem;
        color: @col-purple;
      }
    }
  }
  .cus-dialog{
    .vux-popup-dialog{
      background: #fff;
      padding: .5rem .3rem;
    }
    .instructions{
      h1{
        margin-bottom: .1rem;
        line-height: .46rem;
        font-size: .3rem;
      }
      p{
        line-height: .5rem;
        font-size: .24rem;
      }
    }
  }
</style>
