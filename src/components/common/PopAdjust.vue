<template>
  <div class="pop-adjust">
    <div class="fn-adjust">
      <span>还有<i>{{adjustNum}}</i>次<font>{{type == 1 ? '调课' : '转班'}}</font>机会</span>
      <x-button class="btn-adjust" @click.native="goTime()">
        {{type == 1 ? '原老师调课' : '转班'}}
      </x-button>
    </div>
    <p class="tips" v-if="type == 1">注：调课课次仅变动上课时间或老师，该课次学习内容不变</p>
  </div>
</template>
<script>
  import { XButton } from 'vux';

  export default {
    components: {
      XButton,
    },
    props: {
      adjustNum: {
        type: Number,
        default: 0,
      },
      type: {
        type: Number,
        default: 1,
        required: true,
      },
    },
    methods: {
      goTime() {
        this.$emit('goTime');
      },
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';
  .pop-adjust{
    padding: .3rem;
    .fn-adjust{
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      i{
        color: @col-lightred;
      }
      span{
        padding: 0 .3rem;
        font-weight: bold;
        font-size: .3rem;
        color: #02004e;
      }
    }
    .btn-adjust{
      margin: 0;
      .wh(1.8rem,.7rem);
      border-radius: .08rem;
      font-size: .26rem;
      .btn-purple;
    }
    .tips{
      margin-top: .3rem;
      text-align: center;
      font-size: .2rem;
      color: @col-darkgray;
    }
  }
</style>


