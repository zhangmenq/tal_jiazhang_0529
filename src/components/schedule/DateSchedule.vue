<template>
<div class="info1">
  <div class="item1">
    <h1>
      <time>
        {{scheduleInfo.start_at | formatDate('HH:mm')}} - {{scheduleInfo.end_at | formatDate('HH:mm')}}
      </time>
      <span
        class="type"
        v-if="scheduleInfo.course.content_type"
        :class="{'major': contentType === 1 || contentType === 6 || contentType === 7,
        'minor': contentType === 2 || contentType === 4 || contentType === 5 || contentType === 8 || contentType === 9,
        'he': contentType === 3}">
        {{scheduleInfo.course.content_type_name}}
      </span>
    </h1>
    <h2>
      第{{scheduleInfo.no}}讲 {{scheduleInfo.circle && scheduleInfo.circle.circles ? scheduleInfo.circle.circles.title : ''}}
      <div class='label label-one' v-if="scheduleInfo.type===2">补</div>
      <div class="label label-two" v-if="scheduleInfo.is_test===1">循环测</div>
    </h2>
    <div class="Lessons">
      <p class="tit">
        {{scheduleInfo.course.title}}
      </p>
      <div  class="scheduleInfoTeacher" v-if="scheduleInfo.teacher">
        <router-link
          :to="{name: 'teacher',
          params: {'id': scheduleInfo.teacher.id}}"
          class="avatar">
          <img v-if="scheduleInfo.teacher.avatar_url !== ''" :src="scheduleInfo.teacher.avatar_url"/>
          <img v-else src="../../assets/default-photo-teacher.png"/>
        </router-link>
        <span class="name">
          {{scheduleInfo.teacher.realname}}
        </span>
      </div>
    </div>
    <div
      class="flow"
      v-if="contentType !==3 || (contentType === 3 && !scheduleInfo.circle_progress.testing.show)">
      <div
        :class="{'flow-done': isFlowOne, 'flow-wait': !isFlowOne}"
        v-show="scheduleInfo.circle_progress.lecture.show > 0">
      </div>
      <p
        :class="{'flow-p-done': isFlowOne, 'flow-p-wait': !isFlowOne}"
        v-show="scheduleInfo.circle_progress.lecture.show > 0">
        讲义
      </p>
      <div
        :style="'width:' + lineWidth + '%'"
        :class="{'flow-line-done': isFlowOne, 'flow-line-wait': !isFlowOne}"
        v-show="scheduleInfo.circle_progress.lecture.show > 0">
      </div>
      <div
        :class="{'flow-done': isFlowTwo, 'flow-wait': !isFlowTwo}"
        v-show="scheduleInfo.circle_progress.preview.show > 0">
      </div>
      <p
        :class="{'flow-p-done': isFlowTwo, 'flow-p-wait': !isFlowTwo}"
        v-show="scheduleInfo.circle_progress.preview.show > 0">
        探索站
      </p>
      <div
        :style="'width:' + lineWidth + '%'"
        :class="{'flow-line-done': isFlowTwo, 'flow-line-wait': !isFlowTwo}"
        v-show="scheduleInfo.circle_progress.preview.show > 0">
      </div>
      <div
        :class="{'flow-done': isFlowThree, 'flow-wait': !isFlowThree}"
        v-show="scheduleInfo.circle_progress.learn_status.show > 0">
      </div>
      <p
        :class="{'flow-p-done': isFlowThree, 'flow-p-wait': !isFlowThree}"
        v-show="scheduleInfo.circle_progress.learn_status.show > 0">
        上课
      </p>
      <div
        :style="'width:' + lineWidth + '%'"
        :class="{'flow-line-done': isFlowThree, 'flow-line-wait': !isFlowThree}"
        v-show="scheduleInfo.circle_progress.learn_status.show > 0">
      </div>
      <div
        :class="{'flow-done': isFlowFour, 'flow-wait': !isFlowFour}"
        v-show="scheduleInfo.circle_progress.homework.show">
      </div>
      <p
        :class="{'flow-p-done': isFlowFour, 'flow-p-wait': !isFlowFour}"
        v-show="scheduleInfo.circle_progress.homework.show">
        蓄能站
      </p>
    </div>
    <div class="btn-fn">
      <span
        v-if="contentType !== 3"
        class="fn-item highlight"
        @click="goAims()">
        学习指导
      </span>
      <span
        v-if="contentType === 1 || contentType === 6 || contentType === 7 || (contentType === 3 && !scheduleInfo.circle_progress.testing.show)"
        class="fn-item"
        :class="{'highlight': scheduleInfo.circle_progress.teacher_comment.show &&
        scheduleInfo.circle_progress.teacher_comment.finish}"
        @click="goClassReport()">
        课堂报告
      </span>
      <span
        v-if="contentType === 2 || contentType === 4 || contentType === 5 || contentType === 8 || contentType === 9"
        class="fn-item"
        :class="{'highlight': scheduleInfo.circle_progress.report.finish}"
        @click="getMinorRes">
        课堂报告
      </span>
      <span
        v-if="contentType === 3 && scheduleInfo.circle_progress.testing.show"
        @click="goTestReport()"
        class="fn-item"
        :class="{'highlight': scheduleInfo.circle_progress.testing.finish}">
        测试报告
      </span>
      <span
        v-if="contentType === 3 && scheduleInfo.circle_progress.testing.show"
        class="fn-item"
        :class="{'highlight': scheduleInfo.circle_progress.cycle_test.finish}"
        @click="goCycleReport()">
        综合报告
      </span>
    </div>
    <div class="foot-btn" v-if="contentType === 3 || contentType === 1 || contentType === 6 || contentType === 7">
      <div
        class="fn-comment"
        @click="evaluate()">
        <div :class="{'highlight': (scheduleInfo.circle_progress.comment_teacher.show || scheduleInfo.circle_progress.comment_teacher.finish), 'new-comment': (!scheduleInfo.circle_progress.comment_teacher.show && !scheduleInfo.circle_progress.comment_teacher.finish)}"></div>
        <span :class="{'text-new-comment': (!scheduleInfo.circle_progress.comment_teacher.show && !scheduleInfo.circle_progress.comment_teacher.finish)}">评价老师</span>
      </div>
      <div
        v-if="!isExp && contentType !== 6"
        class="fn-adjust"
        @click="showAdjust()">
        <div :class="{'highlight': (!inSchedule && scheduleInfo.can_change.err === 0 && scheduleInfo.classroom && scheduleInfo.classroom.adjusts > 0), 'new-adjust': (inSchedule || scheduleInfo.can_change.err !== 0 || !scheduleInfo.classroom || scheduleInfo.classroom.adjusts <= 0)}"></div>
        <span :class="{'text-new-adjust': (inSchedule || scheduleInfo.can_change.err !== 0 || !scheduleInfo.classroom || scheduleInfo.classroom.adjusts <= 0)}">调课</span>
      </div>
    </div>

  </div>
