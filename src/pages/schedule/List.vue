<template>
  <div class="course" :class="{'noscroll': dialogData.show}">
    <div class="course-header">
      <h1>{{ classroomInfo.course.title }}</h1>
      <p>
        {{classroomInfo.start_date | formatDate}} - {{classroomInfo.end_date | formatDate}}
      </p>
      <p>
        共{{classroomInfo.course.course_id > 0 ? (classroomInfo.lessons * 2) : classroomInfo.lessons}}节
      </p>
    </div>
    <div class="courselist" ref="courselist" :style="'minHeight:'+height+'rem'">
      <Loading v-if="isLoading"></Loading>
      <div v-else-if="!isLoading && scheduleList.length !== 0">
        <!-- textbook_id：教材体系 22：reach  23：he -->
        <div class="nav" :class="{'nav_fix': filtFixed}" v-if="classroomInfo.course.textbook_id && classroomInfo.course.textbook_id !== 23" >
          <tab
            bar-active-color="#7149D0"
            custom-bar-width='.9rem'
            active-color='#6F4BD5'>
            <tab-item selected @on-item-click="onItemClick">{{title1}}</tab-item>
            <tab-item @on-item-click="onItemClick">{{title2}}</tab-item>
          </tab>
        </div>
        <div v-if="showCourse">
          <no-content
            v-if="scheduleListOne.length == 0"
            :tips="tips">
          </no-content>
          <course-schedule
            :courseInfo="item"
            v-for="(item, index) in scheduleListOne"
            :key="index"
            @showAdjust="showAdjust">
          </course-schedule>
        </div>
        <div v-if="!showCourse">
          <no-content
            v-if="scheduleListTwo.length == 0"
            :tips="tips">
          </no-content>
          <minor-schedule
            :courseInfo="item"
            v-for="(item, index) in scheduleListTwo"
            :key="index"
            @showAdjust="showAdjust">
          </minor-schedule>
        </div>
      </div>
      <adjust-dialog
        :show="dialogData.show"
        :changeNum="dialogData.changeNum"
        :tips="dialogTips"
        @onConfirm="confirmAdjust()"
        @onCancel="cancelAdjust()">
      </adjust-dialog>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api';
import { TransferDom, Tab, TabItem } from 'vux';
import moment from 'moment';
import AdjustDialog from '@/components/dialog/AdjustDialog';
import PopAdjust from '../../components/common/PopAdjust';
import { formatDate } from '../../filters';
import NoContent from '../../components/common/NoContent.vue';
import Loading from '../../components/loading/Index';
import CourseSchedule from '../../components/schedule/CourseSchedule.vue';
import MinorSchedule from '../../components/schedule/MinorSchedule.vue';

