<template>
  <div v-if="showToast" class="stage-box">
    <div class="common-dialog" @click="cancel"></div>
    <div class="stage-dialog">
      <a href="javascript:;" class="close_pop" @click="cancel"></a>
      <div class="stage-content">
        <h4>入学测试提醒</h4>
        <div class="text">课程每个级别的难度不同，为了更好的学习效果，请您务必让孩子在开课前24小时完成"入学测试"。</div>
      </div>
      <div class="start-btn">
        <x-button @click.native="doShowToast" class="btn-purple">开始测试</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';

export default {
  name: 'StageTest',
  components: {
    XButton,
  },
  props: {
    showToast: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    doShowToast() {
      this.$emit('startTest');
    },
    cancel() {
      this.$emit('closeDialog', false);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
  @import "../../styles/basic.less";
  .stage-box {
    .common-dialog {
      background: rgba(51, 51, 51, 0.6);
      opacity: 1;
    }
    .stage-dialog {
      width: 5.5rem;
      height: 5.83rem;
      background: url(/static/imgs/test_bg.png) no-repeat;
      background-size: 100% 100%;
      border-radius: 8px;
      padding-bottom: 8px;
      position: fixed;
      z-index: 10000;
      left: 50%;
      top: 2.48rem;
      transform: translate(-50%, 0);
      .stage-content {
        padding: 2.34rem 0.38rem 0 0.28rem;
        h4 {
          font-size: 0.36rem;
          color: rgba(154, 87, 200, 1);
          line-height: 0.3rem;
          font-weight: 500;
          text-align: center;
        }
        .text {
          padding-top: 0.3rem;
          font-size: 0.3rem;
          font-weight: 500;
          color: rgba(54, 54, 54, 1);
          line-height: 0.36rem;
        }
      }
      .start-btn {
        width: 100%;
        text-align: center;
        .weui-btn {
          margin: 0 auto;
          margin-top: 0.56rem;
          .weui-btn(@width: 3.5rem, @fontsize: 0.3rem);
        }
      }
      .close_pop {
        display: block;
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        top: 0.88rem;
        right: 0.2rem;
        line-height: 0.5rem;
        color: #1c223d;
        text-align: center;
        font-size: 0.4rem;
        background: url(/static/imgs/short_course_close.png) no-repeat center;
      }
    }
  }
</style>