<template>
  <div class="selecttime">
    <div class="item" ref="filtTurnsTeacher">
      <div :class="{'filt_fix': filtFixed}">
        <teacher-filtrate @filtrate="filtrate" :teacher-counts="teacherCounts" :teacher-filtrate="teacherWhere"></teacher-filtrate>
      </div>
      <loading v-if="teacherFlag && lists.length == 0"></loading>
      <teacher-time-box
        v-if="!teacherFlag && lists.length > 0"
        :lists="lists"
        :teacher-first="teacherFirst"
        :teacher-last="teacherLast"
        :times="times"
        :sel-teacher="selTeacher"
        :sel-week="selWeek"
        :sel-time="selTime"
        :weeks="weeks"
        :loading-data="loadingData"
        :loading-time="loadingTime"
        @loadMore="loadMore"
        @selectWeek="selectWeek"
        @selectTime="selectTime">
      </teacher-time-box>
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
        @click.native="showTurnsPop()"
      >下一步</x-button>
    </div>
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
  import { XButton, TransferDom, Popup } from 'vux';
  import Loading from '@/components/loading/Index';
  import TeacherIntro from '@/components/teacher/TeacherIntro.vue';
  import TurnConfirm from '@/components/dialog/TurnConfirm.vue';
  import TeacherFiltrate from '@/components/time/TeacherFiltrate.vue';
  import teacher from '../../mixins/turnTeacher.js';

  export default {
    directives: { TransferDom },
    components: {
      XButton,
      Popup,
      Loading,
      TeacherIntro,
      TeacherFiltrate,
      TurnConfirm,
    },
    mixins: [teacher],
    data() {
      return {
        showPop: false,
        teacherInfo: {},
        videoPlayer: '',
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
  min-height: 100%;
  padding: .3rem .4rem 1rem .4rem;
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
  }
  .nav-next{
    .nav-next;
  }
  .item{
    background: #fff;
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
