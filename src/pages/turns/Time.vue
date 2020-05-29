<template>
  <div class="selecttime">
    <div class="select_fix" v-if="showTime"><span>已选时间： 周{{this.weekList[this.selWeek]}} {{this.selTime.v}}</span></div>
    <div class="selecttime_con" v-if="error.code == 0">
      <div class="selecttime_con_title">请选择合适的转班时间(向左滑动查看更多时间）</div>
      <div class="item no-paddingtop">
        <week-box
          v-if="selWeek != 0"
          :sel-week="selWeek"
          :week-list="weekList"
          :showDate="false"
          @selectWeek="selectWeek">
        </week-box>
        <time-box
          :time-list="timeList"
          :sel-time="selTime"
          :week-status="selWeek == defaultWeek"
          :default-time="defaultTime"
          :hint="true"
          :loading-time="loadingTime"
          @selectTime="selectTime">
        </time-box>
      </div>

      <div class="nav-next" :class="{'active': selTeacher.id}">
        <x-button
          class="btn-disable-white"
          :class="{'btn-purple': selTeacher.id}"
          @click.native="showTurnsPop"
        >下一步</x-button>
      </div>
    </div>
    <!--老师列表-->
    <div v-if="error.code == 0">
      <div class="item" ref="filtTurnsTime" v-if="JSON.stringify(selTime) !== '{}'">
        <div :class="{'filt_fix': filtFixed}">
          <teacher-filtrate @filtrate="filtrate" :teacher-counts="teacherCounts" :teacher-filtrate="teacherWhere"></teacher-filtrate>
        </div>
        <loading v-if="teacherFlag && teacherList.length == 0"></loading>
        <teacher-box
          v-if="!teacherFlag && teacherList.length > 0"
          :teacher-list="teacherList"
          :busy="teacherLast <= 0"
          :teacher-first="teacherFirst"
          :sel-teacher="selTeacher"
          @loadMore="loadMore"
          @selectTeacher="selectTeacher"></teacher-box>
        <no-content
          v-if="JSON.stringify(selTime) != '{}' && !teacherFlag && teacherList.length == 0 && !hasFiltrate"
          :tips="'抱歉，你选择的时间点老师被约满了，请换其他时间点看看'"
          :vertical="false"
          :fixedwidth="true">
        </no-content>

        <no-content
          v-if="JSON.stringify(selTime) != '{}' && !teacherFlag && teacherList.length == 0 && hasFiltrate"
          :tips="'抱歉，没有找到符合您筛选条件的老师<br>您可以尝试更换筛选条件'"
          :vertical="false"
          :defaultImg="'nofiltrateteacher'">
        </no-content>
      </div>
      <load-more
      v-if="teacherList.length !==0 && (loadingMore || teacherLast == 0)"
      :show-loading="loadingMore"></load-more>
    </div>
    <no-content v-else :tips="error.msg"></no-content>
    <!-- 转班确认弹框 -->
    <turn-confirm v-if="turnsPop"
      :classroom-id="Number(classroomId)"
      :week="Number(selWeek)"
      :time="Number(selTime.k)"
      :teacher-id="Number(selTeacher.id)"
      @closePop="closePop"
      @confirm="confirm"></turn-confirm>
  </div>
</template>

<script>
  /* eslint-disable */
  import { Sticky, Tab, TabItem, XButton, TransferDom, Popup } from 'vux';
  import TeacherIntro from '@/components/teacher/TeacherIntro.vue';
  import TeacherFiltrate from '@/components/time/TeacherFiltrate.vue';
  import TurnConfirm from '@/components/dialog/TurnConfirm.vue';
  import time from '../../mixins/turnsTime.js';

  export default {
    directives: { TransferDom },
    components: {
      Tab,
      TabItem,
      XButton,
      Popup,
      TeacherIntro,
      TeacherFiltrate,
      TurnConfirm,
      Sticky,
    },
    mixins: [time],
    data() {
      return {
        showPop: false,
        selectType: 1,
        teacherInfo: {},
        turnsPop: false,
      };
    },
    methods: {
      showTurnsPop() {
        if (this.selWeek === '' || JSON.stringify(this.selTime) === '{}' || JSON.stringify(this.selTeacher) === '{}') {
          return;
        }
        if (this.turnsPop) {
          return false;
        }
        this.turnsPop = true;
      },
      closePop() {
        this.turnsPop = false;
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';

.filt_fix{
  position: fixed;
  left: 0;
  right: 0;
  padding: .2rem .4rem 0;
  top: 1.7rem;
  background: #fff;
  z-index: 500;
}
.selecttime{
  padding:.3rem .4rem 1.6rem;
  color: @col-darkgray;
  background: #fff;
  .select_fix{
    position: fixed;
    left: 0;
    width: 100%;
    top: .6rem;
    background: #fff;
    line-height: .62rem;
    padding: .24rem 0;
    text-align: center;
    color: @new-col-purple;
    z-index: 3;
    font-size: .3rem;
    span{
      display: inline-block;
      padding-left: .55rem;
      .bg-m('@{img-path}/ico2/shijian.png');
      background-position: 0 center;
      background-size: .4rem .4rem;
    }
  }
  .selecttime_con{
    padding: .5rem .2rem .28rem;
    box-shadow:0 .04rem .2rem 0 rgba(163,163,163,0.15);
    border-radius:.1rem;
    .selecttime_con_title{
      line-height: .26rem;
      font-size: .26rem;
      border-left: 6px solid #B2B7CE;
      padding-left: .15rem;
      color: #B9B5C2;
    }
  }
  .item{
    margin-top: .2rem;
    padding: .2rem 0;
    background: #fff;
    &.no-paddingtop{
      padding-top: 0;
      padding-bottom: 0;
      margin-top: .3rem;
    }
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
  .btn-fn-right{
    display: flex;
    justify-content: flex-end;
    padding: 0 .2rem;
    .btn-pattern{
      .wh(1.8rem,.7rem);
      line-height: .7rem;
      border-radius: .08rem;
      text-align: center;
      font-size: .3rem;
      em{
        display: inline-block;
        vertical-align: middle;
        margin: -.04rem 0 0 0;
        .wh(.26rem,.2rem);
        .bg-m('@{img-path}/seltime-arrow.png');
        background-size: 100% 100%;
      }
    }
    &.btn-fn-center{
      justify-content: center;
      .btn-pattern{
        background: #fff;
        border: .01rem solid @col-gray;
      }
    }
  }
  .nav-next{
    .nav-next;
  }
  .nocontent{
    padding-bottom: .2rem!important;
  }
}
.timebox{
  padding: 0 !important;
}
.cus-dialog{
  .vux-popup-dialog{
    background: #fff;
    padding:.3rem;
    .teacher-box{
      .intro{
        line-height: .46rem;
        font-size: .3rem;
      }
      .video{
        margin-top: .26rem;
        padding-bottom: 57%;
        border-radius: .08rem;
        overflow: hidden;
        .trump-setting{
          .setting-definition, .setting-definition-value-curr, .setting-definition-value{
            font-size: .3rem;
          }
        }
        .trump-setting-close{
          top: auto;
          bottom: .1rem;
          right: .1rem;
          font-size: .3rem;
        }
      }
    }
    .nocontent{
      margin-top: .5rem;
      padding: .4rem .2rem .6rem;
    }
  }
}
</style>
