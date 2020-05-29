<template>
  <div class="datetab">
    <checker
      type="checkbox"
      default-item-class="checkbox-item">
      <checker-item
        :value="index"
        v-for="(item, index) in weekList"
        :key="index"
        @on-item-click="selectWeek(index)"
        :class="{'checkbox-item-selected': isWeek(index), 'checkbox-item-conform': !isWeek(index) && selWeek == index}"
        >
        <span v-if="showDate">{{getMoment(index).format('MM-DD')}}</span>
        周{{ item }}
      </checker-item>
    </checker>
  </div>
</template>

<script>
  import moment from 'moment';
  import { Checker, CheckerItem } from 'vux';

  export default {
    components: {
      Checker,
      CheckerItem,
    },
    props: {
      weekList: {
        type: Object,
        default: {},
      },
      weekTimes: {
        type: Array,
        default: [],
      },
      selWeek: {
        type: String,
        default: '',
      },
      showDate: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    methods: {
      selectWeek(index) {
        this.$emit('selectWeek', {
          week: index,
        });
      },
      isWeek(index) {
        let sign = false;
        this.weekTimes.forEach((element) => {
          if (element.week === index) {
            sign = true;
          }
        });
        return sign;
      },
      getMoment(date) {
        return moment(date);
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';
  .datetab{
    display: flex;
    margin: .3rem 0 0;
    padding-left: .06rem;
    background: #f8f8f8;
    white-space: nowrap;
    overflow-x: auto;
    .vux-checker-box{
      padding-bottom: .01rem;
    }
    .checkbox-item{
      margin: 0 .04rem;
      position: relative;
      padding: .1rem .04rem;
      width: 1.1rem;
      border: .01rem solid transparent;
      border-radius: .08rem;
      line-height: .3rem;
      text-align: center;
      font-size: .24rem;
      span{
        display: block;
      }
      .date{
        display: block;
        font-size: .2rem;
      }
      &:after{
        content: '';
        position: absolute;
        display: none;
      }
    }
    /* 选中 */
    .checkbox-item-conform{
      position: relative;
      background: #fff;
      border: .01rem solid @col-purple;
      color: @col-purple;
      // &:before, &:after{
      //   content: '';
      //   position: absolute;
      //   left: 50%;
      //   display: block;
      //   margin-left: -.12rem;
      //   border-width: .12rem;
      //   border-color: transparent;
      //   border-style: solid;
      //   border-bottom-width: 0;
      // }
      // &:before{
      //   z-index: 1;
      //   bottom: -.12rem;
      //   border-top-color: @col-purple;
      // }
      // &:after{
      //   z-index: 2;
      //   bottom: -.11rem;
      //   border-top-color: #fff;
      // }
    }
    /* 确认选中 */
    .checkbox-item-selected{
      border: .01rem solid @col-purple;
      background: #fff;
      color: @col-purple;
      &:after{
        right: 0;
        bottom: 0;
        display: block;
        .wh(.36rem,.36rem);
        border-bottom-right-radius: .08rem;
        .bg-m('@{img-path}/selecttime-icon.png');
        background-size: .36rem .36rem;
      }
    }
  }
</style>
