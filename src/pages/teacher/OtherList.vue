<template>
<div>
  <loading v-show="loading"></loading>
  <div class="other-teacher" v-show="!loading && list.length > 0">
    <div class="teacher-list">
      <div class="header-tip">
        <em class="icon-smile"></em>
        <span class="tips">挑选到心仪的老师和时间点后，赶快联系班主任调整哦！</span>
      </div>
      <div class="list-box"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="5"
        infinite-scroll-immediate-check="false"
        infinite-scroll-throttle-delay="500">
        <span class="avatar"
          :class="{'selected': teacher.id === teacherId}"
          v-for="(teacher, key) in list" :key="key"
          @click="selTeacher(teacher.id)">
          <img :src="teacher.avatar_url" v-if="teacher.avatar_url">
          <img src="../../assets/default-photo-teacher.png" v-else>
        </span>
      </div>
    </div>
    <div class="teacher-time">
      <div class="info-box">
        <div class="big-avatar">
          <img :src="teacherInfo.avatar_url" v-if="teacherInfo.avatar_url">
          <img src="../../assets/default-photo-teacher.png" v-else>
        </div>
        <div class="intro">
          <p class="name">{{teacherInfo.realname}}</p>
          <p class="tag">
            <span>{{teacherInfo.degrees}}</span>
            <span v-if="teacherInfo.teaching_age">{{teacherInfo.teaching_age}}教龄</span>
          </p>
        </div>
        <div class="follow-btn">
          <x-button class="select" :disabled="disabled" v-if="teacherInfo.is_attenttion" @click.native="setFavorite(0)">已关注</x-button>
          <x-button v-else :disabled="disabled" @click.native="setFavorite(1)">+关注</x-button>
        </div>
      </div>
      <div class="time-box">
        <div class="week">
          <div class="week-item"
            :class="{'select': id === weekId}"
            v-for="(week, id) in weeks" :key="id"
            @click="selWeek(id)">周{{week}}</div>
        </div>
        <div class="time">
          <loading v-if="timeLoading"></loading>
          <div class="all-time" v-else-if="JSON.stringify(times) !== '{}'">
            <span class="time-item" v-for="(time, key) in times" :key="key">{{time.v}}</span>
          </div>
          <div class="nocontent" v-else>
            <p class="tips">抱歉，你选择的时间点老师被约满～</p>
            <p class="tips">请换其他时间点看看</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 老师详情 -->
    <teacher-details :info="teacherInfo"></teacher-details>
  </div>
  <no-content
    v-show="!loading && list.length === 0"
    :tips="'抱歉，该课程没有老师啦～'"
    :vertical="true">
  </no-content>
  </div>
</template>

<script>
import { XButton } from 'vux';
import infiniteScroll from 'vue-infinite-scroll';
import { setFavorite } from '@/api/index';
import Loading from '@/components/loading/Index';
import NoContent from '@/components/common/NoContent';
import TeacherDetails from '@/components/teacher/TeacherDetails';

