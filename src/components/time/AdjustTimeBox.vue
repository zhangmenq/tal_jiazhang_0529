<template>
  <div class="timebox">
    <checker
      v-if="timeList.length !== 0"
      type="checkbox"
      default-item-class="checkbox-item">
      <checker-item
        :value="index"
        v-for="(item, index) in timeList"
        :key="index"
        @on-item-click="selectTime(item.k, item.v)"
        :class="{'checkbox-item-selected': isTime(item.k)}"
        >
        {{ item.v }}
      </checker-item>
    </checker>
    <p class="notice-tips" v-if="hasMinor">注：美国语文课需要您根据宝宝选择合适的上课时间，一周一次；文学通识课的上课时间是固定的，只需要按时参加即可。</p>
    <div class="notime" v-if="timeList.length === 0">抱歉，没有可预约的时间，请换一个吧~</div>
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
    timeList: {
      type: Array,
      default: [],
    },
    selWeek: {
      type: String,
      default: '',
    },
    weekTimes: {
      type: Array,
      default: [],
    },
    hasMinor: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    // 选择的时间传入父组件
    selectTime(k, v) {
      this.$emit('selectTime', {
        k: this.isTime(k) ? '' : k,
        v: v,
      });
    },
     // 判断时间是否已经选中
    isTime(index) {
      let sign = false;
      if (this.weekTimes.length > 0) {
        this.weekTimes.forEach((element) => {
          if (element.week === this.selWeek && element.timeK === index) {
            sign = true;
          }
        });
      }
      return sign;
    },
  },
};
</script>

<style lang="less">
  @import '../../styles/basic.less';

  .timebox{
    background: #fff;
    padding: 0 .2rem .2rem;
    overflow-x: hidden;
    // display: flex;
    .notime{
      padding-top: 1.3rem;
      min-height: 3rem;
      text-align: center;
      color: @col-gray;
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
      font-size: .24rem;
    }
    .checkbox-item-selected{
      border: .01rem solid @col-purple;
      background: #fff;
      color: @col-purple;
    }
    .notice-tips{
      margin-top: .3rem;
      line-height: .34rem;
      font-size: .24rem;
      color: @col-gray;
    }
  }
</style>

