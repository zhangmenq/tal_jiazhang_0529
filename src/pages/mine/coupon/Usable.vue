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
      couponType="1"
      @loadMore="loadMore">
    </scroll-data>
    <loading v-else></loading>
  </div>
</template>
<script>
import couponLists from '@/mixins/couponLists';
import Loading from '@/components/loading/Index';

export default {
  name: 'usable',
  components: {
    Loading,
  },
  mixins: [couponLists],
  data() {
    return {
      status: 1,
    };
  },
  methods: {

  },
};
</script>
<style lang="less">
</style>
