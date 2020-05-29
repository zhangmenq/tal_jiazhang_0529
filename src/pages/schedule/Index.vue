<template>
  <div class="course_schedule" ref="schedule" :class="{'noscroll': dialogData.show}">
    <v-touch class="datepicker"
      @swipeleft="moveMonth(1)"
      @swiperight="moveMonth(-1)">
      <div class="datepicker-header">
        <span class="arrow-left" @click="moveMonth(-1)">
          <x-icon type="ios-arrow-left" size=".5rem"></x-icon>
        </span>
        <span class="yearmonth">{{viewData.yearMonth}}</span>
        <span class="arrow-right" @click="moveMonth(1)">
          <x-icon type="ios-arrow-right" size=".5rem"></x-icon>
        </span>
        <span class="gotoday" @click="init(2)">今天</span>
      </div>
      <ul class="datepicker-week">
        <li v-for="(item, index) in weekLists" :key="index">{{item}}</li>
      </ul>
      <ul class="datepicker-content"
        v-for="(weeks, key) in viewData.list" :key="key">
        <li
          v-for="(item, index) in weeks"
          :key="index"
          :class="{
            'current-month': item.format('YYYY-MM-DD') >= viewData.startAt && item.format('YYYY-MM-DD') <= viewData.endAt ? true : false,
            'today': item.format('YYYY-MM-DD') === todayDate,
            'active': item.format('YYYY-MM-DD') === checkDate,
            }"
            @click="getList(item.format('YYYY-MM-DD'))"
          >
          <div class="date">
            {{item.format('DD')}}
          </div>
          <div class="point">
            <em class="state finished"
              v-if="isType(item.format('YYYY-MM-DD'), 0) && item.format('YYYY-MM-DD') < moment(todayDate).format('YYYY-MM-DD')"></em>
            <em class="state major"
              v-if="isType(item.format('YYYY-MM-DD'), 1) && item.format('YYYY-MM-DD') >= moment(todayDate).format('YYYY-MM-DD')"></em>
            <em class="state minor"
              v-if="isType(item.format('YYYY-MM-DD'), 2) && item.format('YYYY-MM-DD') >= moment(todayDate).format('YYYY-MM-DD')"></em>
          </div>
        </li>
      </ul>
      <div class="status-tips">
        有课 (<span class="major">1v1课程</span><span class="minor">1vN课程 )</span>
        <span class="finished">已上课</span>
      </div>
    </v-touch>
    <!-- <schedules-new></schedules-new> -->
    <Loading v-if="error.code === 0"></Loading>
    <no-content
      v-else-if="scheduleList.length == 0"
      :tips="tips"
      :vertical="false">
    </no-content>
    <date-schedule
      v-else
      v-for="(item, index) in scheduleList"
      :key="index"
      :schedule-info="item"
      @showAdjust="showAdjust">
    </date-schedule>
    <adjust-dialog
      :show="dialogData.show"
      :changeNum="dialogData.changeNum"
      :tips="dialogTips"
      @onConfirm="confirmAdjust()"
      @onCancel="cancelAdjust()">
    </adjust-dialog>
  </div>
</template>

<script>
  import { TransferDom } from 'vux';
  import AdjustDialog from '@/components/dialog/AdjustDialog';
  import schedules from '../../mixins/schedules';
  import setPaddingBottom from '../../mixins/setPaddingBottom';
  import NoContent from '../../components/common/NoContent.vue';

  export default {
    name: 'schedule',
    components: {
      NoContent,
      AdjustDialog,
    },
    directives: {
      TransferDom,
    },
    data() {
      return {
        weekLists: ['日', '一', '二', '三', '四', '五', '六'],
        showPop: false,
        tips: '暂无课程安排',
        dialogTips: '注：调课仅变动上课时间或老师，该课次学习内容不变',
        dialogData: {
          show: false,
          changeNum: 3,
        },
      };
    },
    mixins: [schedules, setPaddingBottom],
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';
  .course_schedule{
    min-height: 100%;
    background: #fff;
    overflow: hidden;
  }
  .datepicker{
    padding: 0 .3rem .3rem;
    background: #fff;
    .box-shadow(0 .06rem .24rem rgba(0,0,0,.06));
    text-align: center;
    color: @col-gray;
    .datepicker-header{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .l-h(.9rem);
      font-size: .36rem;
      color: @col-darkgray;
      .arrow-left,.arrow-right{
        display: flex;
        .wh(.5rem,.5rem);
        .vux-x-icon {
          fill: @col-darkgray;
        }
      }
      .gotoday{
        position: absolute;
        right: .6rem;
        top: .15rem;
        padding-top: .24rem;
        .wh(.6rem,.6rem);
        line-height: .36rem;
        border-radius: .1rem;
        background: #fff;
        .box-shadow(0 .06rem .12rem rgba(90,151,247,.1));
        font-size: .24rem;
        color: @new-col-purple;
        overflow: hidden;
        &:before{
          content: 'DAY';
          .pos-box(100%,.24rem);
          line-height: .24rem;
          text-align: center;
          background: @new-col-purple;
          font-size: .2rem;
          color: #fff;
        }
      }
    }
    .datepicker-week,.datepicker-content{
      display: flex;
      li{
        flex: 1;
      }
    }
    .datepicker-week{
      border-bottom: .01rem solid @col-border;
      font-size: .26rem;
      li{
        padding: .2rem;
        font-weight: bold;
        &.active{
          color:red;
        }
      }
    }
    .datepicker-content{
      padding: .04rem 0;
      font-size: .34rem;
      &:hover,&.active{
        background-color: #fff;
        // box-shadow: 0 3px 4px rgba(0,0,0,.3);
      }
      li{
        position: relative;
        height: .7rem;
        .date{
          margin: .1rem auto 0;
          .wh(.5rem,.5rem);
          border-radius: 100%;
          line-height: .5rem;
          text-align: center;
        }
        .point{
          margin: .06rem auto 0;
          width: .7rem;
          font-size: 0;
          .state{
            display: none;
            margin: 0 .01rem;
            .wh(.1rem,.1rem);
            border-radius: 100%;
            font-size: .34rem;
            //已完成
            &.finished{
              display: inline-block;
              background: @col-gray;
            }
            // 有课-主修课
            &.major{
              display: inline-block;
              background: @new-col-purple;
            }
            // 有课-辅修课
            &.minor{
              display: inline-block;
              background: @col-orange;
            }
          }
        }

        &.current-month{
          color: @col-darkgray;
        }
        //今天
        &.today{
          color: @col-orange;
        }
        //选中
        &.active{
          color: #fff;
          .date{
            background: @new-col-purple;
          }
        }
      }
    }
    .status-tips{
      display: flex;
      padding: .16rem .36rem 0;
      span{
        margin-right: .2rem;
        margin-left: .1rem;
        &:before{
          display: inline-block;
          margin-right: .08rem;
          vertical-align: middle;
          content: '';
          .wh(.1rem,.1rem);
          border-radius: 100%;
        }
        &.major:before{
          background: @new-col-purple;
        }
        &.minor:before{
          background: @col-orange;
        }
        &.finished:before{
          background: @col-gray;
        }
        &.missedlessons:before{
          background: @col-yellow;
        }
      }
    }
  }
</style>
