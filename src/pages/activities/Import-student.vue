<template>
  <div class="import_container" v-if="status==1">
    <img src="../../assets/import/import_banner.png" class="import_banner">
    <div class="import_con">
      <!--登录-->
      <div class="import_login">
        <img src="../../assets/import/import_login_title.png" class="title">
          <p class="sub_title" v-show="fromType==1">— 选择年级，领取诊断资格 —</p>
          <p class="sub_title" v-show="fromType==2">— 美国小学英语全能力诊断 —</p>
        <!--选年级-->
        <div class="import_grades" v-show="fromType==1">
          <div class="import_grades_item">
            <a href="javascript:;" @click="selectGrade(8)">升一年级</a>
            <a href="javascript:;" @click="selectGrade(9)">升二年级</a>
            <a href="javascript:;" @click="selectGrade(10)">升三年级</a>
          </div>
          <div class="import_grades_item">
            <a href="javascript:;" @click="selectGrade(11)">升四年级</a>
            <a href="javascript:;" @click="selectGrade(12)">升五年级</a>
            <a href="javascript:;" @click="selectGrade(13)">升六年级</a>
          </div>
        </div>
        <div class="import_login_box" v-show="fromType==2">
          <div class="item item_input_box" v-show="model==3">
            <input type="number" placeholder="请输入您的手机号" oninput="if(value.length>11)value=value.slice(0,11)" v-model="mobile" class="input">
          </div>
          <div class="item item_input_box" v-show="model==3">
            <input type="number" placeholder="请输入短信验证码" oninput="if(value.length>6)value=value.slice(0,6)" v-model="code" class="input code">
            <a href="javascript:;" class="code_btn" :class="{'code_btn_disabled': isDisabled}" @click="sendCode">{{btnTxt}}</a>
          </div>
          <div class="item item_btn_box">
            <a href="javascript:;" class="import_login_btn" @click="test">立即领取</a>
          </div>
        </div>
      </div>
      <!--对话-->
      <div class="talk_box" ref="talkBox">
        <div class="talk_item bounceInLeft animated" v-show="talk_item1">
          <img src="../../assets/import/talk_1.png" style="width:5.44rem;height:0.81rem;">
        </div>
        <div class="talk_item clearfix bounceInRight animated" v-show="talk_item2">
          <img src="../../assets/import/talk_2.png" style="float:right;width:5.51rem;height:1.11rem;">
        </div>
        <div class="talk_item bounceInLeft animated" v-show="talk_item3">
          <img src="../../assets/import/talk_3.png" style="width:3.64rem;height:0.81rem;">
        </div>
        <div class="talk_item clearfix bounceInRight animated" v-show="talk_item4">
          <img src="../../assets/import/talk_4.png" style="float:right;width:5.52rem;height:1.11rem;">
        </div>
      </div>
      <!--why-->
      <div class="info_box">
        <img src="../../assets/import/why_title.png" class="info_title info_title_why">
        <div class="info_item why_item">
          <h4 class="why_item_title"><span>美国重点小学原版教材</span></h4>
          <div class="why_item_con">
            <div class="why_item_img"><img src="../../assets/import/why_img1.png"></div>
            <div class="why_font">
              <div class="why_font_line"></div>
              <div class="why_font_item"><span></span>美国国家地理出版社原版Reach教材</div>
              <div class="why_font_item"><span></span>进阶式学习体验</div>
              <div class="why_font_item"><span></span>高效同步美国小学课程体系</div>
            </div>
          </div>
        </div>
        <div class="info_item why_item">
          <img src="../../assets/import/sling.png" class="sling sling_left">
          <img src="../../assets/import/sling.png" class="sling sling_right">
          <h4 class="why_item_title"><span>特色双课堂+专属双外教</span></h4>
          <div class="why_item_con">
            <div class="why_item_img"><img src="../../assets/import/why_img2.png"></div>
            <div class="why_font">
              <div class="why_font_line"></div>
              <div class="why_font_item"><span></span>1对1美国语文课+TV文学通识课</div>
              <div class="why_font_item"><span></span>每周80分钟纯正美式课堂浸泡</div>
              <div class="why_font_item"><span></span>让孩子进入纯正英文学习情境</div>
              <div class="why_font_item"><span></span>优质北美外教+藤校明星外教</div>
              <div class="why_font_item"><span></span>确保双倍教学效果，专属学习体验</div>
            </div>
          </div>
        </div>
        <div class="info_item why_item">
          <img src="../../assets/import/sling.png" class="sling sling_left">
          <img src="../../assets/import/sling.png" class="sling sling_right">
          <h4 class="why_item_title"><span>严格选聘纯正北美外教</span></h4>
          <div class="why_item_con">
            <div class="why_item_img"><img src="../../assets/import/why_img3.png"></div>
            <div class="why_font">
              <div class="why_font_line"></div>
              <div class="why_font_item"><span></span>美国、加拿大本土纯正外教</div>
              <div class="why_font_item"><span></span>100%高等教育学历背景</div>
              <div class="why_font_item"><span></span>严格、系统的教师培训</div>
            </div>
          </div>
        </div>
      </div>
      <!--合作机构-->
      <div class="info_box">
        <img src="../../assets/import/cooperation_title.png" class="info_title info_title_op">
        <div class="info_item cooperation_img_box">
          <img src="../../assets/import/cooperation_img.png">
        </div>
      </div>
    </div>
    <!--footer_btn-->
    <div class="import_footer" v-if="isFixed">
      <a href="javascript:;" @click="goTop">立即领取</a>
    </div>
    <div class="loadingPop" v-if="isLoading">
      <loading></loading>
    </div>
    <!--success pop-->
    <!-- <div class="success_pop" v-if="isShowSuccessPop">
      <div class="mask" @click="isShowSuccessPop=false"></div>
      <div class="success_pop_con">
        <img src="../../assets/import/presell_success.png" class="pop_img">
        <div class="pop_txt">
          <h4>{{successTxt}}</h4>
          <p>学习规划师会在24小时内跟您联系，进行1对1诊断服务。</p>
        </div>
        <a href="javascript:;" class="pop_close" @click="isShowSuccessPop=false"></a>
      </div>
    </div> -->
  </div>
  <div v-else>
    <import-success :orderInfo="orderInfo"></import-success>
  </div>
