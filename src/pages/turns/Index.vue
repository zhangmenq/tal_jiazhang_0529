<template>
  <div class="myorder">
    <div class="nav nav_fix">
      <div v-if="showTab">
        <tab
          custom-bar-width="0.9rem"
          bar-active-color="#7149D0"
          :line-width="14"
          v-model="index">
          <tab-item @click.native="go('turnsTime')">时间模式</tab-item>
          <tab-item @click.native="go('turnsTeacher')">老师模式</tab-item>
        </tab>
      </div>
      <div class="turns_num_tips">您还有{{turns}}次转班机会</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Tab, TabItem, XButton } from 'vux';

export default {
  name: 'turns',
  components: {
    Tab,
    TabItem,
    XButton,
  },
  data() {
    return {
      index: -1,
      showTab: true,
    };
  },
  computed: {
    turns() {
      return Number(this.$route.query.turns) || 0;
    },
  },
  methods: {
    go(routerName) {
      this.$router.replace({
        name: routerName,
        query: {
          turns: this.turns,
        },
      });
    },
    handleScroll() {
      // 页面滚动距顶部距离
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const scroll = scrollTop - this.scrollHeight;
      this.scrollHeight = scrollTop;
      if (scrollTop > 180 && this.$route.name === 'turnsTime') {
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
    if (this.$route.name === 'turnsTime') {
      this.index = 0;
    } else if (this.$route.name === 'turnsTeacher') {
      this.index = 1;
    }
  },
  beforeRouteLeave(to, from, next) {
    const lists = ['turnsTime', 'turnsTeacher'];
    if (lists.indexOf(from.name) === -1 && lists.indexOf(to.name) === -1) {
      this.$router.push({
        name: 'learning',
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
  }
}
</style>
