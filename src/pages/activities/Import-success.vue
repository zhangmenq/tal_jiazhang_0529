<template>
  <div class="import_success">
    <div class="import_success_title">
      <img src="../../assets/import/success_ico.png">
      <h4>{{orderInfo.data.order_id==0?"预约成功。":"预约成功！"}}</h4>
      <p>快联系VIPX的学习规划师吧～</p>
    </div>

    <div class="import_success_teacher">
      <div class="teacher_box">
        <img src="../../assets/import/teacher_nv.png">
        <!-- <img src="../../assets/import/why_img3.png" v-if="orderInfo.data.sex=='1'">
        <img src="../../assets/import/teacher_nv.png" v-if="orderInfo.data.sex=='2'"> -->
      </div>
      <div class="teacher_name">
        <p>学习规划师：<span>{{orderInfo.data.nickname}}</span></p>
        <p><em>微信号：</em><span>{{orderInfo.data.wechat}}</span><a href="javascript:;" class="copyTeacher" :data-clipboard-text="orderInfo.data.wechat" @click="copyTeacher">复制微信号</a></p>
      </div>
    </div>

    <div class="import_success_vipx">
      <h4>- 关注学而思VIPX服务号，了解更多内容 -</h4>
      <div class="qrcode_box">
        <img src="../../assets/import/qrcode.png">
        <div class="qrcode_wx_count">
          <p>服务号：<span>XRS-VIPX</span></p>
          <a href="javascript:;" class="copy_btn" data-clipboard-text="XRS-VIPX" @click="copyVipx">复制微信号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { isEmpty } from 'lodash';
import { setItem, getItem, getCookie, setCookie } from '@/utils/localStorage';
import Clipboard from 'clipboard';

export default {
  props: {
    orderInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    copyTeacher() {
      var clipboard = new Clipboard('.copyTeacher');
      clipboard.on('success', e=> {
        this.$vux.toast.show({
          type: 'text',
          text: '复制成功！',
          position: 'middle',
          time: 3000,
          width: '10em',
        });
        clipboard.destroy();
      })
      clipboard.on('error', e => {
        this.$vux.toast.show({
          type: 'text',
          text: '浏览器不支持复制',
          position: 'middle',
          time: 3000,
          width: '12em',
        });
        clipboard.destroy();
      })
    },
    copyVipx() {
      var clipboard = new Clipboard('.copy_btn');
      clipboard.on('success', e=> {
        this.$vux.toast.show({
          type: 'text',
          text: '复制成功！',
          position: 'middle',
          time: 3000,
          width: '10em',
        });
        clipboard.destroy();
      })
      clipboard.on('error', e => {
        this.$vux.toast.show({
          type: 'text',
          text: '浏览器不支持复制',
          position: 'middle',
          time: 3000,
          width: '12em',
        });
        clipboard.destroy();
      })
    },
  },
  mounted() {
    
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
body{
  background: #fff;
}
.import_success{
  padding: .86rem .4rem .4rem;
  .import_success_title{
    text-align: center;
    img{
      display: block;
      width: 1.3rem;
      height: 1.3rem;
      margin: 0 auto;
    }
    h4{
      font-size: .36rem;
      color: #F8792B;
      line-height: .5rem;
      margin-top: .2rem;
    }
    p{
      font-size: .28rem;
      color: #93909A;
      line-height: .4rem;
      margin-top: .05rem;
    }
  }
  .import_success_teacher{
    display: flex;
    padding: .28rem .1rem .28rem .4rem;
    background: #fff;
    box-shadow:0px 4px 20px 0px rgba(163,163,163,0.15);
    border-radius: .1rem;
    margin-top: .64rem;
    .teahcer_box{
      width: 1.33rem;
      height: 1.33rem;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .teacher_name{
      padding: .22rem 0 0 .18rem;
      p{
        font-size: .26rem;
        line-height: .4rem;
        em{
          display: inline-block;
        }
        span{
          display: inline-block;
          max-width: 1.6rem;
          word-break: break-all;
          color: #F8792B;
          vertical-align: top;
        }
        a{
          display: inline-block;
          width: 1.58rem;
          height: .4rem;
          background:linear-gradient(144deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
          color: #fff;
          border-radius: .2rem;
          margin-left: .2rem;
          text-align: center;
          font-size: .24rem;
        }
      }
    }
  }
  .import_success_vipx{
    padding: .24rem .4rem;
    background: #fff;
    box-shadow:0px 4px 20px 0px rgba(163,163,163,0.15);
    border-radius: .1rem;
    margin-top: .7rem;
    h4{
      line-height: .4rem;
      font-size: .28rem;
      color: #F8792B;
      text-align: center;
      font-weight: bold;
    }
    .qrcode_box{
      height: 2.58rem;
      position: relative;
      margin-top: .13rem;
      img{
        display: block;
        width: 2.58rem;
        height: 2.58rem;
      }
      .qrcode_wx_count{
        position: absolute;
        left: 2.58rem;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        p{
          font-size: .28rem;
          line-height: .4rem;
          text-align: center;
          span{
            color: #F8792B;
          }
        }
        .copy_btn{
          display: block;
          width:1.58rem;
          height:.53rem;
          background:linear-gradient(144deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
          box-shadow:.02rem .03rem .04rem .01rem rgba(232,225,213,1);
          border-radius:.27rem;
          font-size: .26rem;
          color: #fff;
          text-align: center;
          line-height: .53rem;
          margin: .4rem auto 0;
        }
      }
    }
  }
}
@media (min-width: 751PX){
  .import_success{
    .import_success_teacher{
      .teacher_name{
        padding: .05rem 0 0 .18rem;
      }
    }
  }
}
</style>