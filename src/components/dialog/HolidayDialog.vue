<template>
  <div>
    <a class="btn-holiday" v-if="!isHolidayDialog" @click="isHolidayDialog = true"></a>
    <div class="holiday-dialog" v-if="isHolidayDialog">
      <div class="layer" @click="isHolidayDialog = false"></div>
      <div class="dialog">
        <h2>VIPX春节放假通知</h2>
        <div class="dialog-body">
          <a class="btn-close" @click="onClose"></a>
          <p class="exp">
            亲爱的学员家长您好！<br>
            新春佳节将至，春节<span>（2月4日--2月10日）</span>期间，VIPX寒假课放假一周。
          </p>
          <p>
            家长不需要手动操作调课，课程已自动顺延。
          </p>
          <p>
            预祝大家<span>新春快乐，阖家欢乐</span>。
          </p>
          <p class="tips">
            春节呼叫中心值班时间：2月9日--2月10日，早8:00—晚21:00
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/localStorage';

export default {
  data() {
    return {
      isHolidayDialog: true,
    };
  },
  methods: {
    onClose() {
      if (!getItem('isfirst')) {
        setItem('isfirst', 1);
      }
      this.isHolidayDialog = false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (getItem('isfirst') === 1) {
        this.isHolidayDialog = false;
      }
    });
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.btn-holiday{
  position: fixed;
  right: .21rem;
  bottom: 1.19rem;
  z-index: 500;
  .wh(1.02rem,1.82rem);
  .bg-m('@{img-path}holiday-btn-bg.png');
  background-size: 1.02rem 1.82rem;
}
.holiday-dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 500;
  .layer{
    position: fixed;
    left: 0;
    top: 0;
    .wh(100%,100%);
    background-color: rgba(0, 0, 0, .6);
  }
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-55%);
    padding: 2.4rem .8rem 0 1.16rem;
    .wh(6.26rem,8.48rem);
    font-size: .24rem;
    .bg-m('@{img-path}dialog-holiday-bg.png');
    background-size: 6.26rem 8.48rem;
    h2 {
      font-size: .3rem;
      font-weight: bold;
      text-align: center;
      color: #FAE16B;
    }
    p{
      margin-bottom: .25rem;
      line-height: .36rem;
      color: #FBEBAB;
      span {
        font-size: .3rem;
      }
      &.exp {
        margin-top: .4rem;
      }
    }
    .tips {
      margin-top: .9rem;
      font-size: .3rem;
      color: #EFC8C9;
    }
  }
  .btn-close {
    .pos-box-lc(.48rem,.48rem);
    bottom: -.96rem;
    .bg-m('@{img-path}dialog-close-big.png');
    background-size: 100% 100%;
  }
}
</style>

