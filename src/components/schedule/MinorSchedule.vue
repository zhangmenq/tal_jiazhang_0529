<template>
  <div class="info">
    <!-- 课程页 -->
    <div class="item">
      <div class="h1" :class="{'active': isShow}" @click="showLessons">
        <span>第{{courseInfo.no}}讲</span>
        <span>{{courseInfo.relation.circle && courseInfo.relation.circle.circles ? courseInfo.relation.circle.circles.title : ''}}</span>
        <div class="label label-one" v-if="courseInfo.type===2">补</div>
        <div class="label label-two" v-if="courseInfo.is_test===1">循环测</div>
      </div>
      <div class="Lessons" v-if="isShow">
        <p class="time" v-if="courseInfo.relation.start_at">
          <span>{{courseInfo.relation.start_at | formatDate('YYYY.MM.DD')}}  {{courseInfo.relation.start_at | formatDate('HH:mm')}}—{{courseInfo.relation.end_at | formatDate('HH:mm')}}</span>
          <router-link
            class="courseTime"
            v-if="courseInfo.relation.course.type !== 6"
            :to="{name: 'moretime', params:{minor_id: courseInfo.relation.id}}">
            查看时间 >
          </router-link>
        </p>
        <div class="courseTeacher" v-if="courseInfo.relation.teacher">
          <router-link
            :to="{name: 'teacher',
            params: {'id': courseInfo.relation.teacher.id}}"
            class="avatar">
            <img v-if="courseInfo.relation.teacher.avatar_url !== ''" :src="courseInfo.relation.teacher.avatar_url"/>
            <img v-else src="../../assets/default-photo-teacher.png"/>
          </router-link>
          <span class="name">{{courseInfo.relation.teacher.realname}}</span>
        </div>
      </div>
      <div
        class="flow"
        v-show="isShow">
        <div
          :class="{'flow-done': isFlowOneMinor, 'flow-wait': !isFlowOneMinor}"
          v-show="courseInfo.circle_progress.minor_lecture.show > 0">
        </div>
        <p
          :class="{'flow-p-done': isFlowOneMinor, 'flow-p-wait': !isFlowOneMinor}"
          v-show="courseInfo.circle_progress.minor_lecture.show > 0">
          讲义
        </p>
        <div
          :style="'width:' + lineWidth + '%'"
          :class="{'flow-line-done': isFlowOneMinor, 'flow-line-wait': !isFlowOneMinor}"
          v-show="courseInfo.circle_progress.minor_lecture.show > 0">
        </div>
        <div
          :class="{'flow-done': isFlowTwoMinor, 'flow-wait': !isFlowTwoMinor}"
          v-show="courseInfo.circle_progress.minor_preview.show > 0">
        </div>
        <p
          :class="{'flow-p-done': isFlowTwoMinor, 'flow-p-wait': !isFlowTwoMinor}"
          v-show="courseInfo.circle_progress.minor_preview.show > 0">
          探索站
        </p>
        <div
          :style="'width:' + lineWidth + '%'"
          :class="{'flow-line-done': isFlowTwoMinor, 'flow-line-wait': !isFlowTwoMinor}"
          v-show="courseInfo.circle_progress.minor_preview.show > 0">
        </div>

        <div
          :class="{'flow-done': isFlowThreeMinor, 'flow-wait': !isFlowThreeMinor}"
          v-show="courseInfo.circle_progress.minor_learn_status.show > 0">
        </div>
        <p
          :class="{'flow-p-done': isFlowThreeMinor, 'flow-p-wait': !isFlowThreeMinor}"
          v-show="courseInfo.circle_progress.minor_learn_status.show > 0">
          上课
        </p>
        <div
          :style="'width:' + lineWidth + '%'"
          :class="{'flow-line-done': isFlowThreeMinor, 'flow-line-wait': !isFlowThreeMinor}"
          v-show="courseInfo.circle_progress.minor_learn_status.show > 0">
        </div>
        <div
          :class="{'flow-done': isFlowFourMinor, 'flow-wait': !isFlowFourMinor}"
          v-show="courseInfo.circle_progress.minor_homework.show > 0">
        </div>
        <p
          :class="{'flow-p-done': isFlowFourMinor, 'flow-p-wait': !isFlowFourMinor}"
          v-show="courseInfo.circle_progress.minor_homework.show > 0">
          蓄能站
        </p>
      </div>
      <div class="btn-fn" v-show="isShow">
        <span
          v-if="contentType !== 3"
          class="fn-item highlight"
          @click="goAims(1)">
          课堂目标
        </span>
        <span
          class="fn-item highlight"
          @click="getMinorRes">
          课堂报告
        </span>
        <span
          v-if="courseInfo.circle_progress.testing.show"
          @click="goTestReport()"
          class="fn-item"
          :class="{'highlight': courseInfo.circle_progress.testing.finish}">
          测试报告
        </span>
        <span
          v-if="courseInfo.circle_progress.testing.show"
          class="fn-item"
          :class="{'highlight': courseInfo.circle_progress.cycle_test.finish}"
          @click="goCycleReport()">
          综合报告
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import { setApilog } from '@/api';
  import { formatDate } from '@/filters';

  export default {
    filters: { formatDate },
    data() {
      return {
        isShow: false,
        isFlowOneMinor: this.courseInfo.circle_progress.minor_lecture.finish > 0,
        isFlowTwoMinor: this.courseInfo.circle_progress.minor_preview.finish > 0,
        isFlowThreeMinor: this.courseInfo.circle_progress.minor_learn_status.finish > 0,
        isFlowFourMinor: this.courseInfo.circle_progress.minor_homework.finish > 0,
        arrList: [],
        lineWidth: 0,
      };
    },
    props: {
      courseInfo: {
        type: Object,
        default: {},
      },
      showCourse: {
        type: Number,
        default: 0,
      },
    },
    computed: {
      contentType() {
        return this.courseInfo.course.content_type;
      },
      inSchedule() {
        return moment() >= moment(this.courseInfo.start_at) &&
          moment() <= moment(this.courseInfo.end_at);
      },
      beforeSchedule() {
        return moment() < moment(this.courseInfo.start_at);
      },
      afterSchedule() {
        return moment() > moment(this.courseInfo.end_at);
      },
      isExp() {
        return [3, 5].indexOf(this.courseInfo.course.type) > -1;
      },
    },
    mounted() {
      this.flowLine();
    },
    methods: {
      showLessons() {
        this.isShow = !this.isShow;
      },
      // 综合报告
      goCycleReport() {
        if (this.courseInfo.circle_progress.cycle_test.finish < 1) {
          return false;
        }
        this.$router.push({
          name: 'cycleTest',
          params: {
            scheduleId: this.courseInfo.id,
          },
        });
      },
      goTestReport() {
        if (this.courseInfo.circle_progress.testing.finish < 1) {
          return false;
        }
        this.$router.push({
          name: 'progressTest',
          params: {
            scheduleId: this.courseInfo.id,
          },
        });
      },
      goAims(isRelation = 0) {
        this.$router.push({
          name: 'aims',
          query: {
            schedule_id: isRelation
              ? this.courseInfo.relation.id
              : this.courseInfo.id,
          },
        });
      },
      getMinorRes() {
        setApilog({
          event_type: 68001,
          ext1: this.courseInfo.id,
          ext2: 'course_tv',
          ext3: 'feedback',
          ext4: 3,
          ext5: this.$store.state.userInfo.id || 0,
        });
        const scheduleId = this.courseInfo.relation
          ? this.courseInfo.relation.id
          : this.courseInfo.id;
        this.$router.push({
          name: 'learningReport',
          params: { minor_id: scheduleId },
          query: {
            single: this.courseInfo.relation ? 0 : 1,
            room_id: this.courseInfo.room_id,
          },
        });
      },
      goClassReport() {
        if (moment(this.courseInfo.end_at) > moment()) {
          return false;
        }
        if (!(moment(this.courseInfo.end_at) <= moment() &&
        this.courseInfo.circle_progress.teacher_comment.show &&
        this.courseInfo.circle_progress.teacher_comment.finish)) {
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
        }
      },
      goFeedback() {
        if (this.contentType === 1) {
          this.$router.push({
            name: 'reportReach',
            params: {
              scheduleId: this.courseInfo.id,
            },
          });
        } else if (this.contentType === 3 || (this.contentType >= 6 && this.contentType < 10)) {
          this.$router.push({
            name: 'reportHe',
            params: {
              scheduleId: this.courseInfo.id,
            },
          });
        }
      },
      evaluate() {
        if (moment(this.courseInfo.end_at) <= moment()) {
          this.$router.push({
            name: 'evaluate',
            params: {
              teacherId: this.courseInfo.teacher_id,
              scheduleId: this.courseInfo.id,
            },
          });
        } else {
          return false;
        }
      },
      flowLine() {
        if (this.courseInfo.circle_progress.minor_lecture.show > 0) {
          this.arrList.push('');
        }
        if (this.courseInfo.circle_progress.minor_preview.show > 0) {
          this.arrList.push('');
        }
        if (this.courseInfo.circle_progress.minor_learn_status.show > 0) {
          this.arrList.push('');
        }
        if (this.courseInfo.circle_progress.minor_homework.show > 0) {
          this.arrList.push('');
        }
        this.lineWidth = this.arrList.length === 1 ? 0 :
        (this.arrList.length === 2 ? 28 :
        ((this.arrList.length === 2 && this.courseInfo.circle_progress.minor_homework.show > 0) ? 56.5 :
        (this.arrList.length === 3 ? 13 : 4)));
      },
    },
  };
