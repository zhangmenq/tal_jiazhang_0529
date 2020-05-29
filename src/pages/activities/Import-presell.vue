<template>
  <div class="import_container">
    <img src="../../assets/import/i2_banner.png" class="import_banner">
    <div class="import_con">
      <!--登录-->
      <div class="import_login">
        <img src="../../assets/import/i2_login_title.png" class="title">
        <p class="sub_title">— 美国小学英语全能力诊断 —</p>
        <div class="import_login_box">
          <div class="item item_input_box" v-show="model==3">
            <input type="number" placeholder="请输入您的手机号" oninput="if(value.length>11)value=value.slice(0,11)" v-model="mobile" class="input">
          </div>
          <div class="item item_input_box" v-show="model==3">
            <input type="number" placeholder="请输入短信验证码" oninput="if(value.length>6)value=value.slice(0,6)" v-model="code" class="input code">
            <a href="javascript:;" class="code_btn" :class="{'code_btn_disabled': isDisabled}" @click="sendCode">{{btnTxt}}</a>
          </div>
          <div class="item item_input_box" v-show="model==2 || model==3">
            <select class="select" v-model="grade">
              <option value="0">选择孩子年级</option>
              <option v-for="(grade, index) in grades" :key="index" :value="grade.id">{{grade.name}}</option>
            </select>
            <img src="../../assets/import/select_arr.png" class="select_arr">
          </div>
          <div class="item item_btn_box mt" v-if="model==1">
            <a href="javascript:;" class="import_login_btn" @click="test"></a>
          </div>
          <div class="item item_btn_box" v-else>
            <a href="javascript:;" class="import_login_btn" @click="test"></a>
          </div>
          <p class="sub_title sub2">— 预约立即获得 —</p>
        </div>
        <!--获得-->
        <div class="getbox">
          <div class="get_item">
            <img src="../../assets/import/i2_get_ico1.png">
            <p>1节</p>
            <p class="gray_color">1对1北美外教体验课</p>
          </div>
          <div class="get_item">
            <img src="../../assets/import/i2_get_ico2.png">
            <p>1次</p>
            <p class="gray_color">英语能力测评</p>
          </div>
          <div class="get_item">
            <img src="../../assets/import/i2_get_ico3.png">
            <p>1份</p>
            <p class="gray_color">英语全能力诊断</p>
          </div>
        </div>
      </div>
      <!--对话-->
      <div class="talk_box" ref="talkBox">
        <div class="talk_item bounceInLeft animated" v-show="talk_item1">
          <img src="../../assets/import/i2_talk1.png" style="width:5.21rem;height:1.02rem;">
        </div>
        <div class="talk_item clearfix bounceInRight animated" v-show="talk_item2">
          <img src="../../assets/import/i2_talk2.png" style="float:right;width:5.50rem;height:1.31rem;">
        </div>
        <div class="talk_item bounceInLeft animated" v-show="talk_item3">
          <img src="../../assets/import/i2_talk3.png" style="width:3.61rem;height:1.02rem;">
        </div>
        <div class="talk_item clearfix bounceInRight animated" v-show="talk_item4">
          <img src="../../assets/import/i2_talk4.png" style="float:right;width:5.50rem;height:1.31rem;">
        </div>
      </div>
      <!--why-->
      <div class="info_box">
        <img src="../../assets/import/i2_why_title.png" class="info_title info_title_why">
        <div class="info_item why_item">
          <img src="../../assets/import/i2_why_item_tbg1.png" class="info_item_title">
          <div class="why_item_con">
            <div class="why_item_img"><img src="../../assets/import/why_img1.png"></div>
            <div class="why_font wf1">
              <div class="why_font_line"></div>
              <div class="why_font_item"><span></span>美国国家地理出版社原版Reach教材</div>
              <div class="why_font_item"><span></span>进阶式学习体验</div>
              <div class="why_font_item"><span></span>高效同步美国小学课程体系</div>
            </div>
          </div>
        </div>
        <div class="info_item why_item">
          <img src="../../assets/import/i2_why_item_tbg2.png" class="info_item_title">
          <div class="why_item_con">
            <div class="why_item_img"><img src="../../assets/import/why_img2.png"></div>
            <div class="why_font wf2">
              <div class="why_font_line"></div>
              <div class="why_font_item"><span></span>1对1美国语文课+TV文学通识课</div>
              <div class="why_font_item"><span></span>每周80分钟纯正美式课堂浸泡</div>
              <div class="why_font_item"><span></span>让孩子进入纯正英文学习情境</div>
              <div class="why_font_item"><span></span>优质北美外教+藤校明星外教</div>
              <div class="why_font_item"><span></span>确保双倍教学效果，专属学习体验</div>
            </div>
          </div>
        </div>
        <div class="info_item why_item why_item_sp">
          <img src="../../assets/import/i2_why_item_tbg3.png" class="info_item_title">
          <div class="why_item_con">
            <div class="why_item_img"><img src="../../assets/import/why_img3.png"></div>
            <div class="why_font wf3">
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
        <img src="../../assets/import/i2_op_title.png" class="info_title info_title_op">
        <div class="info_item cooperation_img_box">
          <img src="../../assets/import/cooperation_img.png">
        </div>
      </div>
    </div>
    <!--footer_btn-->
    <div class="import_footer" v-if="isFixed">
      <a href="javascript:;" @click="goTop"></a>
    </div>
    <div class="loadingPop" v-if="isLoading">
      <loading></loading>
    </div>
    <img src="../../assets/import/i2_body_bg1.png" class="bg bg1">
    <img src="../../assets/import/i2_body_bg2.png" class="bg bg2">
    <img src="../../assets/import/i2_body_bg3.png" class="bg bg3">
    <img src="../../assets/import/i2_body_bg4.png" class="bg bg4">
    <!--success pop-->
    <div class="success_pop" v-if="isShowSuccessPop">
      <div class="mask" @click="isShowSuccessPop=false"></div>
      <div class="success_pop_con">
        <img src="../../assets/import/presell_success.png" class="pop_img">
        <div class="pop_txt">
          <h4>{{successTxt}}</h4>
          <p>学习规划师会在24小时内跟您联系，进行1对1诊断服务。</p>
        </div>
        <a href="javascript:;" class="pop_close" @click="isShowSuccessPop=false"></a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { isEmpty } from 'lodash';
