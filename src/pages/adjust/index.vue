<template>
  <div class="myorder">
    <div class="nav nav_fix">
      <div v-if="showTab">
        <tab
          custom-bar-width="0.9rem"
          bar-active-color="#7149D0"
          :line-width="14"
          v-model="tabIndex">
          <tab-item @click.native="go('adjustTeacher')">老师模式</tab-item>
          <tab-item @click.native="go('adjustTime')">时间模式</tab-item>
        </tab>
      </div>
      <div class="turns_num_tips">您还有{{change_num}}次调课机会</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Tab, TabItem, XButton } from 'vux';

export default {
  name: 'adjust',
  components: {
    Tab,
    TabItem,
    XButton,
  },
  data() {
    return {
      tabIndex: -1,
      scrollHeight: 0,
      showTab: true,
    };
  },
  computed: {
    teacherId() {
      return this.$route.query.teacher_id || 0;
    },
    courseId() {
      return this.$route.params.courseId || 0;
    },
    scheduleId() {
      return this.$route.params.scheduleId || 0;
    },
    date() {
      return this.$route.query.date || '';
    },
    change_num() {
      return this.$route.query.change_num || 0;
    },
  },
  methods: {
    go(routerName) {
      if (routerName === 'adjustTeacher') {
        this.tabIndex = 0;
        this.$router.replace({
          name: 'adjustTeacher',
          params: {
            courseId: this.courseId,
            scheduleId: this.scheduleId,
          },
          query: {
            teacher_id: this.teacherId,
            date: this.date,
            change_num: this.change_num,
          },
        });
      } else {
        this.tabIndex = 1;
        this.$router.replace({
          name: 'adjustTime',
          params: {
            ourseId: this.courseId,
            scheduleId: this.scheduleId,
          },
          query: {
            teacher_id: this.teacherId,
            date: this.date,
            change_num: this.change_num,
          },
        });
      }
    },
    handleScroll() {
      // 页面滚动距顶部距离
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const scroll = scrollTop - this.scrollHeight;
      this.scrollHeight = scrollTop;
      if (scrollTop > 180 && this.$route.name === 'adjustTime') {
        if (scroll < 0) {
          this.showTab = true;
        } else {
          this.showTab = false;
        }
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
    if (this.$route.name === 'adjustTeacher') {
      this.tabIndex = 0;
    } else if (this.$route.name === 'adjustTime') {
      this.tabIndex = 1;
    }
  },
  beforeRouteLeave(to, from, next) {
    const lists = ['adjustTime', 'adjustTeacher'];
    if (lists.indexOf(from.name) === -1 && lists.indexOf(to.name) === -1) {
      this.$router.push({
        name: 'home',
      });
    } else {
      next();
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style lang="less">
@import "../../styles/basic.less";

.myorder {
  min-height: 100%;
  padding-top: 1.7rem;
  .nav {
    .nav;
    &.nav_fix{
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 3;
    }
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
    &.tips_fix{
      position: fixed;
      width: 100%;
      left: 0;
      top: 1.1rem;
    }
  }
}
</style>
