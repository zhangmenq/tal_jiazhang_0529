<template>
  <div class="my-courses">
    <sticky>
      <div class="nav">
        <tab
          :line-width='9'
          v-model="tabIndex"
          bar-active-color="#7149D0"
          custom-bar-width='.9rem'
          active-color='#35255E'>
          <tab-item @click.native="changeType('learning')">上课中</tab-item>
          <tab-item @click.native="changeType('notyet')">未开课</tab-item>
          <tab-item @click.native="changeType('finished')">已结课</tab-item>
        </tab>
      </div>
    </sticky>
    <router-view></router-view>
  </div>
</template>
<script>
import { Sticky, Tab, TabItem, XButton } from 'vux';

export default {
  components: {
    Tab,
    TabItem,
    Sticky,
    XButton,
  },
  data() {
    return {
      tabIndex: -1,
    };
  },
  methods: {
    changeType(routerName) {
      this.$router.replace({
        name: routerName,
      });
    },
  },
  mounted() {
    switch (this.$route.name) {
      case 'notyet':
        this.tabIndex = 1;
        break;
      case 'finished':
        this.tabIndex = 2;
        break;
      default:
        this.tabIndex = 0;
        break;
    }
  },
  beforeRouteLeave(to, from, next) {
    const lists = ['learning', 'notyet', 'finished'];
    if (lists.indexOf(to.name) === -1 && to.name === 'successOrder') {
      this.$router.push({
        name: 'mine',
      });
    } else {
      next();
    }
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';
.my-courses{
  background: @col-bg;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding-bottom: 1.1rem;
  .nav{
    .nav;
    margin-bottom: .4rem;
    .vux-tab-wrap {
      height: 1.13rem;
    }
    .vux-tab-container {
      height: 1.13rem;
    }
    .vux-tab {
      height: 1.13rem;
    }
    .vux-tab .vux-tab-item{
      line-height: 1.13rem;
      height: 1.13rem;
      font-size: .28rem;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
      font-size: .36rem;
      font-weight: 500;
      height: 1.13rem;
    }
  }
  .vux-tab-bar-inner {
    border-radius: 7px;
  }
}
</style>
