<template>
  <div>
    <scroll-data v-if="!loadingData"
      :lists="lists"
      :busy="busy"
      :distance="100"
      :total="total"
      :currentPage="currentPage"
      :showBuy="showBuy"
      tips="没有进行中的课程哦～"
      listType="section"
      @loadMore="loadMore">
    </scroll-data>
    <loading v-else></loading>
  </div>
</template>
<script>
import sectionLists from '@/mixins/sectionLists';
import Loading from '@/components/loading/Index';

export default {
  name: 'Learning',
  components: {
    Loading,
  },
  mixins: [sectionLists],
  data() {
    return {
      status: 1,
    };
  },
};
</script>
<style lang="less">
</style>
