<template>
  <scroll-data v-if="!loadingData"
      :lists="lists"
      :busy="busy"
      :distance="100"
      :total="total"
      :currentPage="currentPage"
      listType="order"
      tips="暂无订单"
      @loadMore="loadMore">
  </scroll-data>
  <loading v-else></loading>
</template>

<script>
import orderLists from '@/mixins/orderLists';
import Loading from '@/components/loading/Index';

export default {
  name: 'cancleOrder',
  mixins: [orderLists],
  data() {
    return {
      status: -1,
    };
  },
  components: {
    Loading,
  },
};
</script>
