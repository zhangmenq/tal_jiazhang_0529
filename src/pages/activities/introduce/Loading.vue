<template>
  <div class="loading">
    <div class="loading-bg" v-if="loadingType"></div>
    <section class="vertical-center"
      :class="{'circle-white': loadingType, 'circle-purple': !loadingType}">
      <div class="sk-three-bounce">
        <div class="sk-bounce-1 sk-child"></div>
        <div class="sk-bounce-2 sk-child"></div>
        <div class="sk-bounce-3 sk-child"></div>
      </div>
      {{loadingText}}
    </section>
  </div>
</template>
<script>
  export default {
    props: {
      loadingType: {
        type: Boolean,
        default: false,
      },
      loadingText: {
        type: String,
        default: '正在制作中',
      },
    },
  };
</script>
<style lang="less">
@import '../../../styles/basic.less';

.loading{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  .wh(100%, 100%);
  .loading-bg{
    position: fixed;
    top: 0;
    left: 0;
    .wh(100%, 100%);
    background: #000;
    opacity: .6;
  }
  .vertical-center{
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -1rem 0 0 -1rem;
    text-align: center;
    .wh(2rem, 2rem);
    font-size: .36rem;
    &.circle-white{
      color: @col-white;
      .sk-three-bounce .sk-child{
         background-color: @col-purple;
      }
    }
    &.circle-purple{
      color: #1B223F;
      .sk-three-bounce .sk-child{
         background-color: @col-purple;
      }
    }
  }
  .sk-three-bounce .sk-child {
    display: inline-block;
    margin: 0 .05rem .3rem;
    border-radius: 100%;
    width: .2rem;
    height: .2rem;
    animation: sk-three-bounce 1.4s ease-in-out 0s infinite both;
  }
  .sk-three-bounce .sk-bounce-1 {
    animation-delay: -0.32s;
  }
  .sk-three-bounce .sk-bounce-2 {
    animation-delay: -0.16s;
  }
  @keyframes sk-three-bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1.1);
    }
  }
}
</style>
