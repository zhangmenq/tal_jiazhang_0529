<template>
  <div class="coupon">
    <div class="msg-tips"><p>已为您选中推荐优惠券，使用优惠券1张，共抵用<i>¥200</i></p></div>
    <coupon-item></coupon-item>
    <!-- <no-content tips="暂无优惠券"></no-content> -->
    <x-button
      class="btn-purple">
      确定
    </x-button>
    <router-link class="btn-instructions" to="/mine/instructions"><span><icon type="info"></icon></span>使用说明</router-link>
  </div>
</template>
<script>
  import { Icon, XButton } from 'vux';
  import CouponItem from '@/components/coupon/CouponItem';
  import NoContent from '@/components/common/NoContent';

  export default{
    components: {
      Icon,
      XButton,
      CouponItem,
      NoContent,
    },
    data() {
      return {
        index: -1,
      };
    },
    mounted() {
    },
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .coupon{
    padding-bottom: .6rem;
    min-height: 100%;
    background: @col-bg;
    .msg-tips{
      padding: .15rem .3rem;
      background: @col-lightorange;
      p{
        line-height: .4rem;
        font-size: .24rem;
        i{
          color: @col-orange;
        }
      }
    }
    .btn-instructions{
      position: fixed;
      right: 0;
      bottom: 2rem;
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
    .weui-btn{
      margin-top: 1.6rem;
      .weui-btn(@fontsize: .36rem);
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
