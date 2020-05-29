<template>
<div class="bg">
  <!--banner-->
  <div class="banner">
    <img src="../../../../static/imgs/short/ket_pet_banner.png" class="banner_img">
    <div class="banner_btn_box" :class="btnClass?'bg':''" id="banner_btn_box">
      <div class="banner_btn_con">
        <a href="javascript:;" class="banner_btn left_btn" @click="changecourse(1)" :class="{'cur': type==1}">
          KET<i></i>
        </a>
        <a href="javascript:;" class="banner_btn right_btn" @click="changecourse(2)" :class="{'cur': type==2}">
          PET<i></i>
        </a>
      </div>
    </div>
    <img src="../../../../static/imgs/short_arr.png" class="short_arr">

  </div>
  <!--立即购买按钮-->
  <div class="buy_btn_box">
    <p>价值<span>199</span>元<br>{{type == 1 ? "KET": "PET"}}口语突破班</p>
    <a href="javascript:;" class="buy_btn" @click="buyNow">
      <div class="pulldow-loading"><span v-if="showLoading" class="loading"></span>立即报名</div>
    </a>
  </div>
  <!--课程介绍-->
  <div class="course_content">
    <!--ket简介-->
    <div class="course_kind" v-show="type==1">
      <div class="course_description">
        <div class="course_title">
          <i></i><span>KET口语突破班</span><i class="arr_right"></i>
        </div>
        <div class="course_intro">
          课程介绍
        </div>
        <img src="../../../../static/imgs/short_ket_item1_pic.png" class="kind_item_pic">
        <div class="intro_box">
          <h2>本课程针对5月份的KET口语考试 </h2>
          <p class="color_purple">1节40min真实考场分析TV课</p>
          <p>授课教师：16-18年MSE口语考官Joyce</p>
          <p class="color_purple">1节40min 1对1外教真题讲练课</p>
          <p>授课教师：VIPX北美外教团队</p>
        </div>
      </div>
      <div class="basic_box">
        <div class="basic_title">
          适合人群
        </div>
        <img src="../../../../static/imgs/short_ket_item2_pic.png" class="kind_item_pic">
        <p class="center">小学1-6年级<br>备考2019年KET考试的学生</p>
      </div>
      <div class="basic_box">
        <div class="basic_title">
          课程大纲
        </div>
        <img src="../../../../static/imgs/short_ket_item3_pic.png" class="kind_item_pic">
        <table class="table" cellspacing="0" cellpadding="0">
          <tr>
            <td class="tc">第一节<br>考官TV课<br>(40分钟)</td>
            <td>
              <p><i></i>考试全真模拟视频</p>
              <p><i></i>考官全程讲解</p>
              <p><i></i>考试流程解析</p>
              <p><i></i>考试高分技巧</p>
            </td>
          </tr>
          <tr>
            <td class="tc">第二节<br>外教1V1<br>(40分钟)</td>
            <td>
              <p><i></i>真题重现</p>
              <p><i></i>步骤拆解练习</p>
              <p><i></i>Thinking Map - 脑图</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="basic_box">
        <div class="basic_title">
          报名起止时间
        </div>
        <img src="../../../../static/imgs/short_ket_item4_pic.png" class="kind_item_pic">
        <p class="center">2019-04-26 至 2019-05-02</p>
      </div>
      <div class="basic_box">
        <div class="basic_title">
          上课方式
        </div>
        <img src="../../../../static/imgs/short_ket_item6_pic.png" class="kind_item_pic">
        <p class="bottom_distance">1、TV课无需选择上课时间，可回看，建议提前学习</p>
        <p class="bottom_distance">2、1对1外教课请在报名时选择好上课时间，并按时上课</p>
        <p class="color_purple">温馨提示：先看TV课，再上1对1外教课，效果更佳</p>
      </div>
      <div class="basic_box">
        <div class="basic_title">
          上课时间
        </div>
        <img src="../../../../static/imgs/short_ket_item4_pic.png" class="kind_item_pic">
        <p class="center">一期 04-29 周一 至 05-05 周日</p>
        <p class="center">二期 05-06 周一 至 05-12 周日</p>
        <p class="center">三期 05-13 周一 至 05-19 周日</p>
        <p class="center bold">1对1外教课可选时段</p>
        <p class="center">周二~周五 晚17：10-晚21：20</p>
        <p class="min_size bottom_distance">（40min/节，具体时段详见报名页面）</p>
        <p class="center">周六~周日 早8：00-晚21：20</p>
        <p class="min_size">（40min/节，具体时段详见报名页面）</p>
      </div>
      <div class="basic_box">
        <div class="basic_title">
          常见问题
        </div>
        <img src="../../../../static/imgs/short_ket_item7_pic.png" class="kind_item_pic">
        <div class="text_box">
          <p class="bottom_distance"><strong>Q:课程可以退费吗？</strong></p>
          <p><span>课前随时支持退费</span>，可自行在我的订单中申请退费。</p>
          <p><span>课后不可退费</span>，如遇时间问题请联系助教老师。</p>
        </div>
        <div class="text_box">
          <p class="bottom_distance"><strong>Q:发现时间不合适，可以转班吗？</strong></p>
          <p><span>同期内上课前可自行转班。跨期不可自主转班。</span></p>
          <p>如有需要，请提前联系助教进行转班操作。</p>
        </div>
        <div class="text_box">
          <p class="bottom_distance"><strong>Q:上课需要下载app吗？</strong></p>
          <p>需要。报名成功之后<span>请及时扫码添加助教老师微信</span>，助教老师将告知您app下载方式。</p>
        </div>
      </div>
    </div>
    <!--pet简介-->
    <div class="course_kind" v-show="type==2">
      <div class="course_description">
        <div class="course_title">
          <i></i><span>PET口语突破班</span><i class="arr_right"></i>
        </div>
        <div class="course_intro pet_bg">
          课程介绍
        </div>
        <img src="../../../../static/imgs/short_ket_item1_pic.png" class="kind_item_pic">
        <div class="intro_box">
          <h2>本课程针对5月份的PET口语考试 </h2>
          <p class="color_purple">1节40min真实考场分析TV课</p>
          <p>授课教师：16-18年MSE口语考官Joyce</p>
          <p class="color_purple">1节40min 1对1外教真题讲练课</p>
          <p>授课教师：VIPX北美外教团队</p>
        </div>
      </div>
      <div class="basic_box">
        <div class="basic_title pet_bg">
          适合人群
        </div>
        <img src="../../../../static/imgs/short_ket_item2_pic.png" class="kind_item_pic">
        <p class="center">小学1-6年级<br>备考2019年PET考试的学生</p>
      </div>
      <div class="basic_box">
        <div class="basic_title pet_bg">
          课程大纲
        </div>
        <img src="../../../../static/imgs/short_ket_item3_pic.png" class="kind_item_pic">
        <table class="table" cellspacing="0" cellpadding="0">
          <tr>
            <td class="tc">第一节<br>考官TV课<br>(40分钟)</td>
            <td>
              <p><i></i>考试全真模拟视频</p>
              <p><i></i>考官全程讲解</p>
              <p><i></i>考试流程解析</p>
              <p><i></i>考试高分技巧</p>
            </td>
          </tr>
          <tr>
            <td class="tc">第二节<br>外教1V1<br>(40分钟)</td>
            <td>
              <p><i></i>真题重现</p>
              <p><i></i>步骤拆解练习</p>
              <p><i></i>Thinking Map - 脑图</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="basic_box">
        <div class="basic_title pet_bg">
          报名起止时间
        </div>
        <img src="../../../../static/imgs/short_ket_item4_pic.png" class="kind_item_pic">
        <p class="center">2019-04-26 至 2019-05-02</p>
      </div>
      <div class="basic_box">
        <div class="basic_title pet_bg">
          上课方式
        </div>
        <img src="../../../../static/imgs/short_ket_item6_pic.png" class="kind_item_pic">
        <p class="bottom_distance">1、TV课无需选择上课时间，可回看，建议提前学习</p>
        <p class="bottom_distance">2、1对1外教课请在报名时选择好上课时间，并按时上课</p>
        <p class="color_purple">温馨提示：先看TV课，再上1对1外教课，效果更佳</p>
      </div>
      <div class="basic_box">
        <div class="basic_title pet_bg">
          上课时间
        </div>
        <img src="../../../../static/imgs/short_ket_item4_pic.png" class="kind_item_pic">
        <p class="center">一期 04-29 周一 至 05-05 周日</p>
        <p class="center">二期 05-06 周一 至 05-12 周日</p>
        <p class="center">三期 05-13 周一 至 05-19 周日</p>
        <p class="center bold">1对1外教课可选时段</p>
        <p class="center">周二~周五 晚17：10-晚21：20</p>
        <p class="min_size bottom_distance">（40min/节，具体时段详见报名页面）</p>
        <p class="center">周六~周日 早08：00-晚21：20</p>
        <p class="min_size">（40min/节，具体时段详见报名页面）</p>
      </div>
      <div class="basic_box">
        <div class="basic_title pet_bg">
          常见问题
        </div>
        <img src="../../../../static/imgs/short_ket_item7_pic.png" class="kind_item_pic">
        <div class="text_box">
          <p class="bottom_distance"><strong>Q:课程可以退费吗？</strong></p>
          <p><span>课前随时支持退费</span>，可自行在我的订单中申请退费。</p>
          <p><span>课后不可退费</span>，如遇时间问题请联系助教老师。</p>
        </div>
        <div class="text_box">
          <p class="bottom_distance"><strong>Q:发现时间不合适，可以转班吗？</strong></p>
          <p><span>同期内上课前可自行转班。跨期不可自主转班。</span></p>
          <p>如有需要，请提前联系助教进行转班操作。</p>
        </div>
        <div class="text_box">
          <p class="bottom_distance"><strong>Q:上课需要下载app吗？</strong></p>
          <p>需要。报名成功之后<span>请及时扫码添加助教老师微信</span>，助教老师将告知您app下载方式。</p>
        </div>
      </div>
    </div>
  </div>
  <img src="../../../../static/imgs/short_course_bottom.png" class="course_bottom">

  <!--二维码-->
  <div v-if="qrcodeShow">
    <div class="pop-bg"></div>
    <div class="qrcode_con">
      <img src="../../../../static/imgs/short_course_qrcode.png" class="vipx_qrcode">
      <a href="javascript:;" class="close_pop" @click="closeQrcodePop"></a>
      <div class="qrcode_txt">
        <p>请长按识别二维码，</p>
        <p>关注微信公众账号“学而思VIPX”，</p>
        <p class="red">关注后既可购买。</p>
      </div>
    </div>
  </div>
  <!--登录-->
  <div v-if="loginShow">
    <div class="pop-bg"></div>
    <login-pop class="login-pop" @close="loginClose" :openid="openid"></login-pop>
  </div>
  <!--选择购买课程弹窗-->
  <div v-if="coursesShow">
    <div class="pop-bg"></div>
    <div class="courses_list">
      <a href="javascript:;" class="close_pop" @click="closeCoursesPop"></a>
      <h4>请选择购买的课程</h4>

      <div class="courses_item_box">
        <div class="courses_item" v-for="(course, index) in courses" :key="index" :class="selectCourseId == course.id ? 'cur': ''" @click="selectCourse(course.id)">
          <p class="name">{{course.title}}</p>
          <p class="time">上课时间：{{course.start_at}}-{{course.end_at}}</p>
        </div>
      </div>
      <a href="javascript:;" class="next_btn" :class="selectCourseId == 0?'unclick':''" @click="goNext">下一步</a>
    </div>
  </div>
