<template>
  <div class="course-lists">
    <div class="item-box-fluid">
      <div class="comm-tit">课程清单</div>
      <p class="title">{{ info.title }}</p>
      <div class="details-box">
        <p class="time">{{ info.start_at | formatDate('YYYY.MM.DD') }} - {{info.end_at | formatDate('YYYY.MM.DD')}}</p>
        <span class="price" v-if="!isShortCourse">
          <em class="current" v-if="totalFee">¥{{ totalFee | formatMoney }}</em>
        </span>
      </div>
    </div>
    <!-- 课程清单-组合课 -->
    <div class="item-box" v-if="type == 2 && courses.length > 0" v-for="(course, key) in courses" :key="course.id">
      <p class="title">{{course.title}}</p>
      <div class="details-box">
        <p class="time">
          {{course.start_at | formatDate('YYYY.MM.DD')}} - {{course.end_at | formatDate('YYYY.MM.DD')}}
        </p>
        <span class="price">
          <em class="current">¥{{course.total_fee | formatMoney}}</em>
        </span>
      </div>
      <div class="intro-box" v-for="content in course.content" :key="content.id">
        <p class="title">{{ content.type_cn || content.type }}</p>
        <p><span class="name">共计课节：</span>{{content.lessons}}节</p>
        <p v-if="course.course_type != 3 && course.course_type != 5 && content.type != 2">
          <span class="name">上课时间：</span>
          {{content.time_cn}}
        </p>
        <p v-if="course.course_type != 3 && course.course_type != 5 && content.type != 2">
          <span class="name">授课老师：</span>
          <span class="teacher-info">
            {{teacherInfo.realname}}
            <span class="avatar" @click="goTeacher(teacherInfo.id)">
              <img src="../../assets/default-photo-teacher.png" v-if="!teacherInfo.avatar_url"/>
              <img :src="teacherInfo.avatar_url" v-else>
            </span>
            <a class="other-teacher" v-if="key === 0 && isReorder > 0" @click="goOtherTeacher(teacherInfo.id)">查看其他老师>></a>
          </span>
        </p>
      </div>
    </div>
    <!-- 课程清单 主辅课 -->
    <div class="item-box item-exc" v-if="type == 1">
      <div class="intro-box" v-if="info.content.length" v-for="(course, key) in info.content" :key="course.id">
        <p class="title">{{course.type_cn}}</p>
        <p><span class="name">共计课节：</span>{{course.lessons}}节</p>
        <!-- <p v-if="course.type != 2 && info.course_type != 3 && info.course_type != 5"> -->
        <p class="short-course" v-if="isShortCourse && course.begin_times && course.time_cn">
          <span class="name">上课时间：</span>
          {{course.begin_times.substr(0, 10)}} {{course.time_cn.replace('每', '')}}
          <em v-if="key === 1">推荐</em>
        </p>
        <p v-else-if="course.type == 2 && (info.course_type == 3 || info.course_type == 5)">
          <span class="name">上课时间：</span>
          {{ course.time_cn.replace('每', '')}}
        </p>
        <p v-else-if="course.type !== 2">
          <span class="name">上课时间：</span>
          {{course.time_cn}}
        </p>
        <p v-if="course.type != 2 && info.course_type != 3 && info.course_type != 5 && !isShortCourse">
          <span class="name">开始时间：</span>
          {{course.begin_times}}
        </p>
        <p v-if="course.type != 2 && info.course_type != 3 && info.course_type != 5 && !isShortCourse">
          <span class="name">授课老师：</span>
          <span class="teacher-info">
            {{teacherInfo.realname}}
            <span class="avatar" @click="goTeacher(teacherInfo.id)">
              <img src="../../assets/default-photo-teacher.png" v-if="!teacherInfo.avatar_url"/>
              <img :src="teacherInfo.avatar_url" v-else>
            </span>
            <a class="other-teacher" v-if="key === 0 && isReorder > 0" @click="goOtherTeacher(teacherInfo.id)">查看其他老师>></a>
          </span>
        </p>
      </div>
    </div>
    <!-- <div class="item-box" v-if="bookInfo && bookInfo.title && showBook">
      <p class="title">{{bookInfo.title}}</p>
      <div class="details-box">
        <span class="price">
          <em class="original" v-if="bookInfo.book_discount !== 0">¥{{bookInfo.total_fee | formatMoney}}</em>
          <em class="current">¥{{(bookInfo.total_fee - bookInfo.book_discount) | formatMoney}}</em>
        </span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import { sessionGet } from '@/utils/localStorage';
import { getCourseLists, getTeacherInfo, setPointLog } from '@/api';
import { formatMoney, formatDate } from '@/filters';

