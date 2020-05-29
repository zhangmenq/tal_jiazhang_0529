<template>
  <div class="success_con">
    <div class="success_item">
      <h4 class="success_item_title">
        <span>第1步</span>预约成功
      </h4>
      <ul class="course_ul">
        <li><span>课程名称：</span>美国小学体验课G2-D</li>
        <li><span>上课时间：</span>09月04日 星期六 19:00-19:25</li>
        <li><span>授课老师：</span>Angeline <a href="" class="avatar_box"><img src="../../../assets/default-photo-teacher.png">summer</a></li>
      </ul>
    </div>

    <div class="success_item">
      <h4 class="success_item_title">
        <span>第2步</span>联系课程顾问一对一咨询
      </h4>
      <div class="teachaer_box">
        <div class="teachaer_box_pic"><img src="../../../assets/default-photo-teacher.png"></div>
        <div class="teachaer_box_info">
          <p><span>课程顾问：</span>VIPX张老师</p>
          <p class="sp"><span>微信号：</span>VIPX19231<a href="">复制微信号</a></p>
        </div>
      </div>
    </div>
    <div class="success_item">
      <h4 class="success_item_title">
        <span>第3步</span>下载上课软件
      </h4>
      <div class="dowload_info">
        <dl>
          <dt><span></span>iPad上课</dt>
          <dd>打卡iPad上的App Store，搜索VIPX并下载</dd>
        </dl>
        <dl>
          <dt><span></span>电脑上课</dt>
          <dd>访问VIPX官网 www.vipx.com 下载</dd>
          <dd class="sp">请用预约手机号186****登录哦</dd>
        </dl>
      </div>
    </div>
    <div class="success_item">
      <div class="qrcode_con">
        <h4>- 关注学而思VIPX服务号，了解更多内容 -</h4>
        <div class="qrcode_main">
          <div class="qrcode_main_img"><img src="../../../assets/import/qrcode.png"></div>
          <div class="qrcode_main_info">
            <p>服务号：<span>XRS-VIPX</span></p>
            <a href="javascript:;">复制微信号</a>
          </div>
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
@import '../../../styles/basic.less';
body{
  background: #fff;
}
.success_con{
  padding: 0 .4rem .3rem;
  .success_item{
    background: #fff;
    box-shadow:.02rem .03rem .06rem .03rem rgba(241,240,242,0.5);
    border-radius: .1rem;
    margin-top: .3rem;
    .success_item_title{
      line-height: .36rem;
      padding: .2rem 0 .2rem 1.2rem;
      position: relative;
      font-size: .34rem;
      color: @new-col-black;
      span{
        display: block;
        width: 1rem;
        position: absolute;
        left: 0;
        top: .2rem;
        border-top-right-radius: .18rem;
        border-bottom-right-radius: .18rem;
        text-align: center;
        font-size: .22rem;
        color: #fff;
        background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
      }
    }
    .course_ul{
      line-height: .6rem;
      padding: 0 .2rem .12rem;
      li{
        font-size: .28rem;
        color: @new-col-black;
        span{
          color: @new-col-font-gray
        }
        .avatar_box{
          color: @new-col-purple;
          margin-left: .3rem;
          img{
            vertical-align: middle;
            margin-right: .1rem;
            width: .6rem;
            height: .6rem;
            border-radius: 100%;
          }
        }
      }
    }
    .teachaer_box{
      padding: .3rem .2rem;
      display: flex;
      position: relative;
      .teachaer_box_pic{
        img{
          display: block;
          width: .86rem;
          height: .86rem;
          border-radius: 100%;
        }
      }
      .teachaer_box_info{
        flex: 1;
        padding-left: .3rem;
        p{
          line-height: .4rem;
          font-size: .28rem;
          span{
            color: @new-col-font-gray;
          }
          &.sp{
            padding: .06rem 1.6rem 0 0;
            position: relative;
            a{
              display: block;
              width: 1.5rem;
              background: @new-col-purple;
              height: .44rem;
              line-height: .44rem;
              text-align: center;
              font-size: .22rem;
              color: #fff;
              border-radius: .22rem;
              position: absolute;
              top: .02rem;
              right: 0;
            }
          }
        }
      }
    }
    .dowload_info{
      padding: .3rem .2rem;
      dl{
        &:first-child{
          margin-bottom: .25rem;
        }
        dt{
          line-height: .42rem;
          padding-left: .14rem;
          position: relative;
          font-size: .3rem;
          color: @new-col-title-dark;
          padding-bottom: .17rem;
          span{
            display: block;
            height: .27rem;
            width: .06rem;
            border-radius: .03rem;
            background: @new-col-purple;
            position: absolute;
            left: 0;
            top: .07rem;
          }
        }
        dd{
          line-height: .37rem;
          font-size: .26rem;
          color: @new-col-font-gray;
          &.sp{
            color: #F8792B;
            margin-top: .08rem;
          }
        }
      }
    }
    .qrcode_con{
      padding: .37rem .3rem .12rem;
      h4{
        line-height: .4rem;
        font-size: .28rem;
        color: @new-col-purple;
        text-align: center;
      }
      .qrcode_main{
        display: flex;
        margin-top: .13rem;
        .qrcode_main_img{
          img{
            display: block;
            width: 2.58rem;
            height: 2.58rem;
          }
        }
        .qrcode_main_info{
          flex: 1;
          text-align: center;
          p{
            padding-top: .77rem;
            font-size: .28rem;
            span{
              color: @new-col-purple;
            }
          }
          a{
            display: block;
            width: 1.6rem;
            line-height: .54rem;
            background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
            box-shadow:.02rem .03rem .04rem .01rem rgba(232,225,213,1);
            border-radius:.27rem;
            margin: .3rem auto 0;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>