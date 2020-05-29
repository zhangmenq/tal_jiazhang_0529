<template>
  <div class="about">
    <know-vipx :active="index"></know-vipx>
  </div>
</template>

<script>
import knowVipx from '@/components/know-vipx/KnowIndex';

export default {
  name: 'aboutUs',
  components: {
    knowVipx,
  },
  data() {
    return {

    };
  },
  computed: {
    index() {
      return Number(this.$route.query.index) || 0;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';


</style>
