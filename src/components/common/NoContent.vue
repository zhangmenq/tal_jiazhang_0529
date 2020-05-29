<template>
  <div class="nocontent" :class="{'nocontent-center': vertical, 'nocontent-center-course': !vertical}">
    <div class="inner" :class="defaultImg">
      <span class="nocontent-img"></span>
      <p class="tips" :class="{'fixed-width': fixedwidth}" v-html="tips"></p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tips: {
      type: String,
      default: '暂无课程，敬请期待~',
    },
    vertical: {
      type: Boolean,
      default: true,
    },
    fixedwidth: {
      type: Boolean,
      default: false,
    },
    defaultImg: {
      type: String,
      default: 'no-default',
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/basic.less';
</style>
