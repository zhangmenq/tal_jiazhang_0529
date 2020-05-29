<template>
  <div id="__nc" >
    <div id="nc"></div>
  </div>
</template>

<script>
/* global NoCaptcha */
export default {
  props: {
    captchaReload: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      appKey: 'LEWA',
      scene: 'login_h5',
      NC: null,
    };
  },
  watch: {
    captchaReload() {
      this.NC.reset();
    },
  },
  methods: {
    init() {
      const token = [this.appKey, (new Date()).getTime(), Math.random()].join(':');
      this.NC = NoCaptcha.init({
        renderTo: '#nc',
        appkey: this.appKey,
        scene: this.scene,
        token: token,
        bannerHidden: false,
        callback: (data) => {
          //将这三个参数在这里回调服务器的接口，进行服务器的验证
          const params = {
            csessionid: data.csessionid,
            nc_token: token,
            sig: data.sig,
          };
          this.$emit('setCaptcha', params);
        },
        error: (error) => {
          console.log(error);
        },
      });
      NoCaptcha.setEnabled(true);
      this.NC.reset(); // 请务必确保这里调用一次reset()方法
      NoCaptcha.upLang('cn', {
        LOADING: '验证中...', // 加载
        SLIDER_LABEL: '请向右滑动验证', // 等待滑动
        CHECK_Y: '验证通过', // 通过
        ERROR_TITLE: '非常抱歉，这出错了...', // 拦截
        CHECK_N: '验证未通过', // 准备唤醒二次验证
        OVERLAY_INFORM: '经检测你当前操作环境存在风险，请输入验证码', // 二次验证
        TIPS_TITLE: '验证码错误，请重新输入', // 验证码输错时的提示
      });
    },
  },
  mounted() {
    if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.scene = 'login';
    }
    this.init();
  },
};
</script>
<style lang="less">
/* 滑动条高度、边框、背景色等 */
#__nc{
  margin:.3rem auto 0;
  width:100%;
  height:.9rem;
}
#nc{
  height:.9rem;
}
._nc{
  .stage1{
    height:.9rem;
    .slider{
      height:.9rem;
      border-radius:.45rem;
      background-color:#ddd;
      .label{
        height:.9rem;
        font-size:.3rem;
        color:#999999;
        line-height:.9rem;
      }
    }
    .track{
      div{
        height:.9rem;
        border-radius:.45rem;
        color:#fff;
        font-size:.3rem;
        line-height:.9rem;
      }
    }
    .bg-green {
      background-color:#78c430;
    }
    .bg-red {
      background-color:#ff5500;
    }
    .button{
      height:.9rem;
      width:.9rem;
      border-radius:50%;
    }
    .icon-ok,.icon-close,.icon-slide-arrow{
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
  }
  .stage3{
    height:.9rem;
    line-height:.9rem;
    .menu.feedback{
      display: none;
    }
    .menu.nc-sep{
      display: none;
    }
    .menu.refresh{
      width:1rem;
      top: 0;
      right:.3rem;
      .label{
        top:-4px;
      }
    }
  }
  .icon-slide-arrow{
    font-size:.5rem;
    color:#999999;
  }
  .icon-ok,.icon-close{
    font-size:.5rem;
  }
  .icon{
    width:.5rem;
    height:.5rem;
  }
}
/* 各个状态的icon */
/* 等待滑动："icon iconfont icon-slide-arrow"
验证出错："icon no iconfont icon-close"
验证通过："icon yes iconfont icon-ok" */
</style>
