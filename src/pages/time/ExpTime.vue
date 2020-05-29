<template>
  <div class="selecttime">
    <loading v-if="dateLoading"></loading>
    <div v-else-if="dateList.length > 0">
      <!-- 导航nav -->
      <div class="nav">
        <p class="tab-tips">请选择合适的上课时间</p>
      </div>
      <div class="item">
        <exp-week-box
          v-if="selWeek != 0"
          :date-list="dateList"
          :sel-date="selDate"
          :date-times="dateTimes"
          @selectDate="selectDate">
        </exp-week-box>
        <exp-time-box
          :time-list="timeList"
          :sel-date="selDate"
          :time-loading="timeLoading"
          :dateTimes="dateTimes"
          :no-time-type="noTimeType"
          @selectTime="selectTime">
        </exp-time-box>
        <!-- <exp-select-box
          :date-times="dateTimes"
          :date-list="dateList"
          @delDateTimes="delDateTimes">
        </exp-select-box> -->
      </div>
      <div class="nav-next" :class="{'active': selNum !== 0 && dateTimes.length == selNum}">
        <x-button
          class="btn-disable-white"
          :class="{'btn-purple': selNum !== 0 && dateTimes.length == selNum}"
          @click.native="showDialog()"
        >
          下一步
        </x-button>
      </div>
    </div>
    <no-content v-else :tips="'抱歉，没有可预约的时间'"></no-content>
    <exp-order-confirm
      v-if="dialogStatus"
      :date-times="dateTimes"
      :is-disabled="isDisabled"
      @confirm="confirm"
      @closeDialog="closeDialog"
    ></exp-order-confirm>
  </div>
</template>
<script>
  import { Tab, TabItem, XButton } from 'vux';
  import expTime from '../../mixins/expTime.js';
  import Loading from '../../components/loading/Index';

  export default {
    components: {
      Tab,
      TabItem,
      XButton,
      Loading,
    },
    mixins: [expTime],
    data() {
      return {
        selDate: '',
        timeList: [],
      };
    },
  };
</script>
<style lang="less">
@import '../../styles/basic.less';

.selecttime{
  min-height: 100%;
  background: #f8f8f8;
  color: @col-darkgray;
  .nav{
    background: #fff;
    .box-shadow(0 0.06rem 0.23rem rgba(0,0,0,0.06));
    .tab-tips{
      .l-h(1.2rem);
      text-align: center;
      font-size: .3rem;
      font-weight: bold;
      i{
        color: @col-orange;
      }
    }
    .vux-tab{
      height: 1.2rem;
      .vux-tab-item{
        .l-h(1.2rem);
        font-size: 0.3rem;
        &.vux-tab-selected{
          color: @col-purple;
        }
      }
    }
  }
  .item{
    margin-top: .2rem;
    background: #fff;
    .tit{
      margin: 0 .3rem;
      padding-bottom: .2rem;
      border-bottom: .01rem solid @col-border;
      font-size: .3rem;
    }
    .selected-tips{
      margin-top: .16rem;
      text-align: center;
      font-size: .2rem;
      color: @col-orange;
    }
  }
  .nav-next{
    .nav-next;
  }
}
</style>
