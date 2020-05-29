<template>
  <div class="bad-network">
    <div class="icon"></div>
    <em>网络竟然崩溃了，刷新试试看</em>
    <x-button class="refresh">刷新</x-button>
  </div>
</template>
<script>
import { XButton } from 'vux';

export default{
  components: {
    XButton,
  },
};

</script>
<style lang="less">
@import '../../../styles/basic.less';

.bad-network{
  padding-top: 1.12rem;
  text-align: center;
  .icon {
    display: inline-block;
    .wh(3.74rem, 3.48rem);
    .bg-m('@{img-path}/bad-network.png');
    background-size: 100% 100%;
  }
  em {
    margin: .4rem auto .6rem;
    display: block;
    font-size: .36rem;
    color: @col-gray;
  }
  .refresh {
    border-radius: .1rem;
    .wh(2.4rem, .8rem);
    font-size: .36rem;
    color: @col-white;
    background: @col-purple;  
  }
}
</style>
