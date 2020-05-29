<template>
  <div class="confirm-order" id="container">
    <Address v-if="addressBoxShow && !showCoupon" :address="bookAddress" :addressTipsShow="addressTipsShow" @cancelAddressTips="cancelTips"></Address>
    <div v-show="!showCoupon">
      <div class="item-box-fluid">
        <p class="h4">{{ title }}</p>
        <p class="time">{{start_at | formatDate}} - {{end_at | formatDate}}</p>
      </div>
      <div class="item">
        <group>
          <cell class="cus-cells" is-link @click.native="courseList()">
            <span class="comm-tit" slot="title">课程清单</span>
            <em>查看课程信息</em>
          </cell>
          <div class="intro">
            <p v-if="!isExp">
              <span class="name">开始时间：</span>
              {{ beginTimes }}　共{{ total_lessons }}节
            </p>
            <p>
              <span class="name">上课时间：</span>
              {{ timeCN }}
            </p>
            <p v-if="teacherInfo && teacherInfo.id && courseInfo.type === 1 && !isShortCourse">
              <span class="name">授课老师：</span>
              {{ teacherInfo.realname }}
              <span class="avatar" v-if="!teacherInfo.avatar_url" @click="goTeacher(teacherInfo.id)">
                <img src="../../assets/default-photo-teacher.png">
              </span>
              <span class="avatar" v-else @click="goTeacher(teacherInfo.id)">
                <img :src="teacherInfo.avatar_url">
              </span>
            </p>
          </div>
        </group>
      </div>
      <div class="item-box" v-if="isBook === 1">
        <div class="comm-tit">购买教材</div>
        <div class="cost-details">
          <p>
            {{book.title}}
          </p>
        </div>
      </div>
      <div class="item">
        <group>
          <cell class="cus-cells" is-link @click.native="showCouponPage">
            <span class="comm-tit" slot="title">
              优惠券
              <em class="tag" v-if="couponLists.length > 0">共有{{ couponLists.length }}张优惠券</em>
            </span>
            <em class="tag-gray" v-if="couponLists.length == 0">无可用优惠券</em>
            <span v-else>-¥{{couponFee | formatMoney}}</span>
          </cell>
        </group>
      </div>
      <div class="item-box">
        <div class="comm-tit">费用明细</div>
        <div class="cost-details">
          <p>
            <span class="name">课程费用</span>
            <span class="val">¥{{course_price | formatMoney}}</span>
          </p>
          <p v-if="book && isBook">
            <span class="name">教材费用</span>
            <span class="val">¥{{ book_price | formatMoney}}</span>
          </p>
        </div>
        <div class="cost-details">
          <p v-if="book && isBook && book_price > book.payFee">
            <span class="name">教材优惠</span>
            <span class="val"><i>-¥{{book_price - (book.payFee || 0) | formatMoney}}</i></span>
          </p>
          <p v-if="course_discount < 1 ">
            <span class="name">课程折扣</span>
            <span class="val"><i>-¥{{course_price - coursePrice | formatMoney}} ({{course_discount * 10 | formatDiscount}}折)</i></span>
          </p>
          <p v-if="discountRate < 1 && employeeDiscount > 0">
            <span class="name">员工折扣</span>
            <span class="val"><i>-¥{{employeeDiscount | formatMoney}} ({{discountRate * 10 | formatDiscount}}折)</i></span>
          </p>
          <p v-if="selectedCoupon > 0 && selectedCouponIds !== ''">
            <span class="name">优惠券</span>
            <span class="val"><i>-¥{{selectedCoupon | formatMoney}}</i></span>
          </p>
        </div>
        <p class="total">应付金额<i>￥{{finalFee | formatMoney}}</i></p>
      </div>
      <div class="item-box">
        <dl class="payment-mode">
          <dt><p class="comm-tit">支付方式</p></dt>
          <dd>
            <checker v-model="payWay" type="radio" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
              <checker-item :value="1"  v-if="origin !== 'wechat'">
                <em class="radio-icon"></em><span class="pay-alipay"></span>
              </checker-item>
              <checker-item :value="2" v-if="origin === 'wechat'">
                <em class="radio-icon"></em><span class="pay-wechat"></span>
              </checker-item>
              <checker-item :value="3">
                <em class="radio-icon"></em><span class="pay-unionpay"></span>
              </checker-item>
            </checker>
          </dd>
        </dl>
      </div>
      <p class="hot-line">
        <span class="inner">客服电话：<i>4008002211</i>转9</span>
      </p>
      <p class="hot-line fixed" v-if="!isExp && !(courseInfo.type === 1 && courseInfo.class_type === 1)">
        <span class="agreement" @click="showProtocol=true">
          <em class="radio-icon" :class="{'checked': agreement}"></em>请阅读并同意<i>《课程购买协议》</i>
        </span>
      </p>
      <div class="nav-pay">
        <span class="price">¥{{ finalFee | formatMoney }}</span>
        <div class="btn-fn" >
          <x-button :class="{'btn-disable': !canpay(),  'btn-purple': canpay()}" @click.native="preparePay()">
            {{ !isDisabled ? '去支付' : '支付中...' }}
          </x-button>
        </div>
      </div>
    </div>
    <div v-show="showCoupon">
      <pay-coupon
        @confirmCoupon="selectCoupon"
        :lists="couponLists"
        :coursePrice="coursePrice"
        :selectedIndex="selectedIndex"></pay-coupon>
    </div>
    <BuyProtocol
      v-if="showProtocol"
      :agreement="agreement"
      @close="closeProtocol" ></BuyProtocol>
    <loading :show="ordering" text="订单处理中..."></loading>
  </div>
