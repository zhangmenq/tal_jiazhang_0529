<template>
  <div class="selecttime">
    <div class="first-item">
      <div class="item-wrap" v-if="oldTeacher.length > 0">
        <teacher-time-box-adjust
          v-if="teacherFlag == 1 && oldTeacher.length > 0"
          :lists="oldTeacher"
          :teacher-first="teacherFirst"
          :busy="teacherLast <= 0"
          :times="times"
          :sel-teachers="selTeachers"
          :sel-week="selWeek"
          :sel-time="selTime"
          :loadingTime="loadingTime"
          @selectWeek="selectWeek"
          @selectTime="selectTime">
        </teacher-time-box-adjust>
      </div>
      <div class="item-wrap" ref="filtPosition">
        <div :class="{'filt_fix': filtFixed}">
          <teacher-filtrate @filtrate="filtrate" :teacher-counts="teacherCounts" :teacher-filtrate="teacherWhere"></teacher-filtrate>
        </div>
        <teacher-time-box-adjust
          v-if="teacherFlag == 1 && lists.length > 0"
          :lists="lists"
          :teacher-first="teacherFirst"
          :busy="teacherLast <= 0"
          :times="times"
          :sel-teachers="selTeachers"
          :sel-week="selWeek"
          :sel-time="selTime"
          :loadingTime="loadingTime"
          @loadMore="loadMore"
          @selectWeek="selectWeek"
          @selectTime="selectTime">
        </teacher-time-box-adjust>
        <!-- <div class="btn-center" v-if="isShowMore && !hasFiltrate">
          <a class="btn-more" @click="showMoreTeacher()">点击查看更多老师</a>
        </div> -->
        <p class="btn-center" v-if="teacherLast === 0 && lists.length > 0">
          <span class="noteacher-txt">没有更多老师了～</span>
        </p>
        <Loading v-if="page > 0 && loadingData"></Loading>
        <no-content
          v-if="!loadingData && lists.length == 0 && hasFiltrate"
          :tips="'抱歉，没有找到符合您筛选条件的老师<br>您可以尝试更换筛选条件'"
          :vertical="false"
          :defaultImg="'nofiltrateteacher'">
        </no-content>
      </div>
      <div class="nav-next" :class="{'active': JSON.stringify(selTime) != '{}'}">
        <x-button
          class="btn-disable-white"
          :class="{'btn-purple': JSON.stringify(selTime) != '{}'}"
          @click.native="showAdjustPop()"
        >
          下一步
        </x-button>
      </div>
    </div>

    <no-content
      v-if="lists.length === 0 && page === 1 && !loadingData && !hasFiltrate"
      :tips="'抱歉！该课程下没有可预约的老师了~ 拔打客服电话4008002211转9 '">
    </no-content>
    <!-- 调课弹框 -->
    <adjust-confirm v-if="adjustPop"
      :oldTeacherId="Number(teacherId)"
      :oldscheduleId="Number(scheduleId)"
      :selTeachers="selTeachers"
      :selDate="selDate"
      :week="weeks[selectedWeek]"
      :time="selTime.v"
      @closePop="closePop"
      @confirm="confirm">
    </adjust-confirm>
    <!-- 老师偏好 -->
    <prefer v-if="showPrefer"></prefer>
  </div>
</template>

<script>
  /* eslint-disable */
  import { Tab, XButton, TransferDom, Popup } from 'vux';
  import Loading from '@/components/loading/Index';
  import { formatDate } from '@/filters';
  import TeacherIntro from '@/components/teacher/TeacherIntro.vue';
  import TeacherFiltrate from '@/components/time/TeacherFiltrate.vue';
  import adjustByTeacher from '../../mixins/adjustByTeacher.js';
  import AdjustConfirm from '@/components/dialog/AdjustConfirm';
  import Prefer from '@/components/common/Prefer';

  export default {
    directives: { TransferDom },
    components: {
      XButton,
      Popup,
      Loading,
      TeacherIntro,
      TeacherFiltrate,
      AdjustConfirm,
      Tab,
      Prefer,
    },
    filters: { formatDate },
    mixins: [adjustByTeacher],
    data() {
      return {
        // showPop: false,
        teacherInfo: {},
        adjustPop: false,
      };
    },
    methods: {
      showAdjustPop() {
        if (JSON.stringify(this.selTeachers) === '{}' || this.selWeek === '' || JSON.stringify(this.selTime) === '{}') {
          console.log('参数错误');
          return;
        }
        if (this.adjustPop) {
          return false;
        }
        this.adjustPop = true;
      },
      closePop() {
        this.adjustPop = false;
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
  min-height: 100%;
  padding: .3rem .4rem 1.6rem .4rem;
  color: @col-darkgray;
  .item-wrap{
    .filter-title{
      display: flex;
      align-items: center;
      .other{
        width: 1.4rem;
        height: .72rem;
        line-height: .42rem;
        color:@new-col-black;
        font-size:.32rem;
        font-weight:bold;
      }
      .filter{
        flex:1.4rem 1;
      }
    }
  }
  .nav-next{
    .nav-next;
  }
  .btn-center{
    display: flex;
    justify-content: center;
    padding-top: .4rem;
    .btn-more{
      padding: 0 .35rem;
      height: .6rem;
      line-height: .58rem;
      border: .01rem solid @col-gray;
      border-radius: .3rem;
      font-size: .26rem;
    }
  }
  .noteacher-txt{
    color: @col-gray;
  }
  // .btn-fn-right{
  //   display: flex;
  //   justify-content: flex-end;
  //   padding: 0 .2rem;
  //   .btn-pattern{
  //     .wh(1.8rem,.7rem);
  //     line-height: .7rem;
  //     border-radius: .08rem;
  //     text-align: center;
  //     font-size: .3rem;
  //     em{
  //       display: inline-block;
  //       vertical-align: middle;
  //       margin: -.04rem 0 0 0;
  //       .wh(.26rem,.2rem);
  //       .bg-m('@{img-path}/seltime-arrow.png');
  //       background-size: 100% 100%;
  //     }
  //   }
  //   &.btn-fn-center{
  //     justify-content: center;
  //     .btn-pattern{
  //       background: #fff;
  //       border: .01rem solid @col-gray;
  //     }
  //   }
  // }
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
