<template>
<div class="bg">
  <!--banner-->
  <div class="banner">
    <img src="../../../../static/imgs/shortReading/banner.png" class="banner_img">
    <img src="../../../../static/imgs/short_arr.png" class="short_arr" style="display:none">
    <div class="login_out" v-if="isLogin" @click="loginOut">
      <div class="login_out_text">切换账号</div>
    </div>
    <!--报名时间-->
    <div class="signUp_time"  @click="buyNow">
      <img src="../../../../static/imgs/shortReading/sign_btn.png" class="sing_btn" >
    </div>
  </div>
  <!--立即购买按钮-->
  <div class="buy_btn_box" @click="buyNow"  v-if="isFixed">
     <img src="../../../../static/imgs/shortReading/bottom_bg.png" class="bottom_img">
  </div>
  <!--课程介绍-->
  <div class="course_content">
    <div class="course_item">
      <img src="../../../../static/imgs/shortReading/title1.png" class="title_img">
    </div>
    <div class="course_item">
      <img src="../../../../static/imgs/shortReading/title2.png" class="title_img">
    </div>
    <div class="course_item">
      <img src="../../../../static/imgs/shortReading/title3.png" class="title_img">
    </div>
    <div class="course_item ">
      <img src="../../../../static/imgs/shortReading/title4.png" class="title_img">
    </div>
    <div class="course_item course_tips">
      <img src="../../../../static/imgs/shortReading/title5.png" class="title_img">
    </div>
  </div>
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
  <!--选择年级-->
  <div v-if="gradePopShow">
    <div class="pop-bg"></div>
    <div class="set_grade">
      <div class="pop-close" @click="closeGradePop"></div>
      <h4>请选择孩子当前所读年级</h4>
      <div class="grades" v-if="grades.length > 0">
        <a href="javascript:;" class="grades_item"
            :class="{'active': gradeId === item.id}"
            v-for="(item, index) in grades" :key="index"
            @click="gradeId = item.id">{{item.name}}</a>
      </div>
      <a href="javascript:;" class="grade_btn" :class="gradeId===0?'unclick':''" @click="submitGrade">确认</a>
    </div>
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
import { getItem, setItem, removeItem, sessionSet, sessionGet } from '@/utils/localStorage.js';
import { setTimeout } from 'timers';
import { getAllGrades, updateStudent } from '@/api/index.js';
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
      userInfo: {},
      courses: [],
      selectCourseId: 0,
      type: 1,
      shortType: 0,
      btnClass: false,
      orderStatus: 0,
      order_id: 0,
      showLoading: false,
      openid: '',
      channel: '',
      isWeixin: false,
      grades: [],
      gradeId: 0,
      gradePopShow: false,
      screenHeight: 0,
      scrollTop: 0,
      isFixed: false,// 是否显示底部报名按钮
    };
  },
  created(){
    const isWeixin = getOrigin().startsWith('wechat');
    this.getChannel();
    this.getGrades();
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
    this.isLoginFunc();
    // this.screenHeight = window.screen.height -500;
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    //获取年级
    getGrades() {
      getAllGrades().then((res) => {
        if (res.error_code > 0 || res.data.length === 0) {
          return;
        }
        this.grades = res.data;
      });
    },
    //提交年级
    submitGrade(){
      if(this.gradeId === 0){
        return;
      }
      let data = {
        'grade_id': this.gradeId
      }
      updateStudent(data).then((res) => {
        if(res.error_code === 0){
          this.userInfo = res.data;
          this.gradePopShow = false;
          this.getReadList();
        }else{
          this.$vux.toast.show({
            type: 'text',
            text: '服务器错误，稍后再试',
            position: 'middle',
            time: 3000,
            width: '10em',
          })
        }
      })
    },
    //获取来源
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
      const url = `${this.apiConfig.host}wechat/introduce-openid?introduce_id=reading_course|channel=${this.channel}`
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          sessionSet('indroduce', '1');
          location.href = res.data.url;
        }
      })
    },
    //关闭登录
    loginClose() {
      this.loginShow = false;
      this.isLoginFunc('checkGrade')
    },
    //关闭二维码
    closeQrcodePop(){
      this.qrcodeShow  = false;
    },
    //关闭课程选择框
    closeCoursesPop(){
      this.coursesShow  = false;
    },
    closeGradePop(){
      this.gradePopShow  = false;
    },
    //立即报名
    buyNow(){
      //先检测是否关注服务号
      // if(this.isWeixin && !this.isAttention){
      //   this.qrcodeShow = true;
      //   return;
      // }
      //检测是否登录
      if(!this.isLogin){
        this.loginShow = true
        return
      }
      //检测是否有年级
      if(this.userInfo.grade_id === 0){
        this.gradePopShow = true
        return
      }
      //判断是否已经购买，已购买直接跳核对
      if(this.orderStatus === 1){
        this.$router.push({path:'/pay/success/short',query:{order_id:this.order_id}})
        return
      }
      if(this.orderStatus === 0 && this.order_id !== 0){
        this.$router.push({path:'/pay/wait-pay',query:{order_id:this.order_id}})
        return
      }
      //判断是老用户或者五年级及以上年级
      if(this.userInfo.buy_short_course === 0 || this.userInfo.buy_short_course === 1) {
        const msg = this.userInfo.buy_short_course === 1 ? '本次活动在读学员不建议购买哦~': '仅幼儿园到四年的学生可购买哦~';
        this.$vux.toast.show({
          type: 'text',
          text: msg,
          position: 'middle',
          time: 1500,
          width: '10em',
        })
        return;
      }
      //判断是否有售卖的课程
      if(this.courses.length === 0){
        this.$vux.toast.show({
          type: 'text',
          text: '暂无售卖课程',
          position: 'middle',
          time: 1500,
          width: '10em',
        })
        return;
      } else if(this.courses.length === 1){
        this.$router.push({path:'/time',query:{course_id:this.selectCourseId}})
      }else{
        this.coursesShow = true
      }
    },
    //检测是否已经购买
    checkShort(){
      let content_type = 1;
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
    isLoginFunc(loginType) {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            this.userInfo = res.data;
            this.isLogin = true;
            this.checkShort();
            if(loginType === 'checkGrade' && res.data.grade_id === 0){
              this.gradePopShow = true
            }
            if(res.data.grade_id > 0) {
              this.getReadList();
            }
          }
        });
      }
    },
    // 退出登录
    loginOut(){
       if (getItem('token')) {
         removeItem('token');
         this.isLogin = false
         this.loginShow = true
       }
    },
    //获取课程列表
    getReadList(){
      const url = `${this.apiConfig.host}course/read-list`;
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
    },
    handleScroll () {
       this.scrollTop = (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop);
      if (this.scrollTop > 20) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
  },
};
</script>


