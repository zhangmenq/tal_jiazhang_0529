<template>
  <div class="selecttime">
    <div class="select_fix" v-if="showTime"><span>已选时间：{{this.selDate}} {{this.selWeek_cn[this.selWeek]}} {{this.selTimes.v}}</span></div>
    <div v-if="error.code === 0">
      <div class="item no-paddingtop">
        <p class="item_tips">请选择合适的调课时间(向左滑动查看更多时间）</p>
        <Loading v-if="timeLoading"></Loading>
        <div v-if="!timeLoading">
          <week-box
            :sel-week="selWeek"
            :sel-date="selDate"
            :week-list="weekList"
            :showDate="false"
            type="adjust"
            @selectWeek="selectWeek">
          </week-box>
          <time-box
            type="adjust"
            :time-list="timeList"
            :sel-week="selWeek"
            :sel-time="selTimes"
            :loading-time="loadingTime"
            @selectTime="selectTime">
          </time-box>
        </div>
      </div>
      <div class="item" ref="filtPositionTime" v-if="JSON.stringify(selTimes) !== '{}'">
        <div :class="{'filt_fix': filtFixed}">
          <teacher-filtrate @filtrate="filtrate" :teacher-counts="teacherCounts" :teacher-filtrate="teacherWhere"></teacher-filtrate>
        </div>
        <Loading v-if="teacherFlag == 1 && !hasFiltrate"></Loading>
        <teacher-box
          v-if="teacherFlag == 2 && teacherList.length > 0"
          :teacher-list="teacherList"
          :busy="teacherLast <= 0"
          :teacher-first="teacherFirst"
          :sel-teacher="selTeachers"
          @loadMore="loadMore"
          @selectTeacher="selectTeacher"
        ></teacher-box>
        <Loading v-if="(perPage > 1 && loadingData) || (loadingData && hasFiltrate)"></Loading>
        <no-content
          v-if="teacherFlag === 2 && teacherList.length == 0 && selTimes.k && !hasFiltrate"
          :tips="'抱歉，你选择的时间点老师被约满了，请换其他时间点看看'"
          :vertical="false">
        </no-content>

        <no-content
          v-if="teacherFlag === 2 && teacherList.length == 0 && selTimes.k && hasFiltrate"
          :tips="'抱歉，没有找到符合您筛选条件的老师<br>您可以尝试更换筛选条件'"
          :vertical="false"
          :defaultImg="'nofiltrateteacher'">
        </no-content>

      </div>
      <p class="btn-center" v-if="teacherLast == 0 && teacherFlag == 2 && teacherList.length">
        <span class="noteacher-txt">没有更多老师了～</span>
      </p>
      <div class="nav-next" :class="{'active': selTeachers.id}">
        <x-button
          class="btn-disable-white"
          :class="{'btn-purple': selTeachers.id}"
          @click.native="showAdjustPop()"
        >
          下一步
        </x-button>
      </div>
    </div>
    <no-content v-else :tips="error.msg">
      <p>拨打客服电话：4008002211转9</p>
    </no-content>
    <!-- 调课弹框 -->
    <adjust-confirm v-if="adjustPop"
      :oldTeacherId="Number(teacherId)"
      :oldscheduleId="Number(scheduleId)"
      :selTeachers="selTeachers"
      :selDate="selDate"
      :week="selWeek | formatWeek"
      :time="selTimes.v"
      @closePop="closePop"
      @confirm="confirm">
    </adjust-confirm>
  </div>
</template>
<script>
  /* eslint-disable */
  import { Tab, TabItem, XButton, TransferDom, Popup } from 'vux';
  import { formatDate, formatWeek } from '@/filters';
  import TeacherIntro from '@/components/teacher/TeacherIntro.vue';
  import TeacherFiltrate from '@/components/time/TeacherFiltrate.vue';
  import adjustByTime from '../../mixins/adjustByTime.js';
  import AdjustConfirm from '@/components/dialog/AdjustConfirm';

  export default {
    directives: { TransferDom },
    components: {
      Tab,
      TabItem,
      XButton,
      Popup,
      TeacherIntro,
      AdjustConfirm,
      TeacherFiltrate,
    },
    filters: {
      formatDate,
      formatWeek,
    },
    mixins: [adjustByTime],
    data() {
      return {
        selectType: 1,
        showPop: false,
        teacherInfo: {},
        adjustPop: false,
      };
    },
    methods: {
      showAdjustPop() {
        if (this.selWeek === '' || JSON.stringify(this.selTimes) === '{}' || JSON.stringify(this.selTeachers) === '{}') {
          return false;
        }
        if (this.adjustPop) {
          return false;
        }
        this.adjustPop = true;
      },
      closePop() {
        this.adjustPop = false;
      }
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
  padding: .3rem .4rem 1.6rem;
  color: @col-darkgray;
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
    padding: .2rem 0;
    background: #fff;
    &.no-paddingtop{
      margin-top: 0;
      padding-top: .4rem;
      box-shadow:0 .04rem .2rem 0 rgba(163,163,163,0.15);
    }
    .item_tips{
      font-size: .26rem;
      line-height: 1;
      padding-left: .07rem;
      border-left: .06rem solid #B2B7CE;
      color: #B2B7CE;
      margin:0 .2rem .25rem;
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
  .btn-center{
    display: flex;
    justify-content: center;
    padding-top: .4rem;
    .noteacher-txt{
      color: @col-gray;
    }
  }
  .nav-next{
    .nav-next;
    .nav-infor{
      padding: 0 .02rem 0 .2rem;
      font-size: .28rem;
      .name{
        padding-right: 0;
        em{
          max-width: 1.4rem;
        }
      }
    }
  }
  .nocontent{
    padding-bottom: .2rem!important;
  }
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