</div>
</template>

<script>
  import moment from 'moment';
  import { formatDate } from '@/filters';
  import { getMinorReport, setApilog } from '@/api';

  export default {
    filters: { formatDate },
    data() {
      return {
        isFlowOne: this.scheduleInfo.circle_progress.lecture.finish > 0,
        isFlowTwo: this.scheduleInfo.circle_progress.preview.finish > 0,
        isFlowThree: this.scheduleInfo.circle_progress.learn_status.finish > 0,
        isFlowFour: this.scheduleInfo.circle_progress.homework.finish > 0,
        arrList: [],
        lineWidth: 0,
      };
    },
    props: {
      scheduleInfo: {
        type: Object,
        default: {},
      },
    },
    computed: {
      contentType() {
        return this.scheduleInfo.course.content_type;
      },
      inSchedule() {
        return moment() >= moment(this.scheduleInfo.start_at) &&
          moment() <= moment(this.scheduleInfo.end_at);
      },
      beforeSchedule() {
        return moment() < moment(this.scheduleInfo.start_at);
      },
      afterSchedule() {
        return moment() > moment(this.scheduleInfo.end_at);
      },
      isExp() {
        return [3, 5].indexOf(this.scheduleInfo.course.type) > -1;
      },
    },
    mounted() {
      this.flowLine();
    },
    methods: {
      // 综合报告
      goCycleReport() {
        if (this.scheduleInfo.circle_progress.cycle_test.finish < 1) {
          return false;
        }
        setApilog({
          event_type: 70004,
          route: '/schedule',
          ext1: this.scheduleInfo.id,
        });
        this.$router.push({
          name: 'cycleTest',
          params: {
            scheduleId: this.scheduleInfo.id,
          },
        });
      },
      goTestReport() {
        if (this.scheduleInfo.circle_progress.testing.finish < 1) {
          return false;
        }
        this.$router.push({
          name: 'progressTest',
          params: {
            scheduleId: this.scheduleInfo.id,
          },
        });
      },
      moretime() {
        this.$router.push({
          name: 'moretime',
          params: {
            minor_id: this.scheduleInfo.id,
          },
        });
      },
      goAims(isRelation = 0) {
        this.$router.push({
          name: 'aims',
          query: {
            schedule_id: isRelation
              ? this.scheduleInfo.relation.id
              : this.scheduleInfo.id,
          },
        });
        setApilog({
          event_type: 70001,
          route: '/schedule',
          ext1: this.scheduleInfo.id,
        });
      },
      getMinorRes() {
        getMinorReport(this.scheduleInfo.id, 1, this.scheduleInfo.room_id).then((res) => {
          if (res.error_code !== 0) {
            this.$vux.toast.show({
              time: 2000,
              type: 'text',
              isShowMask: true,
              position: 'middle',
              text: '暂无报告',
              width: '17.6em',
            });
          } else {
            this.$router.push({
              name: 'learningReport',
              params: { minor_id: this.scheduleInfo.id },
              query: {
                single: 1,
                room_id: this.scheduleInfo.room_id,
              },
            });
            setApilog({
              event_type: 68001,
              ext1: this.scheduleInfo.id,
              ext2: 'course_tv',
              ext3: 'feedback',
              ext4: 3,
              ext5: this.$store.state.userInfo.id || 0,
            });
          }
        });
      },
      showAdjust() {
        //临时课、补课没有弹框
        const scheduleType = [1, 2].indexOf(this.scheduleInfo.type) > -1;
        if (!this.scheduleInfo.classroom || this.afterSchedule || scheduleType) {
          return false;
        }
        if (([10353, 10354].indexOf(this.scheduleInfo.can_change.err) > -1 &&
        this.scheduleInfo.classroom && this.scheduleInfo.classroom.adjusts >= 0)
        || [10350, 10360].indexOf(this.scheduleInfo.can_change.err) > -1) {
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: '调课时间还未到，课前14天允许调课，再等下吧~',
            width: '17.6em',
          });
          return;
        }
        if ((this.scheduleInfo.can_change.err === 10352 &&
          this.scheduleInfo.classroom && this.scheduleInfo.classroom.adjusts > 0)) {
          let tipsTxt = '调课需提前24小时操作，下次可以提前哦~';
          if (moment(this.scheduleInfo.classroom.created_at) < moment('2019-05-04 23:00:00')) {
            tipsTxt = '调课需提前15分钟操作，下次可以提前哦~';
          }
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: tipsTxt,
            width: '17.6em',
          });
          return;
        }
        if ((this.scheduleInfo.can_change.err === 0 &&
            this.scheduleInfo.classroom && this.scheduleInfo.classroom.adjusts > 0)) {
          this.$router.push({
            name: 'adjustTeacher',
            params: {
              courseId: this.scheduleInfo.course_id,
              scheduleId: this.scheduleInfo.id,
            },
            query: {
              teacher_id: this.scheduleInfo.teacher_id,
              date: moment().format('YYYY-MM-DD'),
              change_num: this.scheduleInfo.classroom.adjusts,
            },
          });
        }
      },
      goClassReport() {
        if (moment(this.scheduleInfo.end_at) > moment()) {
          return false;
        }
        if (!(moment(this.scheduleInfo.end_at) <= moment() &&
        this.scheduleInfo.circle_progress.teacher_comment.show &&
        this.scheduleInfo.circle_progress.teacher_comment.finish)) {
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: '暂无报告',
            width: '17.6em',
          });
        } else {
          this.goFeedback();
          setApilog({
            event_type: 68000,
            route: '/schedule',
            ext1: this.scheduleInfo.id,
            ext2: 'course_1v1',
            ext3: 'feedback',
            ext4: this.contentType === 1 ? 1 : 2,
            ext5: this.$store.state.userInfo.id || 0,
          });
        }
      },
      goFeedback() {
        if (this.contentType === 1) {
          this.$router.push({
            name: 'reportReach',
            params: {
              scheduleId: this.scheduleInfo.id,
            },

          });
        } else if (this.contentType === 3 || (this.contentType >= 6 && this.contentType < 10)) {
          this.$router.push({
            name: 'reportHe',
            params: {
              scheduleId: this.scheduleInfo.id,
            },
          });
        }
      },
      evaluate() {
        if (moment(this.scheduleInfo.end_at) <= moment()) {
          this.$router.push({
            name: 'evaluate',
            params: {
              teacherId: this.scheduleInfo.teacher_id,
              scheduleId: this.scheduleInfo.id,
            },
            query: {
              contenttype: this.contentType,
            },
          });
        } else {
          return false;
        }
        setApilog({
          event_type: 70003,
          route: '/schedule',
          ext1: this.scheduleInfo.id,
        });
      },
      flowLine() {
        if (this.scheduleInfo.circle_progress.lecture.show > 0) {
          this.arrList.push('');
        }
        if (this.scheduleInfo.circle_progress.preview.show > 0) {
          this.arrList.push('');
        }
        if (this.scheduleInfo.circle_progress.learn_status.show > 0) {
          this.arrList.push('');
        }
        if (this.scheduleInfo.circle_progress.homework.show > 0) {
          this.arrList.push('');
        }
        this.lineWidth = this.arrList.length === 1 ? 0 :
        (this.arrList.length === 2 ? 28 :
        ((this.arrList.length === 2 && this.scheduleInfo.circle_progress.homework.show > 0) ? 56.5 :
        (this.arrList.length === 3 ? 13 : 4)));
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';
.info1{
  .item1{
    position: relative;
    margin: .2rem .4rem 0;
    padding-top: .29rem;
    border-radius: .08rem;
    background: @new-col-white;
    color: @new-col-title-dark;
    box-shadow:0px 4px 20px 0px rgba(0,0,0,0.1);
    h1{
      margin-bottom: .22rem;
      padding: 0 .39rem;
      line-height: .44rem;
      font-size: .36rem;
      font-weight: 800;
      .type{
         height: 0.4rem;
        position: absolute;
        right: 0;
        top: 0;
        padding-left: .18rem;
        padding-right: .1rem;
        font-size: .2rem;
        text-align: center;
        line-height: .4rem;
        border-radius: 20px 0px 0px 20px;
        margin-top: .4rem;
        font-weight:500;
        &.minor{
          background: @new-col-bg-orange;
          color: @new-col-orange;
        }
        &.major{
          color: @new-col-purple;
          background: @new-col-bg-purple;
        }
         &.he{
          color: @new-col-purple;
          background: @new-col-bg-purple;
        }
      }
      .more-time {
        font-size: .24rem;
        color: @new-col-purple;
        background: @new-col-white;
      }
    }
    h2{
      margin-bottom: .08rem;
      padding: 0 .39rem;
      line-height: .45rem;
      font-size: .3rem;
      color: @new-col-title-dark;
      line-height: .45rem;
      font-weight: 500;
      .wordbreak;
      .label{
        display: inline-block;
        height: .30rem;
        border-radius: 15px 15px 15px 0px;
        font-size: .2rem;
        color: @new-col-white;
        line-height: .3rem;
        text-align: center;
        vertical-align: middle;
        margin: 0 .01rem .1rem;
      }
      .label-one{
        width: .53rem;
        background: linear-gradient(270deg,rgba(255,204,88,1) 0%,rgba(255,166,85,1) 100%);
      }
      .label-two{
        width: .83rem;
        background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
      }
    }
    .Lessons{
      position: relative;
      margin: 0 .39rem;
      padding-right: .8rem;
      min-height: .7rem;
      font-size: .24rem;
      .tit{
        position: relative;
        min-height: .2rem;
        color: @new-col-title-dark;
        font-weight: 400;
        font-family: PingFangSC-Regular;
        .wordbreak;
      }
      .name{
        color: @new-col-font-gray;
        display: inline-block;
        height: .6rem;
        vertical-align: bottom;
        padding-left: .2rem;
      }
      .scheduleInfoTeacher {
        height: .6rem;
        margin-top: .15rem;
        .avatar{
          width: .6rem;
          height: .6rem;
          overflow: hidden;
          display: inline-block;
          img{
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
          }
        }
      }
    }
    .flow{
      height: 0.34rem;
      width: 100%;
      padding: 0 0.39rem;
      margin-top: 0.21rem;
      div{
        display: inline-block;
      }
      p{
        display: inline-block;
        height: 0.34rem;
        font-size: 0.24rem;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        line-height: 0.34rem;
        vertical-align: super;
      }
      .flow-wait {
        width: 0.34rem;
        height: 0.34rem;
        .bg-m('@{img-path}/un-flow.png',center,center);
        background-size: cover;
      }
      .flow-done {
        width: 0.34rem;
        height: 0.34rem;
        .bg-m('@{img-path}/flow-success.png',center,center);
        background-size: cover;
      }
      .flow-p-wait {
        color: @new-col-font-gray;
      }
      .flow-p-done{
        color: @new-col-title-dark;
      }
      .flow-line-done{
        height: 0.04rem;
        background: rgba(111,75,213,1);
        margin-bottom: 0.13rem
      }
      .flow-line-wait{
        height: 0.04rem;
        background: rgba(185,181,194,1);
        margin-bottom: 0.13rem
      }
    }
    .btn-fn{
      padding: 0 0.4rem 0.4rem 0;
      .fn-item{
        margin: 0.4rem 0 0 0.4rem;
        padding: 0.1rem 0.29rem;
        border-radius: 0.3rem;
        border: 1px solid @col-gray;
        font-size: 0.28rem;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: @col-gray;
        display: inline-block;
        &.highlight{
          color: @new-col-purple;
          border: 1px solid @new-col-purple;
        }
      }
    }
    .foot-btn{
      display: flex;
      .fn-comment{
        flex: 1;
        padding: .36rem 0;
        text-align: center;
        font-size: .32rem;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: @new-col-title-dark;
        border-top: 1px solid @new-col-line-gray;
        .highlight{
          .bg-m('@{img-path}/new-comment.png',center,center);
          background-size: cover;
          width: 0.36rem;
          height: 0.34rem;
          display: inline-block;
          vertical-align: sub;
          margin-right: 0.1rem;
        }
        .new-comment{
          .bg-m('@{img-path}/comment-two.png',center,center);
          background-size: cover;
          width: 0.36rem;
          height: 0.34rem;
          display: inline-block;
          vertical-align: sub;
          margin-right: 0.1rem;
        }
        .text-new-comment {
          color: @new-col-gray;
        }
      }
      .fn-adjust{
        flex:1;
        padding: .36rem 0;
        text-align: center;
        font-size: .32rem;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: @new-col-title-dark;
        border-top: 1px solid @new-col-line-gray;
        border-left: 1px solid @new-col-line-gray;
        .highlight{
          .bg-m('@{img-path}/new-adjust.png',center,center);
          background-size: cover;
          width: 0.36rem;
          height: 0.34rem;
          display: inline-block;
          vertical-align: sub;
          margin-right: 0.1rem;
        }
        .new-adjust{
          .bg-m('@{img-path}/un-adjust.png',center,center);
          background-size: cover;
          width: 0.36rem;
          height: 0.34rem;
          display: inline-block;
          vertical-align: sub;
          margin-right: 0.1rem;
        }
        .text-new-adjust{
          color: @new-col-gray;
        }
      }
    }
  }
}
</style>
