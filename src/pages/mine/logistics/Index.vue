<template>
  <div class="logistics">
    <div class="nav">
      <tab custom-bar-width="0.6rem" bar-active-color="#9A57C8" :line-width="6" v-model="tabIndex">
        <tab-item @click.native="changeType('notShipped')">待发货</tab-item>
        <tab-item @click.native="changeType('shipped')">已发货</tab-item>
        <tab-item @click.native="changeType('signed')">已签收</tab-item>
      </tab>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { Tab, TabItem } from 'vux';
import { setApilog } from '@/api';

export default {
  components: {
    Tab,
    TabItem,
  },
  data() {
    return {
      tabIndex: -1,
      couponInfo: {},
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
      case 'shipped':
        this.tabIndex = 1;
        break;
      case 'signed':
        this.tabIndex = 2;
        break;
      default:
        this.tabIndex = 0;
        break;
    }
    setApilog({
      event_type: 70009,
      route: '/mine/logistics',
    });
  },
  beforeRouteLeave(to, from, next) {
    const lists = ['notShipped', 'shipped', 'signed'];
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
  @import "../../../styles/basic.less";
  .logistics {
    padding-bottom: 1.8rem;
    min-height: 100%;
    background: @col-bg;
    .nav {
      .nav;
      .vux-tab{
        .vux-tab-item{
          color:@col-gray;
        }
      }
    }
  }
</style>
