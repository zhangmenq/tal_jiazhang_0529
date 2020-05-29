<template>
  <div class="week-box mask" :class="{'datetab-adjust': type === 'adjust'}">
    <checker
      type="checkbox"
      default-item-class="checkbox-item" :class="{'has-date': type === 'adjust'}">
      <checker-item
        v-if="type === 'order'"
        :value="index"
        v-for="(item, index) in weekList"
        :key="index"
        @on-item-click="selectWeek(item, index)"
        :class="{'checkbox-item-conform': selWeek == index}"
        >
        <span v-if="showDate">{{getMoment(index).format('MM-DD')}}</span>
        周{{ item }}
      </checker-item>
      <checker-item
        v-if="type === 'adjust'"
        :value="index"
        v-for="(item, index) in weekList"
        :key="index"
        @on-item-click="selectWeek(item, index)"
        :class="[{'checkbox-item-conform': selDate === '' ? selWeek === item.k : selWeek === item.k && selDate === item.v},{'checkbox-disabled':item.time.length===0}]"
        >
        周{{ item.k | formatWeek }}
        <em class="target" v-if="item.time.length===0"></em>
        <em class="date">
          {{ item.v | formatDate('DD') }}
        </em>
      </checker-item>
    </checker>
  </div>
</template>

<script>
  import moment from 'moment';
  import { Checker, CheckerItem } from 'vux';
  import { formatDate, formatWeek } from '@/filters';

  export default {
    components: {
      Checker,
      CheckerItem,
    },
    filters: {
      formatDate,
      formatWeek,
    },
    props: {
      weekList: {
        type: [Object, Array],
        default: {},
      },
      selWeek: {
        type: [String, Number],
        default: '',
      },
      selDate: {
        type: String,
        default: '',
      },
      showDate: {
        type: Boolean,
        required: true,
        default: false,
      },
      type: {
        type: String,
        default: 'order',
      },
    },
    methods: {
      selectWeek(item, index) {
        if (this.type === 'order') {
          this.$emit('selectWeek', {
            week: index,
          });
        } else {
          this.$emit('selectWeek', {
            week: item.k,
            date: item.v,
            time: item.time,
          });
        }
      },
      getMoment(date) {
        return moment(date);
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';
  .week-box{
    .week-box;
    &.mask{
      padding-left: 0;
    }
    &.datetab-adjust{
      .checkbox-item{
        padding: .25rem 0 0;
      }
    }
  }
  // .week-box{
  //   display: flex;
  //   margin: .1rem 0 0;
  //   padding-left: .06rem;
  //   height: .7rem;
  //   // background: #f8f8f8;
  //   white-space: nowrap;
  //   overflow-x: auto;
  //   &.datetab-adjust{
  //     height: .9rem;
  //     .checkbox-item{
  //       padding: .06rem 0;
  //       width: 1.2rem;
  //       font-size: .2rem;
  //     }
  //     .checkbox-item-conform{
  //       font-size: .24rem;
  //     }
  //   }
  //   .vux-checker-box{
  //     padding-bottom: .01rem;
  //   }
  //   .checkbox-item{
  //     margin: 0 .04rem;
  //     position: relative;
  //     padding: .1rem .04rem;
  //     width: 1.1rem;
  //     border: .01rem solid transparent;
  //     border-radius: .08rem;
  //     line-height: .3rem;
  //     text-align: center;
  //     font-size: .24rem;
  //     span{
  //       display: block;
  //     }
  //     .date{
  //       display: block;
  //       font-size: .2rem;
  //     }
  //     &:after{
  //       content: '';
  //       position: absolute;
  //       display: none;
  //     }
  //   }
  //   /* 选中 */
  //   .checkbox-item-conform{
  //     position: relative;
  //     background: #fff;
  //     border: .01rem solid @col-purple;
  //     color: @col-purple;
  //     &:before, &:after{
  //       content: '';
  //       position: absolute;
  //       left: 50%;
  //       display: block;
  //       margin-left: -.12rem;
  //       border-width: .12rem;
  //       border-color: transparent;
  //       border-style: solid;
  //       border-bottom-width: 0;
  //     }
  //     &:before{
  //       z-index: 1;
  //       bottom: -.12rem;
  //       border-top-color: @col-purple;
  //     }
  //     &:after{
  //       z-index: 2;
  //       bottom: -.11rem;
  //       border-top-color: #fff;
  //     }
  //   }
  //   /* 确认选中 */
  //   .checkbox-item-selected{
  //     border: .01rem solid @col-purple;
  //     background: #fff;
  //     color: @col-purple;
  //     &:after{
  //       right: 0;
  //       bottom: 0;
  //       display: block;
  //       .wh(.36rem,.36rem);
  //       border-bottom-right-radius: .08rem;
  //       .bg-m('@{img-path}/selecttime-icon.png');
  //       background-size: .36rem .36rem;
  //     }
  //   }
  // }
</style>
