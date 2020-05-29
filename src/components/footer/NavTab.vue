<template>
  <div class="footer-nav">
    <section v-for="(item, index) in navs"
      :key="index"
      class="nav-item"
      @click="go(item.name)">
      <i class="nav-icon" :class="[item.name === currentRoute ? item.actIcon : item.icon, item.icon]">
        <!-- <icon
        :name="item.name === currentRoute ? item.actIcon : item.icon"
        :scale="4"
        :class="{'active': item.name === currentRoute}">
        </icon> -->
      </i>
      <span :class="{'active': item.name === currentRoute}">{{item.zhCN}}</span>
    </section>
  </div>
</template>

<script>
export default {
  name: 'footerNav',
  data() {
    return {
      navs: [
        {
          name: 'home',
          icon: 'ifont-home',
          actIcon: 'active',
          zhCN: '首页',
          to: '/home',
        },
        {
          name: 'schedule',
          icon: 'ifont-schedule',
          actIcon: 'active',
          zhCN: '课表',
          to: '/schedule',
        },
        {
          name: 'mine',
          icon: 'ifont-mine',
          actIcon: 'active',
          zhCN: '我的',
          to: '/mine',
        },
      ],
    };
  },
  computed: {
    currentRoute() {
      if (this.$route.name === 'exp') {
        return 'home';
      }
      return this.$route.path.split('/')[1];
    },
  },
  methods: {
    go(routeName) {
      if (routeName === this.currentRoute) {
        return;
      }

      this.$router.push({
        name: routeName,
      });
    },
  },
};
</script>
<style lang="less" scoped>
  @import '../../styles/basic.less';

  .footer-nav {
    z-index: 501;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    .wh(100%,1rem);
    color: #6d758a;
    background: #fff;
    .box-shadow(0 -.06rem .24rem rgba(0,0,0,.06));
  }
  .nav-item {
    font-size: .2rem;
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .nav-icon{
      display: block;
      .wh(.4rem,.4rem);
      line-height: .4rem;
      text-align: center;
      font-size: .36rem;
      color: @col-gray;
      &.active{
        color: @col-light-purple;
      }
    }
  }
  .nav-item:active {
    animation: rubberBand .4s ease-in;
  }
  .active {
    color: @col-purple;
  }
  @keyframes rubberBand{
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
    30% {
      -webkit-transform: scale3d(1.25, 0.75, 1);
      transform: scale3d(1.25, 0.75, 1);
    }
    40% {
      -webkit-transform: scale3d(0.75, 1.25, 1);
      transform: scale3d(0.75, 1.25, 1);
    }
    50% {
      -webkit-transform: scale3d(1.15, 0.85, 1);
      transform: scale3d(1.15, 0.85, 1);
    }
    65% {
      -webkit-transform: scale3d(.95, 1.05, 1);
      transform: scale3d(.95, 1.05, 1);
    }
    75% {
      -webkit-transform: scale3d(1.05, .95, 1);
      transform: scale3d(1.05, .95, 1);
    }
    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }
</style>
