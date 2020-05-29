<template>
  <div class="selecttime">
    <div v-if="error.code === 0">
      <div class="item no-paddingtop">
        <div style="clear:both;height:0;overflow:hidden;"></div>
        <p class="item_tips">请选择合适的调课时间(向左滑动查看更多时间）</p>
        <week-box
          v-if="selWeek != 0"
          :sel-week="selWeek"
          :week-list="weekList"
          :showDate="false"
          @selectWeek="selectWeek">
        </week-box>
        <time-box
          :time-list="timeList"
          :sel-week="selWeek"
          :sel-time="selTime"
          :loading-time="loadingTime"
          @selectTime="selectTime">
        </time-box>
      </div>
      <div class="item short-course" v-if="JSON.stringify(selTime) !== '{}' && isShortCourse && tvClassTime">
        <h4>推荐TV课上课时间<span class="look-back">支持查看回放</span></h4>
        <p>{{tvClassTime}}<span>推荐</span></p>
      </div>
      <div class="item" v-if="JSON.stringify(selTime) !== '{}' && isShortCourse && !shortTeacher.id">
        <no-content
          :tips="'抱歉，你选择的时间点老师被约满了，请换其他时间点看看'"
          :vertical="false">
        </no-content>
      </div>
      <teacher-filtrate @filtrate="filtrate" :teacher-counts="teacherCounts" :teacher-filtrate="teacherWhere"></teacher-filtrate>
      <div v-if="JSON.stringify(selTime) !== '{}' && !isShortCourse">
        <Loading v-if="teacherFlag && teacherList.length == 0"></Loading>
        <teacher-box
          v-if="!teacherFlag && teacherList.length > 0"
          :teacher-list="teacherList"
          :busy="teacherLast <= 0"
          :teacher-first="teacherFirst"
          :sel-teacher="selTeacher"
          @selectTeacher="selectTeacher"
          @loadMore="loadMore"></teacher-box>
          <no-content
            v-if="JSON.stringify(selTime) != '{}' && !teacherFlag && teacherList.length == 0 && !hasFiltrate"
            :tips="'抱歉，你选择的时间点老师被约满了，请换其他时间点看看'"
            :vertical="false">
          </no-content>

          <no-content
            v-if="JSON.stringify(selTime) != '{}' && !teacherFlag && teacherList.length == 0 && hasFiltrate"
            :tips="'抱歉，没有找到符合您筛选条件的老师<br>您可以尝试更换筛选条件'"
            :vertical="false"
            :defaultImg="'nofiltrateteacher'">
          </no-content>

          <load-more
          v-if="teacherList.length !== 0 && (loadingMore || teacherLast == 0)"
          :show-loading="loadingMore"></load-more>
      </div>
      <div class="nav-next" :class="{'active': selTeacher.id}">
        <x-button
          class="btn-disable-white"
          :class="{'btn-purple': selTeacher.id}"
          @click.native="showOrderPop()"
        >
          下一步
        </x-button>
      </div>
    </div>
    <no-content v-else :tips="error.msg">
      <p>拨打客服电话：4008002211转9</p>
    </no-content>
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
  /* eslint-disable */
  import { Sticky, Tab, TabItem, XButton, TransferDom, Popup } from 'vux';
  import playVideo from '@/utils/playVideo';
  import TeacherIntro from '@/components/teacher/TeacherIntro.vue';
  import OrderConfirm from '@/components/dialog/OrderConfirm.vue';
  import TeacherFiltrate from '@/components/time/TeacherFiltrate.vue';
  import time from '../../mixins/time.js';

  export default {
    directives: { TransferDom },
    components: {
      Tab,
      TabItem,
      XButton,
      Popup,
      TeacherIntro,
      Sticky,
      OrderConfirm,
      TeacherFiltrate,
    },
    mixins: [time],
    data() {
      return {
        selectType: 1,
        showPop: false,
        teacherInfo: {},
        orderPop: false,
        index: -1,
      };
    },
    methods: {
      showOrderPop() {
        if (this.isShortCourse && this.selTeacher.id) {
          this.confirm();
          return;
        } else if (this.selWeek === '' || JSON.stringify(this.selTime) === '{}' || JSON.stringify(this.selTeacher) === '{}') {
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
  .item_tips{
    font-size: .26rem;
    line-height: 1;
    padding-left: .07rem;
    border-left: .06rem solid #B2B7CE;
    color: #B2B7CE;
    margin:.4rem .2rem .25rem;
  }
  .nav {
    .nav;
    box-shadow:0 .08rem .2rem 0 rgba(53,37,94,0.08);
    .vux-tab-wrap,.vux-tab-container{
      height: 1.1rem;
    }
    .vux-tab{
      height: 1.1rem;
      width: 60%;
      .vux-tab-item{
        height: 1.1rem;
        line-height: 1.1rem;
        color: @new-col-title-dark;
        font-size: .28rem;
        &.vux-tab-selected{
          font-size: .36rem;
          font-weight: 500;
          color: @new-col-title-dark;
        }
      }
    }
  }
  .vux-tab-bar-inner{
    border-radius: .07rem;
  }
  .item{
    margin: .2rem 0;
    padding: .2rem 0;
    background: #fff;
    box-shadow:0 .04rem .2rem 0 rgba(163,163,163,0.15);
    &.no-paddingtop{
      padding-top: 0;
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
    &.short-course{
      padding: .3rem .4rem;
      font-size: .3rem;
      color: #1C223D;
      h4{
        height: .3rem;
        line-height: .3rem;
        padding-left: .2rem;
        border-left: .06rem solid @col-purple;
        span.look-back{
          padding-left: 20px;
          color: @col-subgray;
        }
      }
      p{
        margin: .2rem 0 .1rem;
        span{
          display: inline-block;
          width: .76rem;
          border: .02rem solid @col-orange;
          border-radius: .1rem;
          font-size: .24rem;
          color: @col-orange;
          text-align: center;
          line-height: .4rem;
          margin-left: .2rem;
        }
      }
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
    .tips{
      font-size: .24rem !important;
    }
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
