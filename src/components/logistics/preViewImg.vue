<template>
  <!-- 过渡动画 -->
  <transition name="fade">
    <div class="img-view" @click="bigImg">
      <div class="img">
        <img :src="imgSrc">
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: ['imgSrc'],
  methods: {
    bigImg() {
      // 发送事件
      this.$emit('clickit');
    },
  },
  mounted() { },
};
</script>
<style scoped lang="less">
  /*动画*/
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s linear;
    transform: translate3D(0, 0, 0);
  }

  .fade-enter,
  .fade-leave-active {
    transform: translate3D(0, 0, 0);
  }

  /* bigimg */

  .img-view {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 12;
    background: rgba(0, 0, 0, 0.2);
    .img {
      position: absolute;
      z-index: 999;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translate(0,-50%);
      img {
        height: auto;
        display: block;
        width: 100%;
        z-index: 1000;
        cursor: pointer;
      }
    }
  }
</style>