<style lang="less" scoped>
@import '../../../styles/basic.less';
@color_yellow: #FFC91F;
@color_purple: #fed74b;
@color_black: #000000;
@keyframes free_download{
    0%{transform:scale(1);}
    50%{transform:scale(1.1);}
    100%{transform:scale(1);}
}
.bg{
  background:@color_purple;
  font-family: PingFangSC-Medium, sans-serif,"Microsoft YaHei";
}
.course_content{
  padding: 0 .3rem 1.6rem .4rem;
  .course_item{
    width:6.72rem;
    max-width:100%;
    margin:.3rem auto 0;
    &:first-child{
      margin-top: 0;
    }
    .title_img{
      display: block;
      margin: 0 auto;
      width:100%;
      height:auto;
    }
    }
  .course_tips{
    padding-top:.5rem;
  }
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
  z-index: 2;
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
.set_grade{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 80%;
  max-width: 6rem;
  padding: .3rem .3rem .6rem;
  background: #fff;
  border-radius: .2rem;
  box-shadow:0 0.14rem 0.40rem 0 rgba(125,26,159,1);
  .pop-close{
    position: absolute;
    top: .2rem;
    right: .2rem;
    width: .4rem;
    height: .4rem;
    .bg-m('@{img-path}/introduce-close1.png');
    background-position: center;
  }
  h4{
    font-size: .36rem;
    text-align: center;
  }
  .grades{
    margin-top: .2rem;
    display: flex;
    flex-wrap: wrap;
    .grades_item{
      display: block;
      width: 28%;
      height: 0.72rem;
      margin: .1rem 2.5%;
      line-height: .72rem;
      border-radius: .1rem;
      border: 0.01rem solid #b2b7ce;
      font-size: .3rem;
      text-align: center;
      color: #1c223d;
      background-color: #fff;
      &.active{
        color: @color_purple;
        border-color: @color_purple;
      }
    }
  }
  .grade_btn{
    display: block;
    line-height: .8rem;
    font-size: .32rem;
    background: @color_yellow;
    box-shadow:0 0.05rem 0.19rem 0 rgba(216,207,219,1);
    color: #BD5407;
    margin: .45rem 2.5% 0;
    font-weight: bold;
    text-align: center;
    border-radius: .4rem;
    &.unclick{
      background: #edeef3;
      color: #b2b7ce;
    }
  }
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
  .signUp_time{
    position: absolute;
    width: 100%;
    left: 0;
    top: 61%;
    text-align: center;
    .sing_btn{
      width:4.65rem;
      height:1.02rem;
      animation: free_download .5s cubic-bezier(.47,0,.745,.715) infinite both;
    }
  }
  .login_out{
    position:absolute;
    top:.3rem;
    right:.3rem;
    width:1.62rem;
    height:.55rem;
    line-height:.55rem;
    color:#fff;
    background:rgba(154,87,200,1);
    box-shadow:.02rem .03rem .04rem 0px rgba(174,114,2,1);
    border-radius:.28rem;
    opacity:0.7045;
    border:.02rem solid rgba(154,87,200,1);
    text-align:center;
    cursor:pointer;
  }
}
.buy_btn_box{
  width: 100%;
 //  height: 1.33rem;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  cursor: pointer;
  .bottom_img{
    width:100%;
    height:auto;
    display:block;
  }
  p{
    padding: .2rem .3rem;
    line-height: .4rem;
    font-size: .28rem;
    font-weight: bold;
    color: @color_black;
    span{
      font-size: .48rem;
      color:@color_purple;
    }
  }
  .buy_btn{
    display: block;
    width: 2.4rem;
    height: .64rem;
    position: absolute;
    top: .3rem;
    right: .3rem;
    text-align: center;
    font-size: .3rem;
    color: @color_yellow;
    line-height: .64rem;
    font-weight:400;
    border-radius: .32rem;
    background: @color_purple;
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
