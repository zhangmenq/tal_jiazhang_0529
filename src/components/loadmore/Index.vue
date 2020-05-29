<template>
  <div class="pulldow-loading">
    <span :class="{'loading': showLoading}" v-if="showLoading"></span>
    {{ showLoading ? '加载中...' : '没有更多内容了' }}
  </div>
</template>

<script>
export default {
  props: {
    showLoading: {
      type: Boolean,
      default: false,
    },
    noContent: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
