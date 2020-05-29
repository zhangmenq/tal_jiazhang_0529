<template>

  <li class="item">
    <p class="infor">
      {{recommended.student.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}
      <span v-if="recommended.progress > 0">已获得{{recommended.progress >= 4 ? 210 : 10}}</span>
    </p>
    <ul class="oul">
      <li>
        <h3>
          <span class="gray"
            :class="{'purple':recommended.progress >= 1}">
          </span>
          已领取诊断课
          <em v-if="recommended.progress >= 1">
            {{dateFormat(recommended.created_at)}}
          </em>
        </h3>
      </li>
      <li>
        <i class="axis gray"
          :class="{'purple':recommended.progress >= 2}">
        </i>
        <h3>
          <span class="gray"
            :class="{'purple':recommended.progress >= 2 }">
          </span>
          已付费正式课
          <em v-if="recommended.progress >= 2">
            {{dateFormat(recommended.major_time)}}
          </em>
        </h3>
      </li>
      <li>
        <i class="axis gray"
        :class="{'purple':recommended.progress === 4,
        'orange':recommended.progress === 3}">
        </i>
        <h3>
          <span class="gray"
            :class="{'purple':recommended.progress === 4,
            'orange':recommended.progress === 3}">
          </span>
          已过退费期
          <em v-if="recommended.progress === 3">{{dateFormat(recommended.refund_time)}}</em>
          <em v-if="recommended.progress === 4">{{dateFormat(recommended.finish_time)}}</em>
        </h3>
      </li>
    </ul>
  </li>
</template>
<script>
import moment from 'moment';


export default {
  props: {
    recommended: {},
  },
  methods: {
    dateFormat(date) {
      if (moment(date).isValid()) {
        return moment(date).format('YYYY/MM/DD');
      }
      return '';
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.recommended-list {
    padding: .3rem;
    border-radius: .1rem;
    background: @col-white;
    box-shadow:0px 0px 0px 0px rgba(140,140,140,0.4);
    .infor {
      padding: 0 0 .3rem 0;
      height: .8rem;
      font-size: .3rem; 
      span {
        float: right;
        color: @col-orange;
      }
    }
    .item {
      padding-bottom: .3rem;
      margin-bottom: .3rem;
      border-bottom: .01rem solid #EAE7E5;
    }
    .oul {
      display: flex;
      // justify-content: space-between;
      li {
        position: relative;
        text-align: center;
        width: 33%;
        h3 span {
          margin: 0 auto .13rem;
        }
        &:nth-child(1) {
          h3 {
            float: left;
            width: 1.65rem;
          }
        }
        &:nth-child(3) {
          .axis{
            width: 120%;
          }
          h3 {
            float: right;
            width: 1.4rem;
          }
        }
        &:nth-child(2) {
          h3 {
            width: 1.9rem;
            margin: 0 auto;
          }
        }
        .axis {
          position: absolute;
          top: .25rem;
          left: -55%;
          z-index: 1;
          width: 100%;
          display: inline-block;
          border-bottom: .04rem solid @col-gray;
          &.purple{
            border-bottom: .04rem solid @col-purple;
          }
          &.orange{
            border-bottom: .04rem solid @col-orange;
          }
        }
        span {
          position: relative;
          z-index: 2;
          display: block;
          .wh(.5rem, .5rem);
          border-radius: 100%;
          color: @col-white;
          background: @col-gray;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            .wh(.5rem, .5rem);
            display: block;
            content: "";
           .bg-m('@{img-path}/introduce-dui1.png');
           background-position: center center;
           background-size: 80%;
          }
          &.purple {
            background: @col-purple;
          }
          &.orange {
            background: @col-orange;
            &::before {
              content: "";
              .bg-m('@{img-path}/introduce-cuo1.png');
              background-size: 100%;
            }
          }
        }
        h3 {
          font-size: .26rem;
          // letter-spacing: .001rem;
          em {
            display: block;
            font-size: .2rem;
            color: #B3B9D1;
          }
        }
      }

    }
  }
</style>