import { setItem, getItem, getCookie, setCookie } from '@/utils/localStorage';
import { sendSmsCode, wxRegister, login, getAllGrades, updateStudent, getWxUserInfo, setApilog } from '@/api';
import { setTimeout } from 'timers';
import Loading from '@/components/loading/Index';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      isFixed: false,
      screenHeight: 0,
      talk_item1: false,
      talk_item2: false,
      talk_item3: false,
      talk_item4: false,
      channel_number: 17,
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
      isOld: 0,
      successTxt: '',
      isShowSuccessPop: false,
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
      if (this.model === 2 || this.model === 3) {
        if (this.grade === '0') {
          this.$vux.toast.show({
            type: 'text',
            text: '请选择孩子年级',
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
      } else if (this.model === 2) {
        this.submitGrade();
      } else if (this.model === 3) {
        const data = {
          'mobile': this.mobile,
          'password': 'vipx666666',
          'code': this.code,
          'grade_id': this.grade,
          'client_id': this.apiConfig.client_id,
          'client_secret': this.apiConfig.client_secret,
          'channel_id': this.channel_number
        }
        wxRegister(data).then((res) => {
          if (res.error_code === 0) {
            this.userInfo = res.data;
            this.studentId = res.data.student_id;
            setItem('token', res.data.token);
            if(res.data.is_old == 1) {
              this.isOld = 1;
            }
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
      if(this.grade === '0'){
        return;
      }
      let data = {
        'grade_id': this.grade
      }
      updateStudent(data).then((res) => {
        if(res.error_code === 0){
          this.userInfo.grade_id = res.data.grade_id;
          this.isOld = 1;
          this.setPointAndGoTest(2);
        }else{
          this.isLoading = false;
          this.canClick = true;
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
      const data = {
        mobile: this.userInfo.mobile,
        grade_id: this.userInfo.grade_id,
        city_id: this.userInfo.city_id,
        channel: this.channel_number
      };
      this.$http.post(url, data).then((res) => {
        this.canClick = true;
        this.isLoading = false;
        this.isShowSuccessPop = true;
        if (res.error_code === 0) {
          this.successTxt = '恭喜，预约成功！';
        } else {
          this.successTxt = '恭喜，预约成功。';
        }
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
            if(res.data.grade_id === -1 || res.data.grade_id === 0){
              this.model = 2;
            }
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
      getWxUserInfo(16).then((res) => {
        if (res.error_code === 0) {
          if(isEmpty(res.data.token)) {
            this.model = 3;
          } else {
            this.userInfo = res.data;
            this.mobile = res.data.mobile;
            this.studentId = res.data.student_id;
            setItem('token', res.data.token);
            if(res.data.grade_id === -1 || res.data.grade_id === 0){
              this.model = 2;
            }
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
  created() {
    this.getGrades();
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
body{
  background: #F46A50;
  .bg{
    display: block;
    position: absolute;
    z-index: -1;
    &.bg1{
      left: 0;
      width: 2.64rem;
      height: 4.06rem;
      top: 13.15rem;
    }
    &.bg2{
      right: 0;
      width: 1.62rem;
      height: 2.16rem;
      top: 13.75rem;
    }
    &.bg3{
      right: 0;
      width: 2.81rem;
      height: 3.87rem;
      top: 21.33rem;
    }
    &.bg4{
      left: 0;
      width: 1.66rem;
      height: 2.16rem;
      top: 31.75rem;
    }
  }
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
.getbox{
  margin: 0 .3rem;
  display: flex;
  .get_item{
    //flex: 1;
    text-align: center;
    width: 31%;
    &:first-child{
      width: 36%;
    }
    img{
      display: block;
      width: 1.2rem;
      height: 1.26rem;
      margin: 0 auto .2rem;
    }
    p{
      line-height: .3rem;
      font-size: .24rem;
      &.gray_color{
        color: #666;
      }
    }
  }
}
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
    height: .91rem;
    background:url(../../assets/import/i2_btn_bg.png) no-repeat 0 0;
    background-size: 100%;
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
      padding: 0 0 .2rem;
      line-height: .64rem;
      color: #9A9A9A;
      font-size: .24rem;
      text-align: center;
      &.sub2{
        margin-top: .2rem;
        padding-bottom: 0;
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
        &.mt{
          margin-top: .1rem;
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
          width: 5.4rem;
          height: .91rem;
          background:url(../../assets/import/i2_btn_bg.png) no-repeat 0 0;
          background-size: 100%;
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
    height: 6.56rem;
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
    background: #fff;
    border-radius: .2rem;
    margin-top: 1rem;
    position: relative;
    padding-top: .8rem;
    .info_title{
      display: block;
      max-width: 100%;
      height: auto;
      position: absolute;
      top: -.59rem;
      left: 50%;
      transform: translate(-50%, 0);
      &.info_title_why{
        width: 6.41rem;
      }
      &.info_title_op{
        width: 5.01rem;
      }
    }
    .info_item{
      position: relative;
      &.why_item{
        padding: .4rem 0 0;
        &:first-child{
          margin-top: 0;
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
        .info_item_title{
          display: block;
          width: 3.8rem;
          height: .92rem;
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
            &.wf1{
              .why_font_line{
                background: #F55758;
              }
              .why_font_item{
                span{
                  border-color: #F55758;
                }
              }
            }
            &.wf2{
              .why_font_line{
                background: #F59C64;
              }
              .why_font_item{
                span{
                  border-color: #F59C64;
                }
              }
            }
            &.wf3{
              .why_font_line{
                background: #FCC629;
              }
              .why_font_item{
                span{
                  border-color: #FCC629;
                }
              }
            }
          }
        }
      }
      &.why_item_sp{
        padding-bottom: .5rem;
      }
      &.cooperation_img_box{
        padding: .36rem .5rem .6rem;
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
@media (min-width: 751PX){
  .getbox{
    .get_item{
      width: 33%;
      &:first-child{
        width: 34%;
      }
    }
  }
}
</style>