export default {
  name: 'buyBook',
  data() {
    return {
      type: 1,
      teacherInfo: {},
      courses: [],
      info: {
        content: [],
        course: [],
      },
      bookInfo: {},
      showBook: 1,
    };
  },
  computed: {
    totalFee() {
      /* if (!isEmpty(this.bookInfo) && this.showBook) {
        return this.info.total_fee +
        (this.bookInfo.total_fee - this.bookInfo.book_discount);
      } */
      return this.info.total_fee;
    },
    date() {
      return this.$route.query.date || '';
    },
    isReorder() {
      return this.$route.query.is_reorder || 0;
    },
    isShortCourse() { // 是否是短期班
      return this.info.course_type === 1 && this.info.class_type === 1;
    },
    dataSource() {
      return sessionGet('dataSource') ? Number(sessionGet('dataSource')) : 0;
    },
  },

  methods: {
    goOtherTeacher(teacherId) {
      this.$router.push({
        name: 'otherTeacher',
        query: {
          course_id: this.info.course_id,
          package_id: this.info.package_id,
          teacher_id: teacherId,
        },
      });
      setPointLog(123, '/course/list', this.dataSource);
    },
    goTeacher(teacherId) {
      this.$router.push({
        name: 'teacher',
        params: {
          id: teacherId,
        },
      });
    },
  },

  filters: { formatMoney, formatDate },
  async mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    this.showBook = this.$route.query.show_book > 0;
    const teacherId = this.$route.query.teacher_id;
    const data = {};
    if (!this.$route.query.order_id) {
      data.id = this.$route.query.id;
      data.type = this.$route.query.type;
      data.week = this.$route.query.week;
      data.time = this.$route.query.time;
      data.teacher_id = this.$route.query.teacher_id;
    } else {
      data.order_id = this.$route.query.order_id;
      data.id = -1;
    }
    if (this.date) {
      data.date = this.date;
    }
    await getCourseLists(data).then((res) => {
      if (res.error_code > 0) {
        this.info = {};
        return;
      }
      this.info = res.data;
      if (!isEmpty(res.data.course)) {
        this.type = 2;
        this.courses = res.data.course;
      }
      if (!isEmpty(res.data.book)) {
        this.bookInfo = res.data.book;
      }
    });

    await getTeacherInfo(teacherId).then(() => {
      this.teacherInfo = this.$store.state.teacherInfo;
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
};
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .course-lists{
    padding-bottom: .3rem;
    background: @col-bg;
    min-height: 100%;
    color: @col-darkgray;
    .item-box-fluid{
      .item-box-fluid;
      margin-bottom: 0;
    }
    .item-box{
      .item-box;
      margin: .2rem .3rem 0;
    }
    .comm-tit{
      .comm-tit(.36rem,@col-darkgray);
      & + .title{
        margin-top: .2rem;
      }
    }
    .title{
      line-height: .44rem;
      font-size: .3rem;
    }
    .details-box{
      position: relative;
      min-height: .36rem;
      p{
        margin-top: .16rem;
        line-height: .36rem;
      }
      .time{
        &:before{
          content: '';
          display: inline-block;
          vertical-align: top;
          margin: .05rem .04rem 0 0;
          .wh(.4rem,.27rem);
          .bg-m('@{img-path}/course-details-icon.png');
          background-size: .4rem 4.5rem;
        }
      }
      .price{
        position: absolute;
        right: 0;
        bottom: 0;
        line-height: .36rem;
        font-size: .3rem;
        .original{
          font-size: .26rem;
          text-decoration:line-through;
          color: @col-gray;
        }
        .current{
          padding-left: .16rem;
          color: @col-orange;
        }
      }
    }
    .intro-box{
      margin-top: .2rem;
      padding-top: .2rem;
      border-top: .01rem solid @col-border;
      p{
        display: flex;
        line-height: .44rem;
        .name{
          display: inline-block;
          .wh(1.26rem, .4rem);
          color: @col-gray;
        }
        .teacher-info{
          display: inline-block;
          width: 5rem;
        }
      }
      .title{
        font-size: .26rem;
        & ~ .title{
          margin-top: .1rem;
        }
      }
      .avatar{
        margin-left: .2rem;
        margin-right: .2rem;
        display: inline-block;
        vertical-align: middle;
        .wh(.4rem,.4rem);
        border-radius: 100%;
        overflow: hidden;
        img{
          .wh-img();
        }
      }
      .other-teacher{
        font-size: .26rem;
        color: @col-purple;
      }
    }
    .item-exc{
      .intro-box:first-of-type{
        margin-top: 0;
        padding-top: 0;
        border-top: none;
      }
      .short-course{
        em{
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
</style>
