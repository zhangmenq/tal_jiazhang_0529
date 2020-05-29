<template>
  <div class="adjustTime">
    <sticky v-if="!teacherId">
      <div class="mycourse-tab">
        <tab
            :line-width='6'
            active-color='#1c223d'
            disabled-color='#b2b7ce'
            bar-active-color='#4964f4'
            custom-bar-width='.6rem'>
            <tab-item @click.native="selTeacher(0)">按老师选</tab-item>
            <tab-item selected>按时间选</tab-item>
        </tab>
      </div>
    </sticky>
    <div class="item">
      <div class="tit">选择合适上课的日期</div>
      <week-box
        v-if="selDate != 0"
        :sel-week="selDate"
        :week-list="weekList"
        :week-times="weekTimes"
        :showDate="true"
        @selectWeek="selectWeek">
      </week-box>
      <time-box
        :time-list="timeList"
        :sel-week="selDate"
        :week-times="weekTimes"
        @selectTime="selectTime">
      </time-box>
      <select-box
        :week-times="weekTimes"
        :week-list="weekList"
        :sel-week="selDate"
        :showDate="true"
        @delWeekTimes="delWeekTimes">
      </select-box>
    </div>
    <p class="toggle-tips">
      时间点不合适？
      <router-link
        :to="{name: 'adjustTeacher', param: {courseId: courseId, scheduleId: scheduleId}}">
        我要换老师
      </router-link>
    </p>
    <x-button
      class="btn-next"
      :class="{'active':weekTimes.length !== 0}"
      @click.native="adjustTime()"
    >
      {{teacherId ? '确认调课' : '下一步'}}
    </x-button>
  </div>
</template>

<script>
  import { Sticky, Tab, TabItem, XButton } from 'vux';
  import adjustTime from '../../mixins/adjustTime.js';

  export default {
    components: {
      Tab,
      TabItem,
      Sticky,
      XButton,
    },
    mixins: [adjustTime],
  };
</script>
<style lang="less">
@import '../../styles/basic.less';
.adjustTime{
  min-height: 100%;
  background: #f8f8f8;
  color: @col-darkgray;
  // background: @col-bg;
  // box-sizing: border-box;
  // height: 100%;
  // overflow: hidden;
  .mycourse-tab{
    box-shadow: 0 .2rem .2rem #ededed;
    z-index: 500;
    .search-icon{
      position: absolute;
      right: .3rem;
      top: .46rem;
      .wh(.3rem,.3rem);
      background-size: 100% 100%;
      .bg-m('../assets/search-img1.png',0,0,no-repeat);
    }
  }
  .vux-tab{
    font-size: .3rem;
    height: 1.2rem;
    .vux-tab-item{
      font-size: .3rem;
      background:none;
      line-height: 1.2rem;
    }
    .vux-tab-bar-inner{
      border-radius: .03rem;
    }
  }
  .item{
    padding: 0 0 .3rem;
    background: #fff;
  }
  .tit{
    margin: .2rem .3rem 0;
    padding-bottom: .2rem;
    border-bottom: .01rem solid @col-border;
    font-size: .3rem;
  }
  .toggle-tips{
    margin-top: .26rem;
    padding: 0 .3rem;
    text-align: right;
    font-size: .24rem;
    color: @col-gray;
    a{
      color: @col-purple;
    }
  }
  .btn-next{
    margin: .6rem auto .2rem;
    width: 76.8%;
    border-radius: .08rem;
    background: @col-gray;
    font-size: .36rem;
    color: #fff;
    &.active{
      background: @col-purple;
    }
  }
}
</style>