</div>
</template>
<script>
/* eslint-disable */
import LoginPop from './Login';
import axios from '@/utils/http';
import getOrigin from '@/utils/origin';
import { getItem, setItem, removeItem, sessionSet, sessionGet} from '@/utils/localStorage.js';
import { setTimeout } from 'timers';
export default {
  name: 'shortCourse',
  components: {
    LoginPop,
  },
  data() {
    return {
      loginShow: false,
      qrcodeShow: false,
      coursesShow: false,
      isAttention: false,
      isLogin: false,
      courses: [],
      selectCourseId: 0,
      type: 1,
      shortType: 1,
      btnClass: false,
      orderStatus: 0,
      order_id: 0,
      showLoading: false,
      openid: '',
      channel: '',
      isWeixin: false
    };
  },
  created(){
    const isWeixin = getOrigin().startsWith('wechat');
    this.getChannel();
    const open_id = this.$route.query.openid;
    const indroduce = sessionGet('indroduce');
    if(isWeixin){
      if(indroduce){
        if(open_id){
          this.openid = open_id;
          this.isWechat(open_id);
        }
      }else{
        this.introduceOpenid();
      }
      this.isWeixin = isWeixin;
    }
  },
  mounted(){
    let that = this
    let elementT = document.getElementById('banner_btn_box').offsetTop;
    window.onscroll = function(){
      let scrollT = document.documentElement.scrollTop || document.body.scrollTop;
      if(scrollT >= elementT){
        that.btnClass = true
      }else{
        that.btnClass = false
      }
    }
    this.isLoginFunc();
    this.getMSEList();
  },
  methods: {
    getChannel() {
      const queryChannel = this.$route.query.channel;
      if (getItem('channel')) {
        removeItem('channel');
      }
      if (queryChannel) {
        setItem('channel', this.$route.query.channel);
        this.channel = queryChannel
      }
    },
    //微信静默登录获取oppenid
    introduceOpenid(){
      const url = `${this.apiConfig.host}wechat/introduce-openid?introduce_id=short_course|channel=${this.channel}`
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          sessionSet('indroduce', '1');
          location.href = res.data.url;
        }
      })
    },
    //切换ket,pet
    changecourse(type){
      if(this.type === type){
        return
      }
      this.type = type
      this.selectCourseId = 0
      if(this.isLogin){
        this.checkShort();
      }
      this.getMSEList();
    },
    //关闭登录
    loginClose() {
      this.loginShow = false;
      this.isLoginFunc()
    },
    //关闭二维码
    closeQrcodePop(){
      this.qrcodeShow  = false;
    },
    //关闭课程选择框
    closeCoursesPop(){
      this.coursesShow  = false;
    },
    //立即报名
    buyNow(){
      this.showLoading = true
      setTimeout(()=>{
        this.showLoading = false
        if(this.courses.length === 0){
          this.$vux.toast.show({
            type: 'text',
            text: '暂无售卖课程',
            position: 'middle',
            time: 1500,
            width: '10em',
          })
          return;
        }
        //第一步先检测是否关注服务号
        if(this.isWeixin && !this.isAttention){
          this.qrcodeShow = true
          return
        }
        //第二步再检测是否登录
        if(!this.isLogin){
          this.loginShow = true
          return
        }
        //第三步看是否已经购买，已购买直接跳核对
        if(this.orderStatus === 1){
          this.$router.push({path:'/pay/success/short',query:{order_id:this.order_id}})
          return
        }
        if(this.orderStatus === 0 && this.order_id !== 0){
          this.$router.push({path:'/pay/wait-pay',query:{order_id:this.order_id}})
          return
        }
        //第四步看有几节课
        if(this.courses.length === 1){
          this.$router.push({path:'/time',query:{course_id:this.selectCourseId}})
        }else{
          this.coursesShow = true
        }
      },1000)
    },
    //检测是否已经购买
    checkShort(){
      let content_type = 6
      if(this.type === 2){
        content_type = 7
      }
      const url = `${this.apiConfig.host}order/orders/check-short?type=${this.shortType}&content_type=${content_type}`;
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          this.orderStatus = res.data.order_status
          this.order_id = res.data.order_id
        }
      })
    },
    //检测是否关注公众号
    isWechat(open_id){
      setItem('openid', open_id)
      const url = `${this.apiConfig.host}user/users/is-wechat`
      let data = {
        'open_id': open_id
      }
      axios.post(url, {...data}).then(res => {
        if(res.error_code === 0){
          this.isAttention =  true
        }
      })
    },
    //判断是否登录
    isLoginFunc() {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((ret) => {
          if (ret.error_code === 0) {
            this.isLogin = true;
            this.checkShort();
          }
        });
      }
    },
    //获取MSE课程列表
    getMSEList(){
      const url = `${this.apiConfig.host}course/mse-list?type=${this.type}`;
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          this.courses = res.data
          if(res.data.length === 1){
            this.selectCourseId = res.data[0].id
          }
        }
      })
    },
    //选择课程
    selectCourse(course_id){
      if(this.selectCourseId === course_id){
        this.selectCourseId = 0
      }else{
        this.selectCourseId = course_id
      }
    },
    //选择课程后下一步
    goNext(){
      if(this.selectCourseId === 0){
        this.$vux.toast.show({
          type: 'text',
          text: '请先选择课程',
          position: 'middle',
          time: 3000,
          width: '10em',
        })
        return
      }
      this.$router.push({path:'/time',query:{course_id:this.selectCourseId}})
    }
  },
};
</script>