export default{
  components: {
    XButton,
    Loading,
    NoContent,
    TeacherDetails,
  },
  directives: {
    infiniteScroll,
  },
  data() {
    return {
      busy: false, // true -不可滑动 false-可滑动
      list: [], // 老师列表
      page: 1,
      last: 0,
      teacherId: 0,
      teacherInfo: {}, // 老师信息
      weeks: {},
      weekId: 0,
      times: {},
      timeLoading: false,
      loading: false,
      disabled: false,
    };
  },
  computed: {
    courseId() {
      return this.$route.query.course_id || 0;
    },
    packageId() {
      return this.$route.query.package_id || 0;
    },
  },
  methods: {
    setFavorite(tab) { // 关注 取消关注
      this.disabled = true;
      setFavorite({
        tab,
        teacher_id: this.teacherId,
      }).then((res) => {
        this.disabled = false;
        if (res.error_code > 0) {
          console.log(res.error_msg);
          return;
        }
        this.teacherInfo.is_attenttion = tab;
      });
    },
    loadMore() {
      if (this.busy || this.last === 0) {
        return;
      }
      this.getTeacherList();
    },
    getTeacherList(flag = 0) { // flag 1- 初始化请求
      if (flag) {
        this.loading = true;
      }
      this.busy = true;
      const teacherId = this.$route.query.teacher_id || 0;
      let url = `${this.apiConfig.host}/teacher/teacher-time/other-teachers?teacher_id=${teacherId}&page=${this.page}`;
      if (this.courseId) {
        url += `&course_id=${this.courseId}`;
      }
      if (this.packageId) {
        url += `&package_id=${this.packageId}`;
      }
      return this.$http.get(url).then((res) => {
        if (flag) {
          this.loading = false;
        }
        const list = res.data.data;
        if (res.data.error_code > 0) {
          return;
        }
        this.list = this.list.concat(list);
        if (flag) {
          this.teacherId = this.list[0].id;
        }
        this.last = res.data.last;
        if (res.data.last > 0) {
          this.page += 1;
          this.busy = false;
        }
      });
    },
    getTeacherInfo() {
      const url = `${this.apiConfig.host}/teacher/teacher/detail/${this.teacherId}`;
      this.$http.get(url).then((res) => {
        if (res.error_code > 0) {
          return;
        }
        this.teacherInfo = res.data;
      });
    },
    getWeek() {
      let url = `${this.apiConfig.host}/teacher/teacher-time/idle-week?teacher_id=${this.teacherId}`;
      if (this.courseId) {
        url += `&course_id=${this.courseId}`;
      }
      if (this.packageId) {
        url += `&package_id=${this.packageId}`;
      }
      return this.$http.get(url).then((res) => {
        if (res.error_code > 0) {
          return;
        }
        this.weeks = res.data;
        const weekKey = Object.keys(res.data);
        this.weekId = weekKey[0];
      });
    },
    getTime() {
      this.timeLoading = true;
      let url = `${this.apiConfig.host}/teacher/teacher-time/idle-time?teacher_id=${this.teacherId}&week=${this.weekId}`;
      if (this.courseId) {
        url += `&course_id=${this.courseId}`;
      }
      if (this.packageId) {
        url += `&package_id=${this.packageId}`;
      }
      return this.$http.get(url).then((res) => {
        this.timeLoading = false;
        if (res.error_code > 0) {
          return;
        }
        this.times = res.data;
      });
    },
    selWeek(weekId) {
      this.weekId = weekId;
      this.getTime();
    },
    async selTeacher(id) {
      this.teacherId = id;
      await this.getTeacherInfo();
      await this.getWeek();
      await this.getTime();
    },
    async init() {
      await this.getTeacherList(1);
      await this.getTeacherInfo();
      await this.getWeek();
      await this.getTime();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less">
@import "../../styles/basic.less";

.other-teacher{
  background-color: @col-white;
  .teacher-list{
    height: 3.9rem;
    .bg-m('@{img-path}/teacher-bg.png');
    background-size: 100% 100%;
    .header-tip{
      text-align: left;
      line-height: .4rem;
      background-color: #FFF3E1;
      color: #FFA000;
      font-size: .26rem;
      padding: .15rem 0 .15rem .6rem;
      .icon-smile{
        position: absolute;
        .wh(.3rem, .3rem);
        .bg-m('@{img-path}/smile-face.png');
        background-size: .3rem .3rem;
        top: .2rem;
        left: .2rem;
      }
    }
    .list-box{
      height: 1.2rem;
      padding-top: .2rem;
      padding-left: .37rem;
      white-space: nowrap;
      overflow-x: auto;
      .avatar{
        margin: auto .2rem;
        display: inline-block;
        .wh(.76rem, .76rem);
        border: .03rem solid @col-white;
        border-radius: 50%;
        &.selected{
          .wh(.86rem, .86rem);
          margin: auto .04rem;
          .box-shadow(0 .06rem .2rem #550A6C);
        }
        img{
          .wh(100%, 100%);
          border-radius: 50%;
        }
      }
    }
  }
  .teacher-time{
    width: 90%;
    margin: -1.56rem auto 0;
    background-color: @col-white;
    border-radius:10px;
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);
    .info-box{
      position: relative;
      display: flex;
      height: 1.4rem;
      padding: .2rem .3rem 0 .3rem;
      justify-content: space-between;
      .big-avatar{
        position: absolute;
        top: -.3rem;
        .wh(1.56rem, 1.56rem);
        border: .05rem solid @col-white;
        border-radius: 50%;
        box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);
        img{
          .wh(100%, 100%);
          border-radius: 50%;
        }
      }
      .intro{
        margin-left: 1.8rem;
        .name{
          .wh(2.4rem, .5rem);
          line-height: .5rem;
          font-size: .36rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .tag{
          height: .37rem;
          line-height: .37rem;
          margin-top: .08rem;
          font-size: .26rem;
          color: @col-gray;
          span{
            padding-right: .2rem;
          }
        }
      }
      .follow-btn{
        button{
          width: 1.4rem;
          .l-h(.6rem);
          color: @col-purple;
          border: .02rem solid @col-purple!important;
          border-radius: .1rem;
          font-size: .3rem;
          font-weight: 400;
          background: @col-white!important;
          &.select{
            color: @col-white;
            background: @col-purple!important;
          }
        }
      }
    }
    .time-box{
      margin-top: .2rem;
      .week{
        display: flex;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        white-space: nowrap;
        overflow-x: auto;
        .week-item{
          flex-direction: row;
          margin: 0 .25rem;
          font-size: .3rem;
          font-weight:400;
        }
        .select{
          color: @col-purple;
          font-size: .36rem;
          position: relative;
          &::before{
            position: absolute;
            content: '';
            left: .3rem;
            border: .1rem solid @col-purple;
            border-top-color: @col-purple;
            border-bottom-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
          }
        }
      }
      .time{
        padding: 0 .3rem .2rem;
        .all-time{
          display: flex;
          flex-wrap: wrap;
          margin-right: -0.32rem;
          .time-item{
            display: inline-block;
            .wh(21%, .6rem);
            line-height: .6rem;
            background-color: #F5F6F7;
            margin: .15rem 1.5%;
            border-radius: .1rem;
            text-align: center;
            font-size: .3rem;
            font-weight: 400;
            color: @col-gray;
          }
        }
        .nocontent{
          text-align: center;
          font-size: .3rem;
          color: @col-gray;
          padding: .4rem 0 .7rem;
          font-weight:400;
          .tip{
            height: .44rem;
            line-height: .44rem;
          }
        }
      }
    }
  }
  .teacher-info{
    margin-top: .4rem;
  }
}
</style>
