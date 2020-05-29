<template>
  <div class="nocontent">
      <div class="inner nofiltrateteacher">
        <span class="nocontent-img"></span>
        <p class="tips">{{tips}}</p>
      </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    tips: {
      type: String,
      default: '暂无数据',
    },
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
  @import '../../styles/basic.less';
  .nocontent {
      margin: 1.8rem;
    }
</style>