<style lang="less" scoped>
@import '../../../styles/basic.less';
.bg{
  background:linear-gradient(-89deg,rgba(146,27,206,1) 0%,rgba(153,0,153,1) 54%,rgba(146,27,206,1) 100%);
}
.course_content{
  margin: -.98rem .2rem 0;
  padding: 0 .44rem 3.5rem .36rem;
  // background: url(../../../../static/imgs/course_short_bg.png) repeat-y 0 0;
  // background-size: 100% auto;
  .course_kind{
    .course_description{
      width: 100%;
      background: @col-white;
      // height: 9.03rem;
      font-size: .34rem;
      color: #333;
      text-align: center;
      border-radius: .3rem;
      margin: 0 auto .89rem;
      padding: .9rem 0 .5rem;
      .course_title{
        max-width: 100%;
        height: auto;
        margin: 0 auto .25rem;
        text-align: center;
        font-size: .4rem;
        font-weight: 600;
        color: #8514C5;
        i{
          display: inline-block;
          .wh(.63rem, .05rem);
          margin-right: .24rem;
          background: url(../../../../static/imgs/short/arr_left.png) no-repeat;
          vertical-align: middle;
          &.arr_right{
            margin-left: .24rem;
            background: url(../../../../static/imgs/short/arr_right.png) no-repeat;
          }
        }
      }
      .course_intro{
        .wh(3.67rem, .88rem);
        margin: 0 auto .32rem;
        padding-top: .05rem;
        font-size: .4rem;
        font-weight: 600;
        color: @col-white;
        text-align: center;
        background: url(../../../../static/imgs/short/KET_title_bg.png) no-repeat;
        background-size: 100% 100%;
        &.pet_bg{
          background: url(../../../../static/imgs/short/PET_title_bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .kind_item_pic{
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto .35rem;
        &.the_title{
          margin:.25rem auto .15rem;
        }
      }
      .intro_box{
        padding-left: .3rem;
        h2{
          font-size: .36rem;
          font-weight: 900;
          text-align: left;
        }
        p{
          text-align: left;
          &.color_purple{
            color: #8514C5;
            margin-top: .3rem;
          }
        }
      }
    }
    .basic_box{
      width: 100%;
      background: @col-white;
      border-radius: .3rem;
      margin-bottom: .89rem;
      padding: .62rem .39rem .54rem;
      position: relative;
      &:last-child{
        margin-bottom: 0;
      }
      .basic_title{
        position: absolute;
        top: -.5rem;
        left: 50%;
        .wh(3.67rem, .88rem);
        margin: 0 0 .32rem -1.835rem;
        padding-top: .05rem;
        font-size: .4rem;
        font-weight: 600;
        color: @col-white;
        text-align: center;
        background: url(../../../../static/imgs/short/KET_title_bg.png) no-repeat;
        background-size: 100% 100%;
        &.pet_bg{
          background: url(../../../../static/imgs/short/PET_title_bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .kind_item_pic{
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto .35rem;
        &.the_title{
          margin:.25rem auto .15rem;
        }
      }
      .text_box{
        margin-bottom: .3rem;
        span{
          color: #8514C5;
        }
      }
      p{
        font-size: .34rem;
        color: #333;
        &.center{
          text-align: center;
        }
        &.bottom_distance{
          margin-bottom: .1rem;
        }
        &.color_purple{
          color: #8514C5;
        }
        &.min_size{
          text-align: center;
          font-size: .3rem;
        }
        &.bold{
          font-weight: 900;
          margin: .2rem 0;
        }
        strong{
          font-weight: 900;
        }
      }
      .table{
        box-sizing: border-box;
        width: 100%;
        margin-top: .25rem;
        table-layout: fixed;
        border: .04rem solid rgba(191,191,191,1);
        border-radius: .2rem;
        td{
          font-size: .28rem;
          color: #333;
          line-height: .48rem;
          padding: .2rem;
          border: .04rem solid rgba(191,191,191,1);
          &.tc{
            text-align: center;
            width: 1.8rem;
          }
          p{
            display: flex;
            font-size: .28rem;
            i{
              display: block;
              .wh(.1rem, .1rem);
              background: #000;
              border-radius: 100%;
              margin: .18rem .2rem 0;
            }
          }
        }
      }
    }
  }
}
.course_bottom{
  display: block;
  width: 100%;
  height: auto;
  margin-top: -3rem;
}
.courses_list{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: .24rem .3rem .3rem;
  border-radius:20px 20px 0px 0px;
  color: #1C223D;
  z-index: 3;
  h4{
    line-height: .5rem;
    font-size: .36rem;
  }
  .courses_item_box{
    max-height: 6rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .courses_item{
    height:1.2rem;
    background:rgba(242,242,242,1);
    border-radius:.1rem;
    margin-top: .3rem;
    box-sizing: border-box;
    padding: .2rem .2rem 0;
    &.cur{
      color: #9A57C8;
      background: #F5EBFC;
    }
    p.name{
      font-size: .3rem;
      line-height: .42rem;
      margin-bottom: .02rem;
      font-weight: bold;
    }
    p.time{
      font-size: .26rem;
      line-height: .38rem;
    }
  }
  .next_btn{
    display: block;
    line-height: .9rem;
    margin: .3rem .57rem 0;
    background: #9A57C8;
    border-radius:.1rem;
    box-shadow:3px 3px 5px 2px rgba(238,214,255,1);
    font-size: .36rem;
    text-align: center;
    color: @col-white;
    &.unclick{
      background: #B2B7CE;
    }
  }
}
.pop-bg{
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,.6);
  .wh(100%,100%);
}
.login-pop{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 80%;
}
.banner{
  position: relative;
  .short_arr{
    display: block;
    width: 0.73rem;
    height: .67rem;
    position: absolute;
    left: 50%;
    top: 8.53rem;
    transform: translate(-50%,0);
    -webkit-animation: rightan 1s infinite;
    -webkit-animation-fill-mode: both;
  }
  .banner_img{
    display: block;
    width: 100%;
    height: auto;
  }
  .banner_btn_box{
    height: 1.44rem;
    position: absolute;
    width: 100%;
    left: 0;
    top: 7.8rem;
    &.bg{
      position: fixed;
      top: 0;
      background: rgba(51,51,51,.4);
      z-index: 2;
    }
  }
  .banner_btn_con{
    width: 6.44rem;
    margin: 0 auto;
    height: 100%;
    position: relative;
  }
  .banner_btn{
    display: block;
    .wh(2.7rem, 1rem);
    position: absolute;
    top: 0.22rem;
    background: #F9BB00;
    font-size: .5rem;
    font-weight: 900;
    color: #fff;
    text-align: center;
    border-radius: 50px;
    line-height: 1rem;
    &.left_btn{
      left: 0;
    }
    &.right_btn{
      right: 0;
      background: #F98500;
    }
    &.cur{
      border: .08rem solid rgba(191,81,0,1);
      line-height: .84rem;
      i{
        display: inline-block;
        .wh(.6rem, .5rem);
        background: url(../../../../static/imgs/short/check_btn.png) no-repeat;
        background-size: 100% 100%;
        margin-left: .15rem;
      }
    }
  }
}
.buy_btn_box{
  width: 100%;
  height: 1.2rem;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #82078D;
  z-index: 2;
  p{
    padding: .2rem .5rem;
    line-height: .4rem;
    font-size: .28rem;
    font-weight: bold;
    color: @col-white;
    span{
      font-size: .48rem;
      color: #FFDB11;
    }
  }
  .buy_btn{
    display: block;
    width: 2.4rem;
    height: .63rem;
    position: absolute;
    top: .3rem;
    right: .5rem;
    text-align: center;
    font-size: .3rem;
    color: #82078D;
    line-height: .63rem;
    font-weight:400;
    border-radius: .32rem;
    background: #FFDB11;
  }
}
.qrcode_con{
  width: 6.1rem;
  height: 6.62rem;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .vipx_qrcode{
    display: block;
    width: 100%;
  }
  .qrcode_txt{
    position: absolute;
    width: 100%;
    left: 0;
    top: 4.6rem;
    line-height: .42rem;
    font-size: .3rem;
    text-align: center;
    color: #1B223F;
    p.red{
      color: #D0021B;
    }
  }
}
.close_pop{
    display: block;
    width: .5rem;
    height: .5rem;
    position: absolute;
    top: .25rem;
    right: .2rem;
    line-height: .5rem;
    color: #1C223D;
    text-align: center;
    font-size: .4rem;
    background: url(../../../../static/imgs/short_course_close.png) no-repeat center;
  }
  .pulldow-loading{
    text-align: center;
    font-size: .3rem;
    color: #82078D;
    padding: 0;
    span{
      display: inline-block;
      vertical-align: middle;
      margin-right: .1rem;
      .wh(.4rem,.4rem);
      .bg-m('@{img-path}/course-details-icon.png');
      background-size: .4rem 4.5rem;
      &.loosen{
        background-position: center -3.35rem;
      }
      &.pul-lup{
        background-position: center -2.91rem;
      }
      &.loading{
        background-position: center -3.84rem;
        animation: myMove1 1s linear infinite;
      }
    }
  }
  @keyframes myMove1 {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
  @-webkit-keyframes rightan{
    from
    {
        top: 8.53rem;
        opacity: 0.1;
    }
    to
    {
        top: 8.8rem;
        opacity: 1;
    }
  }
</style>