export default {
  name: 'scheduleList',
  components: {
    PopAdjust,
    NoContent,
    Loading,
    CourseSchedule,
    AdjustDialog,
    Tab,
    TabItem,
    MinorSchedule,
  },
  data() {
    return {
      classroomId: 0,
      classroomInfo: {
        course: '',
      },
      scheduleList: [],
      scheduleListOne: [],
      scheduleListTwo: [],
      course: '',
      showPop: false,
      adjustParams: {},
      tips: '暂无课程安排',
      dialogTips: '注：调课仅变动上课时间或老师，该课次学习内容不变',
      isLoading: true,
      dialogData: {
        show: false,
        changeNum: 3,
      },
      height: 0,
      showCourse: true,
      tabIndex: 0,
      filtTop: 0,
      filtFixed: false,
      title1: '',
      title2: '',
    };
  },
  directives: {
    TransferDom,
  },
  filters: { formatDate },
  methods: {
    getClassroom() {
      const url = `${this.apiConfig.host}/classroom/classrooms/${this.classroomId}`;
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.classroomInfo = res.data;
      });
    },
    getList() {
      const url = `${this.apiConfig.host}/classroom/classrooms/${this.classroomId}/schedules`;
      this.$http.get(url).then((res) => {
        this.isLoading = false;
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.scheduleList = res.data;
        this.scheduleListOne = res.data;
        this.title1 = res.data[0].course.content_type_name;
        for (let i = 0; i < this.scheduleList.length; i += 1) {
          if (this.scheduleList[i].relation) {
            this.scheduleListTwo.push(this.scheduleList[i]);
            this.title2 = this.scheduleList[i].relation.course.content_type_name;
          }
        }

      });
    },
    showAdjust(item) {
      this.adjustParams = item;
      this.dialogData.changeNum = this.adjustParams.changeNum;
      this.dialogData.show = true;
    },
    goTime() {
      this.$router.push({
        name: 'adjustTeacher',
        params: {
          courseId: this.adjustParams.courseId,
          scheduleId: this.adjustParams.scheduleId,
        },
        query: {
          teacher_id: this.adjustParams.teacherId,
          date: moment(this.adjustParams.date).format('YYYY-MM-DD'),
        },
      });
    },
    cancelAdjust() {
      this.dialogData.show = false;
    },
    confirmAdjust() {
      if (this.adjustParams.changeNum === 0) {
        return false;
      }
      this.dialogData.show = false;
      this.goTime();
    },
    onItemClick(index) {
      this.tabIndex = index;
      if (this.tabIndex === 0 || this.tabIndex === undefined) {
        this.showCourse = true;
      } else {
        this.showCourse = false;
      }
    },
    async init() {
      await this.$store.dispatch('updateLoading', {
        loading: true,
      });
      this.classroomId = await this.$route.params.classroomId;
      await this.getClassroom();
      await this.getList();
      await this.onItemClick();
      await this.$store.dispatch('updateLoading', {
        loading: false,
      });
    },
    handleScroll() {
      // 页面滚动距顶部距离
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (this.$refs.courselist) {
        this.filtTop = this.$refs.courselist.getBoundingClientRect().top + 60;
        if (scrollTop > this.filtTop) {
          this.filtFixed = true;
        } else {
          this.filtFixed = false;
        }
      }
    },
  },
  mounted() {
    this.init();
    if (!this.$store.state.userInfo) {
      getUserInfo();
    }
    this.height = (document.body.offsetHeight * 0.01) - 1;
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style lang="less">
  @import "../../styles/basic.less";
  .course{
    min-height: 100%;
    overflow: hidden;
    background:linear-gradient(99deg,rgba(155,86,255,1) 0%,rgba(111,75,213,1) 100%);
    .course-header{
      padding: .33rem .44rem;
      color: @new-col-white;
      h1{
        font-size: .36rem;
        line-height: .5rem;
        font-weight: 600;
        height: .5rem;
        font-family: PingFangSC-Semibold;
        .wordbreak;
      }
      p{
        line-height: .4rem;
        font-size: .28rem;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        line-height: .4rem;
        &:first-of-type{
          margin: .05rem 0;
        }
      }
    }
    .courselist {
      height: 100%;
      background: @new-col-white;
      border-radius: 20px 20px 0 0;
      padding: .2rem;
    }
    .nav{
      margin-bottom: .4rem;
      background: @new-col-white;
      height: .9rem;
      font-weight: 600;
      padding: 0 1rem;
      &.nav_fix{
        position: fixed;
        width: 100%;
        background: #fff;
        margin: 0;
        left: 0;
        top: 0;
        z-index: 3;
      }
      .vux-tab-wrap, .vux-tab-container{
        height: .9rem;
        padding: 0;
      }
      .vux-tab {
        height: .9rem;
      }
      .vux-tab .vux-tab-item{
        line-height: .9rem;
        height: .9rem;
        font-size: .32rem;
        color: @new-col-title-dark;
        background-size: 100% 0px;
      }
      .vux-tab-ink-bar {
        height: .14rem !important;
      }
    }
    .vux-tab-bar-inner {
      border-radius: 7px;
    }
  }
</style>
