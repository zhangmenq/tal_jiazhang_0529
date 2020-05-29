<template>
  <div class="exp-week-box">
    <div class="datetab">
      <checker
        type="checkbox"
        default-item-class="checkbox-item">
        <checker-item
          :value="index"
          v-for="(item, index) in dateList"
          :key="index"
          @on-item-click="selectDate(item)"
          :class="{
            'checkbox-item-selected': isDate(item),
            'checkbox-item-conform': item.date === selDate,
            'checkbox-item-lest': dateList.length - 1 === index
          }">
          <span class="week">周{{ item.v }}</span>
          <span class="date">{{item.date.substring(8)}}</span>
        </checker-item>
      </checker>
    </div>
  </div>
</template>

<script>
  import { Checker, CheckerItem } from 'vux';

  export default {
    components: {
      Checker,
      CheckerItem,
    },
    props: {
      dateList: {
        type: Array,
        default: [],
      },
      selDate: {
        type: String,
        default: '',
      },
      dateTimes: {
        type: Array,
        default: [],
      },
    },
    methods: {
      selectDate(item) {
        this.$emit('selectDate', item);
      },
      isDate(item) {
        if (this.dateTimes.length > 0) {
          return item.date === this.dateTimes[0].date;
        }
        return false;
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';
  .exp-week-box{
    position: relative;
    height: 1.1rem;
    &::before{
      content: '';
      position: absolute;
      display: block;
      width: .8rem;
      height: 1.1rem;
      background: linear-gradient(left,rgba(255,255,255,1),rgba(255,255,255,0));
    }
    &::after{
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      width: .8rem;
      height: 1.1rem;
      background: linear-gradient(right,rgba(255,255,255,1),rgba(255,255,255,0));
    }
    .datetab{
      display: flex;
      padding-left: .35rem;
      white-space: nowrap;
      overflow-x: auto;
      .vux-checker-box{
        padding-bottom: .01rem;
      }
      .checkbox-item{
        margin: 0 .25rem;
        width: .6rem;
        line-height: .42rem;
        text-align: center;
        font-size: .24rem;
        &.checkbox-item-lest{
          margin-right: .6rem;
        }
        span{
          display: block;
        }
        .week{
          margin-top: .23rem;
          font-size: .24rem;
        }
        .date{
          font-size: .36rem;
        }
      }
      /* 选中 */
      .checkbox-item-conform{
        position: relative;
        color: @col-purple;
        &::before{
          content: '';
          position: absolute;
          display: block;
          left: .14rem;
          width: 0;
          height: 0;
          border: 0.16rem solid transparent;
          border-top-color: @col-purple;
        }
        .date{
          font-size: .42rem;
        }
      }
      // /* 确认选中 */
      // .checkbox-item-selected{
      //   border: .01rem solid @col-purple;
      //   background: #fff;
      //   color: @col-purple;
      //   &:after{
      //     right: 0;
      //     bottom: 0;
      //     display: block;
      //     .wh(.36rem,.36rem);
      //     border-bottom-right-radius: .08rem;
      //     .bg-m('@{img-path}/selecttime-icon.png');
      //     background-size: .36rem .36rem;
      //   }
      // }
    }
  }
</style>
