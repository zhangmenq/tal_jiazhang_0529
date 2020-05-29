<template>
  <li class="item-li" :class="{'gray': couponType === '0'}">
    <div class="item-top">
      <div class="price">
        <span><small>¥</small>{{coupon.money | formatMoneyInt}}</span>
        <em v-if="coupon.limit_price">满{{coupon.limit_price | formatMoneyInt}}元可用</em>
      </div>
      <div class="content">
        <p class="tit">{{coupon.coupon.name}}</p>
        <time v-if="coupon.status === 1">{{coupon.used_at | formatDate('YYYY-MM-DD HH:mm')}}使用</time>
        <time>{{coupon.start_at | formatDate}}-{{coupon.end_at | formatDate}}</time>
        <div class="btn-group">
          <router-link class="btn-view" to="/home" v-if="couponType === '1'">查看课程</router-link>
          <!-- <a class="btn-selected"><icon type="success"></icon></a> -->
          <em class="status-notyet" v-if="coupon.status === 0 && moment(now).isBefore(coupon.start_at)">未开始</em>
          <em class="status-expired" v-if="coupon.status === 0 && moment(now).isAfter(coupon.end_at)">已过期</em>
          <em class="status-hasused" v-if="coupon.status === 1">已使用</em>
        </div>
      </div>
    </div>
    <div class="item-intro" :class="{'active': showCollapse === idx}">
      <p v-if="coupon.range === 0"><span>适用课程：</span>不限</p>
      <p class="arrow" v-if="coupon.range === 1" @click="collapseShow(idx)">
        <span>适用课程：</span>
        <em
          v-for="(item, index) in coupon.coupon_details"
          :key="index">
          <template v-if="item.package">
            {{item.package.title}}
          </template>
          <template v-if="item.course">
            {{item.course.title}}
          </template>
        </em>
      </p>
    </div>
  </li>
</template>
<script>
import { Icon } from 'vux';
import moment from 'moment';
import { formatDate, formatMoneyInt } from '@/filters';

export default{
  props: {
    couponType: {
      type: String,
      default: '1',
    },
    idx: {
      type: Number,
      default: 0,
    },
    coupon: {},
  },
  components: {
    Icon,
  },
  filters: {
    formatDate,
    formatMoneyInt,
  },
  data() {
    return {
      showCollapse: -1,
      now: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  },
  methods: {
    collapseShow(idx) {
      if (this.showCollapse === idx) {
        this.showCollapse = -1;
      } else {
        this.showCollapse = idx;
      }
    },
    moment(date) {
      return moment(date);
    },
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
@import "../../styles/basic.less";

.item-li{
  margin-bottom: .2rem;
  padding-bottom: .04rem;
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
      p{
        white-space: normal;
      }
      p.arrow{
        height: auto;
        overflow: visible;
        span,em{
          display: block;
          .wordbreak;
        }
        &.arrow:after{
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>