</script>

<style lang="less">
  @import '../../styles/basic.less';
  .info {
    box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.1);
    border-radius: 8px;
    margin: 0.2rem;
    .item{
      position: relative;
      padding: .33rem 0;
      border-radius: .08rem;
      background: @new-col-white;
      .h1{
        padding: 0 .5rem 0 .4rem;
        line-height: .45rem;
        font-size: .32rem;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: @new-col-title-dark;
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
        &:after{
          content: '';
          width: .32rem;
          height: .2rem;
          position: absolute;
          right: .39rem;
          .bg-m('@{img-path}arrow-icon-purple.png');
          background-size: .32rem .2rem;
          top: .45rem;
          transform: rotate(-90deg);
        }
        &.active:after{
          transform: rotate(0deg);
        }
      }
      .Lessons{
        position: relative;
        margin: 0 .39rem;
        padding-right: .8rem;
        min-height: .7rem;
        font-size: .24rem;
        .name{
          color: @new-col-font-gray;
          display: inline-block;
          height: .6rem;
          vertical-align: bottom;
          padding-left: .2rem;
        }
        .time{
          color: @new-col-title-dark;
          margin: 0.19rem 0 0.11rem 0;
          font-size: 0.28rem;
          .courseTime{
            color: @new-col-orange;
            margin-left: 0.3rem;
          }
        }
        .courseTeacher{
          height: .60rem;
          margin-top: .15rem;
          .avatar{
            width: .60rem;
            height: .60rem;
            overflow: hidden;
            display: inline-block;
            img{
              width: .60rem;
              height: .60rem;
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
          height:0.04rem;
          background:rgba(111,75,213,1);
          margin-bottom: 0.13rem
        }
        .flow-line-wait{
          height:0.04rem;
          background:rgba(185,181,194,1);
          margin-bottom: 0.13rem
        }
      }
      .fn-comment{
        padding-top: .37rem;
        text-align: center;
        font-size: .32rem;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: @new-col-title-dark;
        border-top: 1px solid @new-col-line-gray;
        width: 100%;
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
      }
      .btn-fn{
        padding: 0 0.4rem 0.4rem 0;
        .fn-item{
          margin: 0.4rem 0 0 0.4rem;
          padding: 0.1rem 0.29rem;
          border-radius: 30px;
          border: 1px solid @col-gray;
          display: inline-block;
          color: @col-gray;
          &.highlight{
            color: @new-col-purple;
            border: 1px solid @new-col-purple;
          }
        }
      }
    }
  }
</style>
