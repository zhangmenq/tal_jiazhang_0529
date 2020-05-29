<template>
  <div class="pay_success_content">
    <h4 class="check_info_title">报名核对单</h4>
    <div class="check_info_box" v-if="orderInfo">
      <div class="check_info_item"><span>课程名称：</span>{{orderInfo.title}}</div>
      <div class="check_info_item" v-for="(item, index) in orderInfo.content" :key="index">
        <span>{{item.type_cn}}：</span><em v-if="item.begin_times">{{item.begin_times.substring(0,10)}}</em> {{item.time_cn}}
      </div>
      <div class="check_info_item"><span>报名手机号：</span> {{mobile}}</div>
    </div>
    <div class="qrcode_box">
      <h4 v-if="orderInfo">已成功支付<span>{{showTotalFee}}</span>元！</h4>
      <div class="tips">
        <p>请立即添加课程助教， <br>获取上课通知及课程资料</p>
      </div>
      <img :src="qrcodeUrl" class="qrcode">
      <div class="qrcode_foot"><img src="../../../../static/imgs/shou.png">{{isWeixin?'长按识别，立即添加助教老师':'微信扫一扫，立即添加助教老师'}}</div>
    </div>
    <div v-if='isShowError'>
      <div class="pop-bg"></div>
      <div class="error-pop">
        <h4>温馨提示</h4>
        <p v-if="errorMsg != ''">{{errorMsg}}</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import axios from '@/utils/http';
import getOrigin from '@/utils/origin';
import { getItem } from '@/utils/localStorage.js';
export default {
  name: 'paySuccess',
  components: {

  },
  data() {
    return {
      order_id: 0,
      test: '12345678901',
      orderInfo: null,
      mobile: '',
      shortCourseName: '',
      qrcodeUrl: '',
      showTotalFee: 0,
      isShowError: false,
      errorMsg: '',
      isWeixin: true
    };
  },
  created(){
    let order_id = this.$route.query.order_id
    this.order_id = order_id
    const isWeixin = getOrigin().startsWith('wechat');
    this.isWeixin = isWeixin;
  },
  mounted(){
    this.getUserInfo()
    this.getOrderList()
  },
  methods: {
    //订单列表
    getOrderList(){
      const url = `${this.apiConfig.host}course/courses/0/orderlist?order_id=${this.order_id}`
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          this.orderInfo = res.data
          let imgNum = 0
          if(res.data.content_type == 6){  //KET
            this.shortCourseName = 'KET'
            imgNum = this.order_id % 6
          }else if(res.data.content_type == 7){  //PET
            this.shortCourseName = 'PET'
            imgNum = this.order_id % 6
          }else if(res.data.content_type == 1){  //reading
            this.shortCourseName = 'reading'
            imgNum = this.order_id % 4
          }
          this.qrcodeUrl = '../../../../static/imgs/' + this.shortCourseName + '/' + this.shortCourseName + '_' + imgNum + '.jpg'
          //处理金额
          if(res.data.pay_fee){
            this.showTotalFee = res.data.pay_fee / 100
          }
        }else{
          this.isShowError = true
          this.errorMsg = res.error_msg
        }
      })
    },
    //获取用户信息
    getUserInfo(){
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            this.mobile = res.data.mobile
          }
        });
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import '../../../styles/basic.less';
.pay_success_content{
  height: 100%;
  background: url(../../../../static/imgs/short-course-paySuccess.png) no-repeat 0 0;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: .7rem .3rem 0;
  .check_info_title{
    line-height: .5rem;
    font-size: .36rem;
    color: @col-white;
    text-align: center;
  }
  .check_info_box{
    margin-top: .3rem;
    padding: 0 .3rem;
    font-size: .26rem;
    color: @col-white;
    .check_info_item{

      &::after{
        content: "";
        display: block;
        clear: both;
        height: 0;
      }
    }
    span{
      display: block;
      float: left;
      width: 2.2rem;
      color: #B2B7CE;
    }
  }
  .qrcode_box{
    margin-top: .5rem;
    height: 7rem;
    background: @col-white;
    border-radius: .2rem;
    box-shadow:0px 14px 40px 0px rgba(125,26,159,1);
    text-align: center;
    color: #1B223F;
    h4{
      line-height: .5rem;
      font-size: .36rem;
      padding-top: .3rem;
      span{
        color: #FE763A;
      }
    }
    .tips{
      font-size: .3rem;
      line-height: .42rem;
      margin-top: .2rem;
    }
    .qrcode{
      display: block;
      width: 3.1rem;
      height: 3.1rem;
      margin: .5rem auto;
      position: relative;
      z-index: 99999;
    }
    .qrcode_foot{
      font-size: .3rem;
      color: #9A57C8;
      line-height: .42rem;
      img{
        width: .31rem;
        height: .38rem;
        vertical-align: top;
        margin-right: .1rem;
      }
    }
  }
}
.pop-bg{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.6);
}
.error-pop{
  position: absolute;
  left: 50%;
  top: 50%;
  background:#fff;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  transform: translate(-50%,-50%);
  width: 80%;
  height: 3.6rem;
  border-radius: 0.1rem;
  h4{
    padding: .4rem 0;
    text-align: center;
    line-height: 1.5;
    font-size: 0.4rem;
  }
  p{
    text-align: center;
    padding: .3rem 0 0;
    line-height: 2;
    font-size: .36rem;
    color: #999;
  }
}
</style>
