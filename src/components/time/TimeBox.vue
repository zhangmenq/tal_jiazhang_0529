<template>
  <div class="timebox">
    <checker
      v-if="timeList.length !== 0 && !loadingTime"
      type="checkbox"
      default-item-class="checkbox-item">
      <checker-item
        v-if="type === 'order'"
        :value="index"
        v-for="(item, index) in timeList"
        :key="index"
        @on-item-click="selectTime(item.k, item.v)"
        :class="{'checkbox-item-selected': item.k == selTime.k,'tag-original': weekStatus && defaultTime == item.k}"
        >
        {{ item.v }}
      </checker-item>

      <checker-item
        v-if="type === 'adjust'"
        :value="index"
        v-for="(item, index) in timeList"
        :key="index"
        @on-item-click="selectTime(item.k, item.v)"
        :class="{'checkbox-item-selected': item.k === selTime.k,'tag-original': weekStatus && defaultTime == item.k}"
        >
        {{ item.v }}
      </checker-item>
    </checker>
    <div class="notime" v-if="timeList.length === 0 && !loadingTime">抱歉，没有可预约的时间，请换一个吧~</div>
    <loading v-if="loadingTime"></loading>
    <div class="original-tips" v-if="hint">课程当前上课时间</div>
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
    type: {
      type: String,
      default: 'order',
    },
    timeList: {
      type: Array,
      default: [],
    },
    selTime: {
      type: Object,
      default: function () {
        return {};
      },
    },
    defaultTime: {
      type: Number,
      default: 0,
    },
    hint: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    weekStatus: {
      type: Boolean,
      default: false,
    },
    loadingTime: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 选择的时间传入父组件
    selectTime(k, v) {
      if (k === this.selTime.k) {
        return;
      }
      this.$emit('selectTime', {
        k: k,
        v: v,
      });
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
      border: .01rem solid @new-col-purple;
      border-radius: .3rem;
      text-align: center;
      font-size: .3rem;
      color:@new-col-purple;
    }
    .checkbox-item-selected{
      border: .01rem solid @new-col-purple;
      background: @new-col-purple;
      color: #fff;
    }
    .tag-original{
      position: relative;
      &:after{
        position: absolute;
        right: -.08rem;
        top: -.08rem;
        .wh(.2rem,.2rem);
        content: '';
        border-radius: 100%;
        background: @col-lightpurple;
      }
    }
    .notice-tips{
      margin-top: .3rem;
      line-height: .34rem;
      font-size: .24rem;
      color: @col-gray;
    }
    .original-tips{
      .notice-tips;
      &:before{
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin: -.04rem .1rem 0 0;
        .wh(.2rem,.2rem);
        border-radius: 100%;
        background: @col-lightpurple;
      }
    }
  }
</style>

