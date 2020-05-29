<template>
  <div id="app">
    <div>
      <loading v-model="isLoading"></loading>
    </div>
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive && !isLoading"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive && !isLoading"></router-view>
    </transition>
    <nav-tab v-show="showNav"></nav-tab>
  </div>
</template>

<script>
import { Loading } from 'vux';
import { mapState } from 'vuex';
import NavTab from './components/footer/NavTab';

export default {
  name: 'app',
  components: {
    Loading,
    NavTab,
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading,
    }),
    showNav() {
      return this.$route.meta.showNav;
    },
  },
};
</script>

<style lang="less">
@import './utils/picker/picker.css';
@import './styles/basic.less';

.reset;
#app{
  height:100%;
  font-smoothing: antialiased;
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity .45s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}

.router-slid-enter-active, .router-slid-leave-active {
  transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>
