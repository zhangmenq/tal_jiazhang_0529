<template>
  <div class="myorder">
    <div class="nav">
      <tab
        custom-bar-width="0.9rem"
        bar-active-color="#7149D0"
        :line-width="14"
        v-model="index">
        <tab-item @click.native="go('time')">时间模式</tab-item>
        <tab-item v-if="!isShortCourse" @click.native="go('selTeacher')">老师模式</tab-item>
      </tab>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Tab, TabItem, XButton } from 'vux';
import { getCourseInfo, getPackageInfo } from '@/api/index';

export default {
  name: 'choose',
  components: {
    Tab,
    TabItem,
    XButton,
  },
  data() {
    return {
      index: -1,
      courseInfo: {},
    };
  },
  computed: {
    courseId() {
      return Number(this.$route.query.course_id) || 0;
    },
    packageId() {
      return this.$route.query.package_id;
    },
    type() {
      return this.$route.query.course_id ? 'course' : 'package';
    },
    isShortCourse() { // 是否是短期班
      return this.courseInfo.type === 1 && this.courseInfo.class_type === 1;
    },
  },
  methods: {
    go(routerName) {
      this.$router.replace({
        name: routerName,
        query: {
          course_id: this.courseId,
        },
      });
    },
    getInfo() {
      if (this.type === 'course') {
        return getCourseInfo(this.courseId).then(() => {
          this.courseInfo = this.$store.state.courseInfo;
        });
      }
      return getPackageInfo(this.packageId).then(() => {
        this.courseInfo = this.$store.state.packageInfo;
      });
    },
  },
  mounted() {
    if (this.$route.name === 'time') {
      this.index = 0;
    } else if (this.$route.name === 'selTeacher') {
      this.index = 1;
    }
    this.getInfo();
  },
};
</script>
<style lang="less">
@import "../../styles/basic.less";

.myorder {
  min-height: 100%;
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
  .turns_num_tips{
    line-height: .6rem;
    font-size: .24rem;
    text-align: center;
    background: @new-col-light-orange-tag;
    color: @new-col-light-orange;
  }
}
</style>
