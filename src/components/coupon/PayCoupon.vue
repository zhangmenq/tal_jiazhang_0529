<template>
  <div class="coupon">
    <div class="msg-tips" v-if="curIndex.length > 0">
      <p v-if="curIndex.length === 1 && curIndex[0] === 0">已为您选中推荐优惠券，使用优惠券1张，共抵用<i>¥ {{ discountPrice | formatMoneyInt }}</i></p>
      <p v-else>您已选中优惠券{{curIndex.length}}张，共抵用<i>¥ {{ discountPrice | formatMoneyInt }}</i></p>
    </div>
    <ul class="coupon-list">
      <li v-for="(item, index) in lists" :key="item.id">
        <div class="item-top" @click="selectCoupon(item, index)">
          <div class="price">
            <span><small>¥</small>{{ item.money | formatMoneyInt }}</span>
            <em v-if="item.limit_price > 0">满{{ item.limit_price | formatMoneyInt }}元可用</em>
          </div>
          <div class="content">
            <p class="tit">{{item.coupon.name}}</p>
            <time>{{item.start_at | formatDate}}-{{item.end_at | formatDate}}</time>
            <div class="btn-group">
              <a class="btn-selected" v-if="curIndex.indexOf(index) > -1">
                <icon type="success"></icon>
              </a>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <x-button class="btn-purple" @click.native="confirmCoupon()">
      确定
    </x-button>
    <a class="btn-instructions" @click="showPop = true">
      <span>
        <icon type="info"></icon>
      </span>
      <span>使用说明</span>
    </a>
    <div v-transfer-dom class="cus-dialog">
      <popup v-model="showPop" style="height: 5rem; overflow-y: auto;">
        <div class="instructions">
          <h1>使用说明：</h1>
          <p>1、优惠券不可提现、不可找零、不可兑换、不可叠加使用。</p>
          <p>2、优惠券有其所适用的范围，以优惠券上的具体使用说明为准，不在范围内的课程无法使用优惠券。</p>
          <p>3、优惠券过期后不可再使用。</p>
          <p>4、未支付订单取消，优惠券返还用户账户。</p>
          <p>5、已支付订单退费，应退金额=实际缴费金额-优惠后课单价*实际消耗课次，优惠券不返还。</p>
          <p>6、优惠券使用的最终解释权归学而思VIPX所有。</p>

          <p>2019寒春续报专用券（合并券）说明</p>
          <p>此合并券为2019寒春续报专用券，已自动合并您账户里所有可用于下一期课程续报的优惠券，可直接用于此次续报。</p>
          <p>合并范围：未使用且过期时间晚于2018年11月5日、适用范围为VIPX全部课程的优惠券</p>
          <p>适用人群：2018年秋季课程在读学员</p>
          <p>适用范围：报名2019年寒假课程或寒春课程可用</p>
          <p>有效期至：2019年1月20日</p>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { Icon, XButton, TransferDom, Popup } from 'vux';
  import { formatDate, formatMoney, formatMoneyInt } from '@/filters';

  export default{
    components: {
      Icon,
      XButton,
      Popup,
    },
    directives: { TransferDom },
    filters: {
      formatDate,
      formatMoney,
      formatMoneyInt,
    },
    data() {
      return {
        showPop: false,
        curIndex: [],
      };
    },
    props: {
      lists: {
        type: Array,
        default: function () {
          return [];
        },
      },
      coursePrice: {
        type: Number,
        default: 0,
      },
      selectedIndex: {
        type: Array,
        default: [],
      },
    },
    mounted() {
      this.curIndex = this.selectedIndex;
    },
    methods: {
      selectCoupon(item, idx) {
        const i = this.curIndex.indexOf(idx);
        if (i === -1) {
          if ((this.discountPrice + item.money) > this.coursePrice && this.curIndex.length > 0) {
            this.$vux.toast.show({
              time: 3000,
              type: 'warn',
              isShowMask: true,
              position: 'middle',
              text: '优惠券金额<br>不能超过课程支付总金额',
              width: '17.6em',
            });
            return;
          }
          this.curIndex.push(idx);
        } else {
          this.curIndex.splice(i, 1);
        }
      },
      confirmCoupon() {
        this.$emit('confirmCoupon', {
          index: this.curIndex,
          ids: this.curIds.join(','),
          totalCouponMoney: this.discountPrice,
        });
      },
    },
    computed: {
      discountPrice() {
        if (this.lists.length) {
          let totalCouponMoney = 0;
          this.curIndex.map((item) => {
            totalCouponMoney += this.lists[item].money;
            return this.lists[item].money;
          });
          return totalCouponMoney;
        }
      },
      curIds() {
        if (this.lists.length) {
          const arr = [];
          this.curIndex.map((item) => {
            arr.push(this.lists[item].id);
            return this.lists[item].id;
          });
          return arr;
        }
      },
    },
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .coupon{
    padding-bottom: .4rem;
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
      bottom: 1.8rem;
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
  .coupon-list{
  padding: .2rem .3rem;
  li{
    margin-bottom: .2rem;
    padding-bottom: .6rem;
    background: #fff;
    border-bottom-right-radius: .1rem;
    border-bottom-left-radius: .1rem;
    font-size: .26rem;
    color: @col-gray;
    &.gray{
      .item-top{
        background: @col-gray;
        .content{
          .btn-group{
            right: .2rem;
          }
        }
      }
    }
    .item-top{
      position: relative;
      display: flex;
      height: 1.74rem;
      border-radius: .1rem;
      .l-gradient(90deg,#8ec4fa,#5395f7);
      color: #fff;
      &:after{
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        .wh(100%,.05rem);
        .bg-m('@{img-path}/coupon-dot.png',0,0,repeat-x);
        background-size: .2rem .05rem;
      }
      .price{
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: .2rem 0 .3rem .4rem;
        width: 2.4rem;
        border-right: .01rem dashed #fff;
        span{
          line-height: .6rem;
          font-size: .6rem;
        }
        em{
          margin-top: .2rem;
        }
        small{
          padding-right: .08rem;
          font-size: .36rem;
        }
      }
      .content{
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: .2rem .3rem .3rem .2rem;
        .tit{
          height: .64rem;
          line-height: .32rem;
        }
        time{
          line-height: .2rem;
          font-size: .2rem;
        }
        .btn-group{
          position: absolute;
          right: .3rem;
          bottom: .3rem;
          .btn-view{
            display: block;
            .wh(1.4rem,.56rem);
            line-height: .54rem;
            .btn-plain(#fff,transparent);
            border-radius: .56rem;
            text-align: center;
          }
          .btn-selected{
            display: block;
            margin-bottom: .25rem;
            .weui-icon-success{
              font-size: .46rem;
              color: #fff;
            }
          }
          em{
            position: relative;
            display: block;
            vertical-align: middle;
            .wh(1.1rem,1.1rem);
            line-height: 1.02rem;
            border: .04rem solid #d0d7e1;
            border-radius: 100%;
            text-align: center;
            font-size: .24rem;
            color: #d0d7e1;
            transform: rotate(-45deg);
            &:after{
              content: '';
              .pos-box-cc(.9rem,.9rem);
              display: block;
              border: .02rem solid #d0d7e1;
              border-radius: 100%;
            }
          }
        }
      }
    }
    .item-intro{
      padding: .1rem .4rem;
      min-height: .56rem;
      p{
        position: relative;
        padding-right: .3rem;
        line-height: .36rem;
        .ellipsis-b;
        &.arrow{
          height: .36rem;
        }
        &.arrow:after{
          content: '';
          position: absolute;
          right: 0;
          top: .06rem;
          .wh(.14rem,.24rem);
          .bg-m('@{img-path}/arrow-icon.png');
          background-size: 100% 100%;
          .transitionMob(all .3s);
        }
      }
      &.active{
        padding-bottom: .2rem;
        p.arrow{
          height: auto;
          overflow: visible;
          span,em{
            display: block;
          }
          &.arrow:after{
            transform: rotate(90deg);
          }
        }
      }
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
