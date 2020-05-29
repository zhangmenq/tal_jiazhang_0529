<template>
  <div class="exp-time-box">
    <loading v-if="timeLoading"></loading>
    <checker
      v-else-if="timeList.length !== 0"
      type="checkbox"
      default-item-class="checkbox-item">
      <checker-item
        :value="index"
        v-for="(item, index) in timeList"
        :key="index"
        @on-item-click="selectTime(item)"
        :class="{'checkbox-item-selected': isTime(item)}">
        {{ item.v }}
      </checker-item>
    </checker>
    <div class="notime" v-else>
      <div class="no-img default" :class="{'holiday': noTimeType === 2}"></div>
      <span v-if="noTimeType === 2">假日停课，请换其他时间看看</span>
      <span v-else>抱歉，该时间被约满了，请换其他时间看看</span>
    </div>
  </div>
</template>

<script>
  import { Checker, CheckerItem } from 'vux';
  import Loading from '@/components/loading/Index';

  export default {
    components: {
      Checker,
      CheckerItem,
      Loading,
    },
    props: {
      timeList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      selDate: {
        type: String,
        default: '',
      },
      dateTimes: {
        type: Array,
        default: [],
      },
      timeLoading: {
        type: Boolean,
        default: true,
      },
      noTimeType: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      // 选择的时间传入父组件
      selectTime(item) {
        this.$emit('selectTime', item);
      },
      // 判断时间是否已经选中
      isTime(item) {
        if (this.dateTimes.length > 0) {
          if (this.selDate === this.dateTimes[0].date && this.dateTimes[0].timeK === item.k) {
            return true;
          }
        }
        return false;
      },
    },
  };
</script>

<style lang="less">
  @import '../../styles/basic.less';

  .exp-time-box{
    background: #fff;
    padding: 0 .3rem .2rem;
    overflow-x: hidden;
    // display: flex;
    .notime{
      padding-bottom: .5rem;
      min-height: 3rem;
      text-align: center;
      color: @col-darkgray;
      .no-img{
        .wh(3.6rem, 2.8rem);
        margin: .5rem auto;
        &.default{
          background-image: url('../../assets/nocontent-time.png');
          background-size: 100%;
        }
        &.holiday{
          background-image: url('../../assets/nocontent-holiday.png');
          background-size: 100%;
        }
      }
    }
    .vux-checker-box{
      display: flex;
      flex-wrap: wrap;
      margin-right: -.32rem;
    }
    .checkbox-item{
      margin: .3rem 1.5% 0 1.5%;
      .wh(21%,.6rem);
      line-height: .6rem;
      border: .01rem solid @col-gray;
      border-radius: .08rem;
      text-align: center;
      font-size: .30rem;
    }
    .checkbox-item-selected{
      border: .01rem solid @col-purple;
      background: @col-purple;
      color: #fff;
    }
    .notice-tips{
      margin-top: .3rem;
      line-height: .34rem;
      font-size: .24rem;
      color: @col-gray;
    }
  }
</style>

