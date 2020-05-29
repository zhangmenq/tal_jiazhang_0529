<template>
  <div class="selecttime">
    <div v-if="lists.length > 0 || hasFiltrate">
      <teacher-filtrate @filtrate="filtrate" :teacher-counts="teacherCounts" :teacher-filtrate="teacherWhere"></teacher-filtrate>
      <div>
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
          :loading-time="loadingTime"
          :loading-data="loadingData"
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
          @click.native="showOrderPop()"
        >
          下一步
        </x-button>
      </div>
    </div>
    <!-- 下单确认弹框 -->
    <order-confirm v-if="orderPop"
      :selTeacher="selTeacher"
      :selWeek="Number(selWeek)"
      :selTime="selTime"
      :id="courseId ? Number(courseId) : Number(packageId)"
      :type="type === 'course' ? 1 : 2"
      @closePop="closePop"
      @confirm="confirm"></order-confirm>
  </div>
</template>

<script>
  import { XButton, TransferDom, Popup } from 'vux';
  import Loading from '@/components/loading/Index';
  import TeacherIntro from '@/components/teacher/TeacherIntro.vue';
  import OrderConfirm from '@/components/dialog/OrderConfirm.vue';
  import TeacherFiltrate from '@/components/time/TeacherFiltrate.vue';
  import teacher from '../../mixins/teacher.js';

  export default {
    directives: { TransferDom },
    components: {
      XButton,
      TransferDom,
      Popup,
      Loading,
      TeacherIntro,
      OrderConfirm,
      TeacherFiltrate,
    },
    mixins: [teacher],
    data() {
      return {
        showPop: false,
        teacherInfo: {},
        videoPlayer: '',
        orderPop: false,
      };
    },
    methods: {
      showOrderPop() {
        if (JSON.stringify(this.selTeacher) === '{}' || this.selWeek === '' || JSON.stringify(this.selTime) === '{}') {
          return;
        }
        if (this.orderPop) {
          return false;
        }
        this.orderPop = true;
      },
      closePop() {
        this.orderPop = false;
      },
    },
  };
</script>
<style lang="less">
@import '../../styles/basic.less';

.selecttime{
  min-height: 100%;
  margin:.4rem .4rem 1rem;
  padding-bottom: 0;
  border-radius: .1rem;
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
}
.item{
  margin-top: .2rem;
  padding-top: .2rem;
  background: #fff;
  box-shadow:0 .04rem .2rem 0 rgba(163,163,163,0.15);
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