</template>
<script>
  import { Checker, CheckerItem, Cell, Group, XButton, Loading } from 'vux';
  import Address from '@/components/common/Address';
  import PayCoupon from '@/components/coupon/PayCoupon';
  import BuyProtocol from '@/components/common/BuyProtocol';
  import payTime from '@/mixins/payTime';
  import pay from '@/mixins/pay';

  export default{
    components: {
      Checker,
      CheckerItem,
      Cell,
      Group,
      XButton,
      PayCoupon,
      BuyProtocol,
      Loading,
      Address,
    },
    mixins: [payTime, pay],
    data() {
      return {
        showProtocol: false,
      };
    },
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';
  .confirm-order{
    position: relative;
    background: @col-bg;
    min-height: 100%;
    padding: 0 0 1.8rem;
    .item-box-fluid{
      .item-box-fluid;
      .h4{
        font-size: .36rem;
        line-height: .36rem;
      }
      .time{
        margin-top: .1rem;
        font-size: .26rem;
        &:before{
          content: '';
          display: inline-block;
          vertical-align: top;
          margin: .08rem .04rem 0 0;
          .wh(.4rem,.27rem);
          .bg-m('@{img-path}/course-details-icon.png');
          background-size: .4rem 4.5rem;
        }
      }
    }
    .item{
      position: relative;
      overflow: hidden;
      min-height: .9rem;
      .item-box(0rem);
      .weui-cells{
        .weui-cells;
        .weui-cell_access{
          .weui-cell__ft{
            padding-right: .3rem;
            color: @col-darkgray;
            &:after{
              right: 0rem;
              margin-top: -.08rem;
              .wh(.18rem,.18rem);
            }
          }
        }
        .tag-gray{
          display: inline-block;
          vertical-align: middle;
          padding-left: .1rem;
          color: @col-gray;
        }
      }
      .cus-checker;
      .vux-checker-box{
        .pos-box(6.2rem,.9rem);
        left: .3rem;
        line-height: .9rem;
      }
      .intro{
        padding: 0 .3rem .2rem;
        font-size: .26rem;
        .name{
          padding-right: .06rem;
          color: @col-gray;
        }
        .avatar{
          display: inline-block;
          vertical-align: middle;
          margin-left: .05rem;
          .wh(.4rem,.4rem);
          border-radius: 100%;
          overflow: hidden;
          img{
            .wh-img;
          }
        }
        p{
          line-height: .46rem;
        }
        .vux-checker-box {
          position: static;
        }
      }
      .address{
        padding: .2rem 0;
        font-size: .3rem;
        p{
          line-height: .46rem;
          &.tit{
            margin-bottom: .1rem;
            color: @col-gray;
            &:before{
              content: '';
              display: inline-block;
              vertical-align: middle;
              margin: -.04rem .1rem 0 0;
              .wh(.24rem,.3rem);
              .bg-m('@{img-path}/address-icon.png');
              background-size: 100% 100%;
            }
          }
          .name{
            padding-right: .6rem;
          }
        }
      }
      .border-top{
        .weui-cell{
          &:before{
            display: block;
          }
        }
      }
    }
    .comm-tit{
      .comm-tit(.4rem,@col-darkgray);
      font-size: .36rem;
      .tag{
        display: inline-block;
        vertical-align: middle;
        margin-left: .1rem;
        padding: 0 .12rem;
        height: .34rem;
        line-height: .32rem;
        border: .01rem solid @col-orange;
        border-radius: .04rem;
        font-size: .24rem;
        color: @col-orange;
      }
    }
    .item-box{
      .item-box;
    }
    .cost-details{
      margin-top: .3rem;
      p{
        display: flex;
        justify-content: space-between;
        line-height: .36rem;
        font-size: .3rem;
        & + p{
          margin-top: .1rem;
        }
        .name{
          width: 1.6rem;
        }
        .val{
          text-align: right;
          i{
            color: @col-orange;
          }
        }
      }
    }
    .total{
      margin-top: .2rem;
      padding-top: .2rem;
      border-top: .01rem solid @col-border;
      font-size: .3rem;
      text-align: right;
      i{
        color: @col-orange;
      }
    }
    .payment-mode{
      // .title{
      //   line-height: .36rem;
      //   font-size: .3rem;
      // }
      .cus-checker;
      .checkbox-item{
        display: block;
        margin-top: .2rem;
        padding-left: .14rem;
        .radio-icon{
          top: .06rem;
          left: auto;
          right: 0;
        }
        span{
          display: inline-block;
          vertical-align: top;
          .wh(1.9rem,.5rem);
          .bg-m('@{img-path}/payment-icon-bg.jpg');
          background-size: 1.9rem 1.5rem;
          &.pay-alipay{
            background-position: 0 0;
          }
          &.pay-wechat{
            background-position: 0 -.5rem;
          }
          &.pay-unionpay{
            background-position: 0 -1rem;
          }
        }
      }
    }
    .hot-line{
      padding: 0 0 .2rem;
      .hot-line;
      .agreement{
        color: #333;
        .radio-icon{
          top: .17rem;
        }
      }
      &.fixed{
        line-height: .7rem;
        padding: 0;
        background: rgba(255,255,255,.7);
        z-index: 1;
      }
    }

    .nav-pay{
      .nav-pay;
    }
  }
</style>
