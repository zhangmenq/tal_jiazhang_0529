<template>
  <div>
    <scroll-data
      v-if="!loadingData"
      :lists="lists"
      :busy="busy"
      :distance="120"
      :total="total"
      :currentPage="currentPage"
      tips="暂无优惠券"
      listType="coupon"
      couponType="0"
      @loadMore="loadMore">
    </scroll-data>
    <loading v-else></loading>
  </div>
</template>
<script>
import couponLists from '@/mixins/couponLists';
import Loading from '@/components/loading/Index';

export default {
  name: 'disable',
  components: {
    Loading,
  },
  mixins: [couponLists],
  data() {
    return {
      status: 0,
    };
  },
};
</script>
<style lang="less">
</style>
