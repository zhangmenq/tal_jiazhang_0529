export default {
  mounted() {
    if (this.$route.meta.showNav) {
      let routeName = this.$route.name;
      if (routeName === 'exp') {
        routeName = 'home';
      }
      this.$refs[routeName].style.paddingBottom = '1.2rem';
    }
  },
};