</template>

<script>
/* eslint-disable */
import { isEmpty } from 'lodash';
import { setItem, getItem, getCookie, setCookie } from '@/utils/localStorage';
import { sendSmsCode, wxRegister, login, getAllGrades, updateStudent, getWxUserInfo, setApilog } from '@/api';
import { setTimeout } from 'timers';
import Loading from '@/components/loading/Index';
import ImportSuccess from './Import-success'

export default {
  components: {
    Loading,
    ImportSuccess,
  },
  data() {
    return {
      status: 1,
      fromType: 1,
      isFixed: false,
      screenHeight: 0,
      talk_item1: false,
      talk_item2: false,
      talk_item3: false,
      talk_item4: false,
      channel_number: 20,
      grades: [],
      model: 1,
      mobile: '',
      code: '',
      grade: '0',
      errorStatus: 0,
      isDisabled: false,
      btnTxt: '发送验证码',
      userInfo: null,
      isLogin: false,
      studentId: 0,
      canClick: true,
      isLoading: false,
      orderInfo: null,
    };
  },
  watch: {
    mobile(val) {
      if (val.length === 11 && /1\d{10}/.test(val)) {
        this.showError = false;
        this.mobileMsg = '';
      } else {
        this.showError = true;
        if (isEmpty(val)) {
          this.mobileMsg = '';
        } else {
          this.mobileMsg = '请输入正确的手机号';
        }
      }
    },
    code(val) {
      if ((val.length > 3 && val.length < 7) || isEmpty(val)) {
        this.codeMsg = '';
      } else {
        this.codeMsgStatus = 0;
        this.codeMsg = '请输入4-6位的验证码';
      }
    },
  },
  computed: {
    cityId() {
      return Number(this.$route.query.id) || 7;
    },
    channel() {
      return Number(this.$route.query.channel) || 6;
    },
    introduceId() {
      return Number(this.$route.query.introduce_id) || 0;
    },
    wx_token() {
      return getCookie('xes_rfh') || '';
    },
  },
  methods: {
    test() {
      if (this.model === 3) {
        if (this.mobile.length !== 11 && !/1\d{10}/.test(this.mobile)) {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入正确的手机号',
            position: 'middle',
            time: 3000,
            width: '16em',
          });
          return false;
        }
        if (this.code.length < 4 || this.code.length > 6 || isEmpty(this.code)) {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入4-6位的验证码',
            position: 'middle',
            time: 3000,
            width: '16em',
          });
          return false;
        }
      }
      if (!this.canClick) {
        return false;
      }
      this.isLoading = true;
      this.canClick = false;
      if (this.model === 1) {
        this.setPointAndGoTest(3);
      } else if (this.model === 3) {
        const data = {
          'mobile': this.mobile,
          'password': 'vipx666666',
          'code': this.code,
          'client_id': this.apiConfig.client_id,
          'client_secret': this.apiConfig.client_secret,
          'channel_id': this.channel_number
        }
        wxRegister(data).then((res) => {
          if (res.error_code === 0) {
            this.userInfo = res.data;
            this.studentId = res.data.student_id;
            setItem('token', res.data.token);
            this.setPointAndGoTest(1);
          } else {
            this.isLoading = false;
            this.canClick = true;
            this.$vux.toast.show({
              type: 'text',
              text: res.error_msg,
              position: 'middle',
              time: 3000,
              width: '16em',
            });
          }
        })
      }
      
    },
    handleScroll() {
      let bodyHeight = document.body.clientHeight;
      this.scrollTop = (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop);
      if (this.scrollTop > this.screenHeight) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
      let talkHeight = this.$refs.talkBox.offsetTop;
      if ((bodyHeight + this.scrollTop) >= talkHeight + 120){
        this.talk_item1 = true;
      } 
      if ((bodyHeight + this.scrollTop) >= talkHeight + 300){
        this.talk_item2 = true;
      }
      if ((bodyHeight + this.scrollTop) >= talkHeight + 480){
        this.talk_item3 = true;
      }
      if ((bodyHeight + this.scrollTop) >= talkHeight + 660){
        this.talk_item4 = true;
      } 
    },
    goTop() {
      if (document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 200;
      } else if (document.body.scrollTop) {
        document.body.scrollTop = 200;
      } else if (window.pageYOffset) {
        window.pageYOffset = 200;
      }
      setApilog({
        event_type: 20009,
        ext1: this.channel_number,
        ext5: 'bottom_subscribe'
      })
    },
    //选择年级
    selectGrade(gradeId) {
      this.grade = gradeId;
      this.fromType = 2;
    },
    async setPointAndGoTest(pointType){
      await setApilog({
        event_type: 20008,
        ext1: this.channel_number,
        ext2: pointType,
        ext3: 1,
        ext5: 'subscribe'
      });
      await this.presell();
    },
    //创建预售单
    presell() {
      const url = `${this.apiConfig.host}/order/orders/wangxiao-presell`;
      const grade_id = this.userInfo.grade_id == 0? this.grade : this.userInfo.grade_id;
      const data = {
        mobile: this.userInfo.mobile,
        grade_id: grade_id,
        city_id: this.userInfo.city_id,
        channel: this.channel_number
      };
      this.$http.post(url, data).then((res) => {
        this.canClick = true;
        this.isLoading = false;
        this.orderInfo = res;
        this.status = 2;
      });
    },
    sendCode() {
      if (this.mobile.length !== 11 && !/1\d{10}/.test(this.mobile)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入正确的手机号',
          position: 'middle',
          time: 3000,
          width: '16em',
        });
        return false;
      }
      if (this.isDisabled) {
        return false;
      }
      setApilog({
        event_type: 20012,
        ext1: this.channel_number,
        ext2: this.mobile
      });
      sendSmsCode(this.mobile, 15).then((response) => {
        if (response.error_code !== 0) {
          this.$vux.toast.show({
            type: 'text',
            text: response.error_msg,
            position: 'middle',
            time: 3000,
            width: '12em',
          });
          return false;
        }
        this.isDisabled = true;
        this.$vux.toast.show({
          type: 'text',
          text: '验证码已发送',
          position: 'middle',
          time: 3000,
          width: '12em',
        });
        this.countdown();
      });
    },
    countdown() {
      let seconds = 60;
      this.timer = setInterval(() => {
        this.btnTxt = `已发送(${seconds})`;
        if (seconds === 0) {
          this.isDisabled = false;
          this.btnTxt = '重新发送';
          clearInterval(this.timer);
        }
        seconds -= 1;
      }, 1000);
    },
    //判断是否登录
    isLoginFunc() {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            this.isLogin = true;
            this.userInfo = res.data;
            this.studentId = res.data.id;
          } else {
            this.model = 3;
          }
        });
      } else {
        this.model = 3;
      }
    },
    //获取网校用户信息
    getWxUserInfoFuc(){
      getWxUserInfo(this.channel_number).then((res) => {
        if (res.error_code === 0) {
          if(isEmpty(res.data.token)) {
            this.model = 3;
          } else {
            this.userInfo = res.data;
            this.mobile = res.data.mobile;
            this.studentId = res.data.student_id;
            setItem('token', res.data.token);
          }
        } else if (res.error_code === 10001) {
          this.isLoginFunc();
        } else {
          this.model = 3;
        }
        setApilog({
          event_type: 20007,
          ext1: this.channel_number,
          ext5: 'index'
        })
      }).catch((error) => {
        this.model = 3;
        setApilog({
          event_type: 20007,
          ext1: this.channel_number,
          ext5: 'index'
        })
      });
    },
  },
  mounted() {
    this.screenHeight = window.screen.height + 100;
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll);
    this.getWxUserInfoFuc();
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
body{
  background: #F8802B;
}
.success_pop{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
  .mask{
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .success_pop_con{
    width: 6.3rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: .2rem;
    .pop_close{
      display: block;
      width: .7rem;
      height: .7rem;
      position: absolute;
      left: 50%;
      bottom: -1.1rem;
      transform: translate(-50%, 0);
      background:url(../../assets/import/gray_close.png) no-repeat 0 0;
      background-size: 100%;
    }
    .pop_img{
      display: block;
      width: 100%;
      height: auto;
      border-top-left-radius: .2rem;
      border-top-right-radius: .2rem;
    }
    .pop_txt{
      padding: .5rem .9rem;
      h4{
        font-size: .4rem;
        line-height: .6rem;
        text-align: center;
        padding-bottom: .2rem;
      }
      p{
        font-size: .28rem;
        color: #999999;
        line-height: .42rem;
      }
    }
  }
}
.clearfix:after{content: "";display: block;clear: both;height: 0;}
.import_container{
  padding-bottom: 1.8rem;
}
.import_banner{
  display: block;
  width: 100%;
  height: auto;
}
.import_footer{
  width: 100%;
  height: 1.4rem;
  padding-top: .25rem;
  background: rgba(0,0,0,0.5);
  position: fixed;
  left: 0;
  bottom: 0;
  a{
    display: block;
    width: 5.4rem;
    height: .9rem;
    background:linear-gradient(-90deg,rgba(255,149,45,1) 0%,rgba(255,92,28,1) 100%);
    border-radius: .45rem;
    color: #fff;
    text-align: center;
    font-size: .3rem;
    margin: 0 auto;
    line-height: .9rem;
  }
}
.loadingPop{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  padding: 0 1rem;
  background: rgba(0,0,0,0.7);
  border-radius: .1rem;
}
.pulldow-loading{
  color: #fff;
}
.import_con{
  padding: 0 .3rem;
  background: url(../../assets/import/import_con_top.png) no-repeat 0 0;
  background-size: 100% auto;
  .import_login{
    background: #fff;
    padding: .4rem 0 .5rem;
    box-shadow:0 .04rem .1rem .01rem rgba(138,58,0,0.27);
    border-radius:.2rem;
    .title{
      display: block;
      width: 5.45rem;
      height: auto;
      margin: 0 auto;
    }
    .sub_title{
      padding: .5rem 0;
      line-height: .24rem;
      color: #9A9A9A;
      font-size: .24rem;
      text-align: center;
    }
    .import_grades{
      padding: 0 .15rem;
      .import_grades_item{
        display: flex;
        padding-top: .5rem;
        &:first-child{
          padding-top: 0;
        }
        a{
          display: block;
          flex: 1;
          margin: 0 .15rem;
          height: 1.3rem;
          background: #FFECDF;
          border: .02rem solid #FB7E2D;
          border-radius: .1rem;
          line-height: 1.26rem;
          text-align: center;
          font-size: .32rem;
          color: #FA802B;
        }
      }
    }
    .import_login_box{
      width: 5.4rem;
      margin: 0 auto;
      .item{
        margin-top: .2rem;
        &:first-child{
          margin-top: 0;
        }
        &.item_btn_box{
          margin-top: .3rem;
        }
        &.item_input_box{
          height: .9rem;
          position: relative;
          border: .02rem solid #D2D2D2;
          box-sizing: border-box;
          border-radius: .45rem;
          .input{
            width: 100%;
            padding: 0 .4rem;
            height: .86rem;
            line-height: .86rem;
            border: none;
            background: none;
            outline: none;
            font-size: .24rem;
            &.code{
              width: 3.1rem;
            }
          }
          .select{
            width: 100%;
            height: .86rem;
            padding: 0 .4rem;
            font-size: .24rem;
            color: #999;
            border: none;
            background: none;
            outline: none;
            appearance:none;
            -moz-appearance:none;   
            -webkit-appearance:none;
          }
          .select_arr{
            display: block;
            width: .38rem;
            height: .2rem;
            position: absolute;
            top: .36rem;
            right: .44rem;
            z-index: 1;
          }
          .code_btn{
            display: block;
            width: 1.7rem;
            height: .7rem;
            position: absolute;
            top: .08rem;
            right: .08rem;
            background:linear-gradient(-90deg,rgba(255,149,45,1) 0%,rgba(255,92,28,1) 100%);
            border-radius: .35rem;
            color: #fff;
            font-size: .24rem;
            text-align: center;
            line-height: .7rem;
            &.code_btn_disabled{
              background: #bbb;
            }
          }
        }
        .import_login_btn{
          display: block;
          height: .9rem;
          background:linear-gradient(-90deg,rgba(255,149,45,1) 0%,rgba(255,92,28,1) 100%);
          border-radius: .45rem;
          color: #fff;
          font-size: .3rem;
          text-align: center;
          line-height: .9rem;
          animation: free_download .6s cubic-bezier(.47,0,.745,.715) infinite both;
        }
      }
    }
  }
  .talk_box{
    height: 5.74rem;
    padding: .3rem .02rem 0 .08rem;
    .talk_item{
      margin-top: .4rem;
      img{
        display: block;
        max-width: 100%;
        height: auto;
      }
    }
  }
  .info_box{
    margin-top: .5rem;
    .info_title{
      display: block;
      max-width: 100%;
      height: auto;
      margin:  0 auto;
      &.info_title_why{
        width: 6.55rem;
      }
      &.info_title_op{
        width: 3.75rem;
      }
    }
    .info_item{
      background: #fff;
      border-radius: .2rem;
      position: relative;
      &.why_item{
        padding: .34rem 0 .5rem;
        margin-bottom: .2rem;
        &:first-child{
          margin-top: 0;
        }
        .sling{
          display: block;
          width: .24rem;
          height: .73rem;
          position: absolute;
          top: -.45rem;
          z-index: 1;
          &.sling_left{
            left: .28rem;
          }
          &.sling_right{
            right: .28rem;
          }
        }
        .why_item_title{
          position: relative;
          height: .87rem;
          span{
            width: 4.85rem;
            height: .87rem;
            background: url(../../assets/import/why_item_title.png) no-repeat 0 0;
            background-size: auto 100%;
            display: block;
            line-height: .8rem;
            font-size: .3rem;
            font-weight: bold;
            position: absolute;
            padding:.07rem 0 0 .4rem;
            top: .07rem;
            left: -0.14rem;
            color: #fff;
          }
        }
        .why_item_con{
          min-height: 1.4rem;
          margin-top: .5rem;
          display: flex;
          padding: 0 .4rem 0 .3rem;
          .why_item_img{
            width: 1.7rem;
            position: relative;
            img{
              display: block;
              width: 1.4rem;
              height: 1.4rem;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
          .why_font{
            padding-left: .3rem;
            position: relative;
            .why_font_line{
              width: .02rem;
              background: #F55758;
              position: absolute;
              left: 0;
              top: .22rem;
              bottom: .22rem;
            }
            .why_font_item{
              font-size: .24rem;
              line-height: .44rem;
              position: relative;
              span{
                display: block;
                width: .2rem;
                height: .2rem;
                border: .02rem solid #F55758;
                border-radius: 50%;
                position: absolute;
                left: -.4rem;
                top: .12rem;
                background: #fff;
              }
            }
          }
        }
      }
      &.cooperation_img_box{
        padding: .6rem .5rem .5rem;
        img{
          display: block;
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
@keyframes free_download{
    0%{transform:scale(1);}
    50%{transform:scale(1.1);}
    100%{transform:scale(1);}
}
</style>