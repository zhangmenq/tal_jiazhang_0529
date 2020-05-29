<template>
  <div>
    <div class="header" :class="{'fixed': fixed}">
      <span class="span" @click='changeReport'>{{ type === 1 ? '个人报告' : '综合报告' }}</span>
      <span class="span switch" @click='changeReport'>
        切换{{ type === 1 ? '综合报告' : '个人报告' }}
        <div class="right-arrow">
        </div>
      </span>
    </div>
    <iframe id="report-iframe" :src="iframeSrc" name="reportIframe" class="iframe" :style="{height: height}" frameborder="0">
    </iframe>
    <div v-if="isLoading" :style="{height: height}">
      <div class="loading"></div>
    </div>
  </div>
</template>

<script>
import { Loading } from 'vux';
import wechatMenu from '@/mixins/wechatMenu.js';

export default {
  name: 'stageTest',
  components: {
    Loading,
  },
  mixins: [wechatMenu],
  data() {
    return {
      type: 1,
      height: '10rem',
      fixed: false,
      isLoading: true,
    };
  },
  computed: {
    iframeSrc() {
      const host = process.env.NODE_ENV === 'deployment'
        ? 'https://www.vipx.com'
        : 'http://test-www.vipx.com';
      if (this.type === 2) {
        // 综合报告
        return `${host}/stage-tests/composite/${this.stuId}/new?terminal=${this.terminal}&course_id=${this.courserId}&activity=${this.activity}`;
      }
      // 个人报告
      return `${host}/stage-tests/private/${this.stuId}/new?terminal=${this.terminal}&course_id=${this.courserId}&activity=${this.activity}`;
    },
    stuId() {
      return this.$route.query.student_id;
    },
    privateTest() {
      return Number(this.$route.query.private);
    },
    composite() {
      return Number(this.$route.query.composite);
    },
    courserId() {
      return Number(this.$route.query.course_id);
    },
    terminal() {
      return Number(this.$route.query.terminal);
    },
    activity() {
      return Number(this.$route.query.activity);
    },
  },
  methods: {
    changeReport() {
      this.isLoading = true;
      if (this.type === 1) {
        this.type = 2;
      } else {
        this.type = 1;
      }
      this.detectIframeOnload();
    },
    detectIframeOnload() {
      document.getElementById('report-iframe').onload = () => {
        this.isLoading = false;
        window.scrollTo(0, 0);
      };
    },
    handleFixed() {
      const scrollTop = document.documentElement.scrollTop || window.pageYOffset
        || document.body.scrollTop;
      if (scrollTop) {
        this.fixed = true;
      } else {
        this.fixed = false;
      }
    },
  },
  mounted() {
    const dpr = window.devicePixelRatio || 1;
    const scale = 1 / dpr;
    const metaEl = document.querySelector('meta[name="viewport"]');
    metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=1,minimum-scale=1`);
    this.height = `${window.reportIframe.document.body.scrollHeight}px`;
    this.detectIframeOnload();
    window.addEventListener('scroll', this.handleFixed, false);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleFixed, false);
  },
};
</script>

<style lang="less">
  @media (-webkit-device-pixel-ratio: 3) {
    .loading {
      width: 15px;
      height: 15px;
      position: fixed;
      top: 50%;
      left: 50%;
      border: 1px solid #9a57a8;
      border-left: 0;
      border-radius: 15px;
      animation: loaDing 1s linear infinite;
    }
  }
  @media (-webkit-device-pixel-ratio: 2) {
    .loading {
      width: 30px;
      height: 30px;
      position: fixed;
      top: 50%;
      left: 50%;
      border: 2px solid #9a57a8;
      border-left: 0;
      border-radius: 30px;
      animation: loaDing 1s linear infinite;
    }
  }
  @media (-webkit-device-pixel-ratio: 1) {
    .loading {
      width: 45px;
      height: 45px;
      position: fixed;
      top: 50%;
      left: 50%;
      border: 3px solid #9a57a8;
      border-left: 0;
      border-radius: 45px;
      animation: loaDing 1s linear infinite;
    }
  }
  @keyframes loaDing {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media (max-width: 767PX) {
      padding: .1rem .2rem;
    }
    // @media (-webkit-device-pixel-ratio: 2) {
    //   height: 45px;
    //   padding: 9.5px 16px;
    // }
    // @media (-webkit-device-pixel-ratio: 3) {
    //   height: 30px;
    //   padding: 6.5px 10px;
    // }

    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 5 0 rgba(0, 0, 0, 0.15);
    &.fixed {
      position: fixed;
      left: 0;
      top: 0;
    }
    .span {
      display: block;
      @media (max-width: 767PX) {
        font-size: .14rem;
      }
    }
    .switch {
      display: flex;
      justify-content: space-between;
      color: #9a57c8;

      @media (max-width: 767PX) {
        .right-arrow {
          padding: .06rem;
          background: url("../../../assets/arrow-right.png") no-repeat;
          background-size: .12rem .1rem;
          background-position: center;
        }
      }
      // @media (-webkit-device-pixel-ratio: 2) {
      //   .right-arrow {
      //     padding: 9px;
      //     background: url("../../../assets/arrow-right.png") no-repeat;
      //     background-size: 12px 10px;
      //     background-position: center;
      //   }
      // }

      // @media (-webkit-device-pixel-ratio: 3) {
      //   .right-arrow {
      //     padding: 6px;
      //     background: url("../../../assets/arrow-right.png") no-repeat;
      //     background-size: 8px 7px;
      //     background-position: center;
      //   }
      // }
    }
  }
  @media (-webkit-device-pixel-ratio: 3) {
    .weui-toast {
      width: 60px;
      min-height: 60px !important;
    }
  }
  @media (-webkit-device-pixel-ratio: 2) {
    .weui-toast {
      width: 120px;
      min-height: 120px !important;
    }
  }
  @media (-webkit-device-pixel-ratio: 1) {
    .weui-toast {
      width: 180px;
      min-height: 180px !important;
    }
  }

  .iframe {
    width: 100%;
    height: 10rem;
  }
</style>