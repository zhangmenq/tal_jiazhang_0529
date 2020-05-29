<template>
  <div>
    <ul v-if="!loadingData && lists.length > 0">
      <course-item
        v-for="(item, index) in lists"
        :key="index"
        :course="item">
      </course-item>
    </ul>
    <loading v-else-if="loadingData && lists.length === 0"></loading>
    <no-content v-else-if="lists.length === 0 && !loadingData"></no-content>
  </div>
</template>

<script>
import courseLists from '@/mixins/courseLists';
import Loading from '@/components/loading/Index';
import CourseItem from '@/components/home/CourseItem';


export default {
  name: 'exp',
  data() {
    return {
      type: 3,
    };
  },
  components: {
    Loading,
    CourseItem,
  },

  mixins: [courseLists],
};
</script>
