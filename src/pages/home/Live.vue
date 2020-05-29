<template>
  <scroll-data v-if="lists.length > 0"
      :lists="lists"
      :busy="busy"
      :distance="100"
      :total="total"
      :currentPage="currentPage"
      @loadMore="loadMore">
  </scroll-data>
</template>

<script>
import courseLists from '@/mixins/courseLists';

export default {
  name: 'live',
  data() {
    return {
      type: 3,
    };
  },
  mixins: [courseLists],
};
</script>
