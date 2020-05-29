<template>
  <li class="course-item">
    <div class="item-top">
      <div class="content" @click="selectSection()">
        <div class="title">
          {{course.course.title}}
        </div>
        <p class="timeperiod">
          {{course.start_date || course.classroom.start_date}} - {{course.end_date || course.classroom.end_date}}
        </p>
        <p>
          共{{(course.course.relation ? (course.course.lessons * 2) : course.course.lessons) || course.classroom.lessons}}节
        </p>
      </div>
      <div class="btn-fn">
        <x-button class="btn-report"
          v-if="course.read_report_status===1"
          @click.native="gotoReport">阅读结业证书
        </x-button>
        <x-button
          :class="{'btn-plain': course.turns!==0, 'btn-plained': course.turns==0}"
          @click.native="showTurns(course)"
          v-if="course.can_change">
          转班
        </x-button>
        <div v-if="course.can_change" class="btn-count">剩余<span>{{course.turns}}</span>次</div>
      </div>
    </div>
    <ul class="course-type" @click="selectSection()">
      <li v-if="course.course.content_type === 1" class="type-one">
        <p class="title">{{course.course.content_type_name}}{{course.course.lessons}}节</p>
      </li>
      <li v-if="course.course.relation && course.course.relation.content_type === 2" class="type-two">
        <p class="title">{{course.course.relation.content_type_name}}{{course.course.lessons}}节</p>
      </li>
    </ul>
  </li>
</template>
<script>
import { XButton } from 'vux';
import { formatDate } from '@/filters';

export default {
  props: {
    course: {
      type: Object,
      default: {},
    },
    courseType: {
      type: String,
      default: 'coursePage',
    },
  },
  data() {
    return {
      plainCount: 1,
    };
  },
  components: {
    XButton,
  },
  filters: { formatDate },
  methods: {
    selectSection() {
      switch (this.courseType) {
        case 'changeClass':
          this.$router.push({
            name: 'changeDetails',
            params: {
              change_id: this.course.id,
            },
          });
          break;
        default:
          this.$router.push({
            name: 'scheduleList',
            params: {
              classroomId: this.course.id,
            },
          });
          break;
      }
    },
    //跳转阅读报告
    gotoReport() {
      const idData = btoa(this.course.student_id);
      this.$router.push({
        path: `/activity/reading-report/${idData}?courseId=${this.course.course_id}`,
      });
    },
    showTurns(classrooms) {
      const url = `${this.apiConfig.host}/classroom/classrooms/${classrooms.id}/turn-num`;
      this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          return;
        }
        const turnsParams = res.data.info[0];
        if (turnsParams.turns === 0) {
          return;
        }
        this.$router.push({
          name: 'turnsTime',
          params: {
            courseId: classrooms.course_id,
            classroomId: classrooms.id,
          },
          query: {
            turns: turnsParams.turns,
          },
        });
        // this.$emit('showTurns', {
        //   turns: classrooms.turns,
        //   courseDate: classrooms.course.start_at,
        //   teacherId: classrooms.teacher_id,
        //   courseId: classrooms.course_id,
        //   classroomId: classrooms.id,
        //   courseType: classrooms.course.type,
        //   isPackage: classrooms.package_id > 0,
        //   turnInfo: res.data,
        // });
      });
    },
    teacherDetail() {
      this.$router.push({
        name: 'teacher',
        params: {
          id: this.course.teacher_id,
        },
      });
    },
  },
  mounted() {
    console.log(this.$route.name);
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.course-item{
  padding: .33rem .3rem .4rem .39rem;
  position: relative;
  background: @new-col-white;
  margin: .2rem .4rem;
  border-radius: .08rem;
  overflow: hidden;
  box-shadow:0px 4px 20px 0px rgba(0,0,0,0.1);
  .item-top{
    position: relative;
    .btn-fn{
      position: absolute;
      right: 0;
      text-align: center;
      top: 50%;
      margin-top: -.26rem;
        .btn-count {
          margin-top: .2rem;
          height: .33rem;
          line-height: .33rem;
          color: @new-col-title-dark;
          span{
            color: @new-col-orange;
          }
        }
      .btn-plain {
        background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
        border-radius: 30px;
        color: @new-col-white;
        line-height: .4rem;
        font-size: .28rem;
        font-weight: bold;
        border: none;
      }
      .btn-plained {
        background: @new-col-bg-gray;
        border-radius: 30px;
        color: @new-col-gray;
        line-height: .4rem;
        font-size: .28rem;
        font-weight: bold;
      }
    }
  }
  .weui-btn{
    display: inline-block;
    .weui-btn(1.44rem);
    .l-h(.6rem);
    &.btn-report{
      background-color: #9A57C8;
      border-color: #9A57C8;
      color: #fff;
      width: 2.2rem;
    }
  }
  .content{
    margin: 0 2.9rem 0.33rem 0;
    font-size:.24rem;
    color: @new-col-font-gray;
    .title{
      margin-bottom: .06rem;
      line-height: .4rem;
      font-size: .28rem;
      color: @new-col-title-dark;
      .ellipsis-m(2);
      vertical-align: middle;
      font-weight: bold;
    }
  }
  .course-type{
    li{
      display: inline-block;
      padding: .13rem .15rem;
      border-radius: 8px;
      margin-right: 0.22rem;
        .title{
        font-size: .24rem;
        font-weight: 500;
        height: .33rem;
        line-height: .33rem;
      }
    }
    .type-one {
      color: @new-col-purple;
      background: @new-col-bg-purple
    }
    .type-two {
      color: @new-col-orange;
      background: @new-col-bg-orange;
    }
  }
}
</style>
