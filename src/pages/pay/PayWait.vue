<template>
  <div class="wait-pay" v-if="JSON.stringify(orderInfo) !== '{}'">
    <template v-if="!showProtocol">
      <div class="item-box-fluid" :class="{'shadow': !book.title}" v-if="showLeftTime">
        <div class="pay-status">
          <p class="pay-tit">等待您付款</p>
          <p class="tips">还有<i>{{ leftTime | format2CountDown }}</i>订单将自动取消</p>
        </div>
      </div>
      <!--地址-->
      <div class="address-box" v-if="addressBoxShow" @click="editAddress(1)">
        <p class="address-bar"></p>
        <div class="item-box-logistics" v-if="address.address_id > 0">
          <div class="icon-box"><em class="address-icon"></em></div>
          <div class="logistics-address-info">
            <p>
              <span class="user-name">{{address.name}}</span>
              <span class="mobile" v-if="address.mobile">{{address.mobile | formatMobile}}</span>
            </p>
            <p class="address">{{address.area}}{{address.address}}</p>
            <p class="address_tips">为了保证您及时收到学习资料，请准确填写。 </p>
          </div>
          <a href="javascript:;" class="address_btn edit_ico">修改</a>
        </div>
        <div class="item-box-logistics sp" v-else @click="editAddress(0)">
          <div class="address-null">
            <p>您还没有填写收货地址~</p>
            <p class="address_tips">为了保证您及时收到学习资料，请准确填写。 </p>
          </div>
          <a href="javascript:;" class="address_btn add_ico">添加</a>
        </div>
      </div>

        <div class="item-box">
          <div class="comm-tit">{{orderInfo.buy_book?'商品清单':'课程清单'}}</div>
          <ul class="lists-item">
            <li v-if="!orderInfo.buy_book">
              <p class="title-box">
                <span class="title">{{title}}</span>
                <span class="title-info" @click="courseLists()">查看课程信息&nbsp;&gt;</span>
              </p>
              <div class="details-box">
                <p>授课日期：{{start_at}} - {{end_at}}　共{{total_lessons}}节</p>
                <p>上课时间：{{timeCN}}</p>
                <p>授课老师：{{teacherInfo.realname}} 
                  <span class="avatar" v-if="!teacherInfo.avatar_url" @click="goTeacher(teacherInfo.id)">
                    <img src="../../assets/default-photo-teacher.png">
                  </span>
                  <span class="avatar" v-else @click="goTeacher(teacherInfo.id)">
                    <img :src="teacherInfo.avatar_url">
                  </span>
                </p>
                <span class="price">
                  <em class="current">¥{{course_price | formatMoney}}</em>
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
                  <em class="original" v-if="book.book_discount > 0">¥{{book.total_fee | formatMoney}}</em>
                  <em class="current">¥{{book.pay_fee | formatMoney}}</em>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="item-box">
          <div class="comm-tit">费用明细</div>
          <div class="cost-details">
            <p v-if="!orderInfo.buy_book">
              <span class="name">课程费用</span>
              <span class="val">¥{{course_price | formatMoney}}</span>
            </p>
            <p v-if="book && book.title">
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
          <div class="comm-tit">订单信息</div>
          <div class="order-details">
            <p><span class="name">订&nbsp;&nbsp;单&nbsp;&nbsp;号：</span><span class="val">{{orderInfo.order_sn}}</span></p>
            <p><span class="name">下单时间：</span><span class="val">{{orderInfo.created_at}}</span></p>
          </div>
        </div>
        <div class="item-box">
          <dl class="payment-mode">
            <dt><p class="title">支付方式</p></dt>
            <dd>
              <checker v-model="payWay" type="radio" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
                <checker-item :value="1" v-if="origin !== 'wechat'">
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
        <p class="hot-line fixed" v-if="!isExp && !isShort">
          <span class="agreement" @click="showProtocol=true">
            <em class="radio-icon" :class="{'checked': agreement}"></em>请阅读并同意<i>《课程购买协议》</i>
          </span>
        </p>
        <p class="hot-line">
          <span class="inner">客服电话：<i>4008002211</i>转9</span>
        </p>
        <div class="nav-pay">
          <span class="price">¥{{orderInfo.pay_fee || 0 | formatMoney}}</span>
          <div class="btn-fn">
            <!-- btn-disable btn-purple btn-plain -->
            <x-button class="btn-plain" @click.native="cancelOrder()" v-if="cancelBtn">
              取消订单
            </x-button>
            <x-button :class="{'btn-disable': !canpay(),  'btn-purple': canpay()}"
            @click.native="preparePay()">
              去支付
            </x-button>
          </div>
      </div>
      <vx-dialog
        :show="dialogData.show"
        :tips="dialogData.tips"
        @onConfirm="confirm()"
        @onCancel="cancel()">
      </vx-dialog>
    </template>
    <BuyProtocol
      v-if="showProtocol"
      @close="closeProtocol"
      :agreement="agreement">
    </BuyProtocol>
    <!--没有地址提示-->
    <div class="address_pop" v-if="addressTipsShow">
      <div class="address_pop_mask"></div>
      <div class="address_con">
        <div class="address_con_txt">为了保证您及时收到学习资料，请准确填写。</div>
        <div class="address_con_btn">
          <a href="javascript:;" class="address_pop_cancel" @click="addressTipsShow=false">取消</a>
          <a href="javascript:;" class="address_pop_confirm" @click="editAddress(0)">确认</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Checker, CheckerItem, XButton } from 'vux';
  import payWait from '@/mixins/payWait';
  import pay from '@/mixins/pay';
  import VxDialog from '@/components/dialog/Index';
  import BuyProtocol from '@/components/common/BuyProtocol';

  export default{
    components: {
      Checker,
      CheckerItem,
      XButton,
      VxDialog,
      BuyProtocol,
    },
    mixins: [payWait, pay],
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';
  .address_pop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    .address_pop_mask{
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
    .address_con{
      width: 5.25rem;
      height: 3.8rem;
      background: #fff;
      border-radius:10px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: .7rem .45rem;
      .address_con_txt{
        font-size: .3rem;
        color: #1B223F;
        line-height: .5rem;
        text-align: center;
      }
      .address_con_btn{
        margin-top: .7rem;
        height: .7rem;
        padding: 0 .25rem;
        a{
          display: block;
          width: 1.4rem;
          border: 1px solid #9A57C8;
          font-size: .3rem;
          line-height: .68rem;
          border-radius:10px;
          text-align: center;
          &.address_pop_cancel{
            float: left;
            color: #9A57C8;
          }
          &.address_pop_confirm{
            float: right;
            color: #fff;
            background: #9A57C8;
          }
        }
      }
    }
  }
  .wait-pay{
    position: relative;
    padding: 0 0 1.1rem;
    min-height: 100%;
    background: @col-bg;
    color: @col-darkgray;
    .item-box-fluid{
      position: relative;
      padding: .3rem .5rem;
      background: #fff;
      &.shadow{
        margin: 0 0 .2rem;
        .item-shadow;
      }
    }
    .item-box{
      .item-box;
    }
    .address-bar{
      .wh(100%, .06rem);
      .bg-m('@{img-path}/address-bar.png');
      background-size: 100% 100%;
    }
    .item-box-logistics{
      background-color: @col-bg-address;
      padding: .3rem .9rem .3rem .4rem;
      display: flex;
      flex-direction: row;
      font-size: .3rem;
      position: relative;
      &.sp{
        padding: .5rem .9rem .5rem .4rem;
      }
      .icon-box{
        margin-right: .2rem;
        .address-icon{
          margin-top: .2rem;
          display: inline-block;
          .wh(.3rem,.36rem);
          .bg-m('@{img-path}/address-icon.png');
          background-size: 100% 100%;
        }
      }
      .logistics-address-info{
        flex: 1;
        .user-name{
          padding-right: .6rem;
        }
        .address{
          .wordbreak;
        }
      }
    }
    .pay-status{
      text-align: center;
      p{
        line-height: .36rem;
      }
      .pay-tit{
        color: @col-orange;
        font-size: .3rem;
      }
      .tips{
        margin-top: .1rem;
      }
      i{
        color: @col-orange;
      }
    }
    .comm-tit{
      .comm-tit(.36rem,@col-darkgray);
    }
    .name{
      color: @col-gray;
    }
    .val{
      flex: 1;
      i{
        color: @col-orange;
      }
    }

    .title-box {
      display: flex;
      justify-content: space-between;
      // height: .5rem;
      font-size: .28rem;
      .title {
        width: 3.5rem;
        height: .5rem;
        color: #1c223d;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .title-info {
        width: 2.2rem;
        height: .5rem;
        color: #b2b7ce;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: right;
      }
    }
    .lists-item{
      padding-top: .2rem;
      li{
        margin-top: .2rem;
        padding-top: .2rem;
        border-top: .01rem solid @col-border;
        &:first-of-type{
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        .details-box{
          position: relative;
          min-height: .36rem;
          p{
            margin-top: .1rem;
            line-height: .36rem;
          }
          .time{
            &:before{
              content: '';
              display: inline-block;
              vertical-align: top;
              margin: .05rem .04rem 0 0;
              .wh(.4rem,.27rem);
              .bg-m('@{img-path}/course-details-icon.png');
              background-size: .4rem 4.5rem;
            }
          }
          .price{
            position: absolute;
            right: 0;
            bottom: 0;
            line-height: .36rem;
            font-size: .3rem;
            .original{
              font-size: .26rem;
              text-decoration:line-through;
              color: @col-gray;
            }
            .current{
              padding-left: .16rem;
              // color: @col-orange;
            }
          }
        }
      }
    }
    .logistics-infor,.cost-details,.order-details{
      padding-top: .2rem;
      p{
        display: flex;
        line-height: .36rem;
        font-size: .3rem;
        & + p{
          margin-top: .1rem;
        }
        .name{
          width: 1.6rem;
        }
      }
    }
    .cost-details{
      p{
        justify-content: space-between;
        .val{
          text-align: right;
        }
      }
    }
    .total{
      margin-top: .2rem;
      padding-top: .2rem;
      border-top: .01rem solid @col-border;
      font-size: .3rem;
      text-align: right;
      .money{
        color: @col-orange;
      }
    }
    .payment-mode{
      .title{
        line-height: .36rem;
        font-size: .3rem;
      }
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
      padding: .2rem 0;
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
      padding: .2rem .2rem 0;
      .price{
        font-size: .44rem;
      }
      .weui-btn{
        margin-left:0.1rem; 
      }

    }
  }
  .address_tips{
    margin-top: .14rem;
    color: #FE763A;
    font-size: .26rem;
  }
  .address_btn{
  display: block;
  width: .5rem;
  line-height: .3rem;
  position: absolute;
  right: .3rem;
  top: 50%;
  transform: translate(0, -50%);
  font-size: .24rem;
  text-align: center;
  color: #4A4A4A;
  &.add_ico{
    padding-top: .43rem;
    background:url('../../assets/add_address_ico.png') no-repeat center top;
    background-size: .33rem;
  }
  &.edit_ico{
    padding-top: .4rem;
    background:url('../../assets/edit_address_ico.png') no-repeat center top;
    background-size: .16rem .3rem;
  }
}
.avatar {
  display: inline-block;
  vertical-align: middle;
  margin-left: .05rem;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 100%;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
