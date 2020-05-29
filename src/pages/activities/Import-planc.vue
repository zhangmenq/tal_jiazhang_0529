<template>
  <div class="import_container" v-if="status == 1">
    <img
      src="../../assets/import/christmas/pei-title.png"
      v-if="channel_number == 23"
      class="import_banner"
    />
    <img
      src="../../assets/import/christmas/wang-title.png"
      v-else
      class="import_banner"
    />
    <div class="import_con" style="margin-top:-.25rem">
      <!--登录-->
      <div
        class="import_login"
        :class="{
          wang_login: channel_number != 23 && fromType == 1,
          wang_login_big: channel_number != 23 && fromType == 2,
          pei_login:
            (channel_number == 23 && fromType == 1) ||
            (channel_number == 23 && fromType == 2 && model == 3),
          pei_login_small: channel_number == 23 && fromType == 2 && model !== 3
        }"
      >
        <div class="box_grade">
          <p class="sub_title" v-show="fromType == 1">— 点击按钮 选择年级 —</p>
          <!--选年级-->
          <div class="import_grades" v-show="fromType == 1">
            <div class="import_grades_item">
              <a href="javascript:;" @click="selectGrade(8)">一年级</a>
              <a href="javascript:;" @click="selectGrade(9)">二年级</a>
              <a href="javascript:;" @click="selectGrade(10)">三年级</a>
            </div>
            <div class="import_grades_item">
              <a href="javascript:;" @click="selectGrade(11)">四年级</a>
              <a href="javascript:;" @click="selectGrade(12)">五年级</a>
              <a href="javascript:;" @click="selectGrade(13)">六年级</a>
            </div>
          </div>
        </div>
        <div
          :class="{
            box_context: model !== 3,
            box_grade: model == 3
          }"
        >
          <p class="sub_title_big" v-show="fromType == 2">
            — 美国小学英语全能力诊断 —
          </p>
          <!--登陆表单-->
          <div class="import_login_box" v-show="fromType == 2">
            <div class="item item_input_box" v-if="model == 3">
              <input
                type="number"
                placeholder="请输入您的手机号"
                oninput="if(value.length>11)value=value.slice(0,11)"
                v-model="mobile"
                class="input"
              />
            </div>
            <div class="item item_input_box" v-if="model == 3">
              <input
                type="number"
                placeholder="请输入短信验证码"
                oninput="if(value.length>6)value=value.slice(0,6)"
                v-model="code"
                class="input code"
              />
              <a
                href="javascript:;"
                class="code_btn"
                :class="{ code_btn_disabled: isDisabled }"
                @click="sendCode"
                >{{ btnTxt }}</a
              >
            </div>
            <div class="item item_btn_box">
              <a href="javascript:;" class="import_login_btn" @click="test"
                >0元试听 抢占名额</a
              >
            </div>
          </div>
          <!--获得-->
          <div v-if="channel_number != 23" v-show="fromType == 2">
            <h4 class="get_title">— 领取后您将获得 —</h4>
            <div class="getbox">
              <div class="get_item">
                <img src="../../assets/import/i2_get_ico1.png" />
                <p class="b">1次</p>
                <p class="gray_color">英语水平测试</p>
              </div>
              <div class="get_item">
                <img src="../../assets/import/i2_get_ico2.png" />
                <p class="b">1节</p>
                <p class="gray_color">1对1外教体验课</p>
              </div>
              <div class="get_item">
                <img src="../../assets/import/i2_get_ico3.png" />
                <p class="b">1份</p>
                <p class="gray_color">专业诊断报告</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--为什么选择学而思VIPX-->
      <div class="planc_info_box">
        <img src="../../assets/import/christmas/wang-why.png" />
      </div>
      <!--四大安心承诺-->
      <div class="planc_info_box">
        <img src="../../assets/import/christmas/wang-promise.png" />
      </div>
      <!--15年教学经验-->
      <div class="planc_info_box">
        <img src="../../assets/import/christmas/wang-experience.png" />
      </div>
      <!--关于vipx-->
      <div class="planc_info_box">
        <img src="../../assets/import/christmas/wang-about.png" />
      </div>
    </div>
    <!--footer_btn-->
    <div class="import_footer" v-if="isFixed">
      <a href="javascript:;" @click="goTop">0元试听 抢占名额</a>
    </div>
    <div class="loadingPop" v-if="isLoading">
      <loading></loading>
    </div>
    <div class="question_box fadeInUp animated" v-if="showQuestions">
      <div class="question_box_tips" v-if="questionsIndex === 0">
        <img src="../../assets/import/hi_deer.png" />
        <div class="tips_txt">
          <p>Hi, 我是您宝贝的学习成长伙伴</p>
          <p>为了更好的辅导宝贝学习成长</p>
          <p>请您帮助我们回答3个小问题吧～</p>
        </div>
      </div>
      <div>
        <h2 class="q_title">
          <span
            >(<em>{{ questionsIndex + 1 }}</em
            >/3)</span
          >{{ questions[questionsIndex].title }}
        </h2>
        <a
          href="javascript:;"
          v-for="(item, index) in questions[questionsIndex].options"
          :key="index"
          class="choose_item"
          :class="{ cur: answers[questionsIndex] === index + 1 }"
          @click="choose(index)"
        >
          <img
            v-if="answers[questionsIndex] === index + 1"
            src="../../assets/import/planc_right_ico.png"
          />
          <span v-else></span>
          {{ item }}
        </a>
      </div>
      <a
        href="javascript:;"
        class="next_btn"
        @click="nextQuestion"
        :class="{ next_unclick: !answers[questionsIndex] }"
        >{{ questionsIndex === 2 ? "提交" : "下一步" }}</a
      >
    </div>
  </div>
  <div v-else>
    <import-success :orderInfo="orderInfo"></import-success>
  </div>
</template>

<script>
/* eslint-disable */
import { isEmpty } from "lodash";
import { setItem, getItem, getCookie, setCookie } from "@/utils/localStorage";
import {
  sendSmsCode,
  wxRegister,
  login,
  getAllGrades,
  updateStudent,
  getWxUserInfo,
  setApilog
} from "@/api";
import { setTimeout } from "timers";
import Loading from "@/components/loading/Index";
import ImportSuccess from "./Import-success";

export default {
  components: {
    Loading,
    ImportSuccess
  },
  data() {
    return {
      status: 1,
      isFixed: false,
      screenHeight: 0,
      grades: [],
      model: 3,
      mobile: "",
      code: "",
      grade: 0,
      errorStatus: 0,
      isDisabled: false,
      btnTxt: "发送验证码",
      userInfo: null,
      isLogin: false,
      studentId: 0,
      canClick: true,
      isLoading: false,
      fromType: 1,
      orderInfo: null,
      showQuestions: false,
      questions: [
        {
          title: "您的宝贝学习英语多久了",
          options: ["0年", "0-1年", "1-2年", "2-3年", "大于3年"]
        },
        {
          title: "您怎么评价宝贝的英语水平",
          options: [
            "英语启蒙阶段，刚接触字母",
            "有一定英语基础，会简单词汇和句型",
            "用独立英语描述生活中的事物"
          ]
        },
        {
          title: "您加入VIPX有什么学习愿望",
          options: [
            "流利对话和标准发音",
            "自然习得英语思维",
            "上国际学校/出国",
            "提高高考成绩"
          ]
        }
      ],
      questionsIndex: 0,
      answers: []
    };
  },
  watch: {
    mobile(val) {
      if (val.length === 11 && /1\d{10}/.test(val)) {
        this.showError = false;
        this.mobileMsg = "";
      } else {
        this.showError = true;
        if (isEmpty(val)) {
          this.mobileMsg = "";
        } else {
          this.mobileMsg = "请输入正确的手机号";
        }
      }
    },
    code(val) {
      if ((val.length > 3 && val.length < 7) || isEmpty(val)) {
        this.codeMsg = "";
      } else {
        this.codeMsgStatus = 0;
        this.codeMsg = "请输入4-6位的验证码";
      }
    }
  },
  computed: {
    channel_number() {
      return Number(this.$route.params.channel_id) || 21;
    }
  },
  methods: {
    //选择答题选项
    choose(index) {
      this.$set(this.answers, this.questionsIndex, index + 1);
      console.log(this.answers[this.questionsIndex]);
    },
    //下一步
    nextQuestion() {
      if (!this.answers[this.questionsIndex]) {
        return false;
      }
      if (this.questionsIndex < 2) {
        this.questionsIndex++;
      } else {
        this.submitFun();
      }
    },
    //注册、登录
    submitFun() {
      if (!this.canClick) {
        return false;
      }
      this.isLoading = true;
      this.canClick = false;
      const data = {
        mobile: this.mobile,
        password: "vipx666666",
        code: this.code,
        grade_id: this.grade,
        client_id: this.apiConfig.client_id,
        client_secret: this.apiConfig.client_secret,
        channel_id: this.channel_number
      };
      wxRegister(data).then(res => {
        if (res.error_code === 0) {
          this.userInfo = res.data;
          this.studentId = res.data.student_id;
          setItem("token", res.data.token);
          this.setPointAndGoTest(1);
        } else {
          this.isLoading = false;
          this.canClick = true;
          this.$vux.toast.show({
            type: "text",
            text: res.error_msg,
            position: "middle",
            time: 3000,
            width: "16em"
          });
        }
      });
    },
    test() {
      if (this.model === 3) {
        if (this.mobile.length !== 11 && !/1\d{10}/.test(this.mobile)) {
          this.$vux.toast.show({
            type: "text",
            text: "请输入正确的手机号",
            position: "middle",
            time: 3000,
            width: "16em"
          });
          return false;
        }
        if (
          this.code.length < 4 ||
          this.code.length > 6 ||
          isEmpty(this.code)
        ) {
          this.$vux.toast.show({
            type: "text",
            text: "请输入4-6位的验证码",
            position: "middle",
            time: 3000,
            width: "16em"
          });
          return false;
        }
      }
      if (this.model === 1) {
        if (!this.canClick) {
          return false;
        }
        this.isLoading = true;
        this.canClick = false;
        this.setPointAndGoTest(3);
      } else if (this.model === 3) {
        this.submitFun();
      }
    },
    handleScroll() {
      let bodyHeight = document.body.clientHeight;
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (this.scrollTop > this.screenHeight * 2) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
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
        ext5: "bottom_subscribe"
      });
    },
    //选择年级
    selectGrade(gradeId) {
      this.grade = gradeId;
      this.fromType = 2;
    },
    async setPointAndGoTest(pointType) {
      await setApilog({
        event_type: 20008,
        ext1: this.channel_number,
        ext2: pointType,
        ext3: 1,
        ext5: "subscribe"
      });
      await this.presell();
    },
    //创建预售单
    presell() {
      const url = `${this.apiConfig.host}/order/orders/wangxiao-presell`;
      const grade_id =
        this.userInfo.grade_id == 0 ? this.grade : this.userInfo.grade_id;
      const answersStr = this.answers.join(",");
      let data = {};
      data = {
        mobile: this.userInfo.mobile,
        grade_id: grade_id,
        city_id: this.userInfo.city_id,
        channel: this.channel_number
      };
      this.$http.post(url, data).then(res => {
        this.canClick = true;
        this.isLoading = false;
        this.orderInfo = res;
        this.status = 2;
      });
    },
    sendCode() {
      if (this.mobile.length !== 11 && !/1\d{10}/.test(this.mobile)) {
        this.$vux.toast.show({
          type: "text",
          text: "请输入正确的手机号",
          position: "middle",
          time: 3000,
          width: "16em"
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
      sendSmsCode(this.mobile, 1).then(response => {
        if (response.error_code !== 0) {
          this.$vux.toast.show({
            type: "text",
            text: response.error_msg,
            position: "middle",
            time: 3000,
            width: "12em"
          });
          return false;
        }
        this.isDisabled = true;
        this.$vux.toast.show({
          type: "text",
          text: "验证码已发送",
          position: "middle",
          time: 3000,
          width: "12em"
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
          this.btnTxt = "重新发送";
          clearInterval(this.timer);
        }
        seconds -= 1;
      }, 1000);
    },
    //判断是否登录
    isLoginFunc() {
      if (getItem("token")) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then(res => {
          if (res.error_code === 0) {
            this.isLogin = true;
            this.userInfo = res.data;
            this.studentId = res.data.id;
            this.model = 1;
          } else {
            this.model = 3;
          }
        });
      } else {
        this.model = 3;
      }
    },
    //获取网校用户信息
    init() {
      if (this.channel_number === 23) {
        this.isLoginFunc();
      }
      setApilog({
        event_type: 20007,
        ext1: this.channel_number,
        ext5: "index"
      });
    },
    //获取网校用户信息
    getWxUserInfoFuc() {
      getWxUserInfo(16).then(res => {
        console.log(res.error_code);
      });
    }
  },
  mounted() {
    this.screenHeight = window.screen.height + 100;
    window.addEventListener("scroll", this.handleScroll);
    this.init();
    if (this.channel_number !== 23) {
      this.getWxUserInfoFuc();
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
<style lang="less">
@import "../../styles/basic.less";
body {
  background: #fff;
  .bg {
    display: block;
    position: absolute;
    z-index: -1;
    &.bg1 {
      left: -0.64rem;
      width: 2.07rem;
      height: 2.05rem;
      top: 30.71rem;
    }
    &.bg2 {
      right: -0.4rem;
      width: 2.07rem;
      height: 2.05rem;
      top: 41.32rem;
    }
  }
}
.question_box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 0.8rem 0.7rem;
  .question_box_tips {
    padding: 0.24rem 0.3rem;
    background: rgba(255, 134, 0, 0.1);
    display: flex;
    margin: -0.5rem -0.4rem 0.3rem;
    border-radius: 0.3rem;
    img {
      display: block;
      width: 1.71rem;
      height: 1.77rem;
    }
    .tips_txt {
      padding: 0.1rem 0 0 0.3rem;
      font-size: 0.28rem;
      line-height: 0.58rem;
    }
  }
  .q_title {
    line-height: 0.76rem;
    font-size: 0.36rem;
    span {
      margin-right: 0.2rem;
      em {
        color: #ff4f00;
      }
    }
  }
  .choose_item {
    display: block;
    position: relative;
    margin-top: 0.4rem;
    padding-left: 0.54rem;
    line-height: 0.74rem;
    font-size: 0.34rem;
    color: #333333;
    span {
      display: block;
      width: 0.34rem;
      height: 0.34rem;
      border: 0.02rem solid #e4e4e4;
      border-radius: 100%;
      position: absolute;
      left: 0;
      top: 0.2rem;
    }
    img {
      display: block;
      width: 0.34rem;
      height: 0.34rem;
      position: absolute;
      left: 0;
      top: 0.2rem;
    }
    &.cur {
      color: #ff4f00;
    }
  }
  .next_btn {
    display: block;
    line-height: 0.9rem;
    border-radius: 0.45rem;
    margin: 0.6rem 0.25rem 0;
    text-align: center;
    color: #fff;
    font-size: 0.46rem;
    font-weight: bold;
    background: linear-gradient(
      -90deg,
      rgba(255, 142, 0, 1) 0%,
      rgba(255, 72, 0, 1) 100%
    );
    box-shadow: 0.01rem 0.08rem 0.15rem 0.03rem rgba(196, 67, 47, 0.2);
    &.next_unclick {
      background: #bbb;
    }
  }
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
}
.import_container {
  padding-bottom: 1.8rem;
  background: rgba(210, 39, 66, 1);
}
.import_banner {
  display: block;
  width: 100%;
  height: auto;
}
.import_footer {
  width: 100%;
  height: 1.4rem;
  padding-top: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  bottom: 0;
  a {
    display: block;
    width: 5.4rem;
    height: 0.9rem;
    margin: 0 auto;
    background: linear-gradient(
      -90deg,
      rgba(255, 142, 0, 1) 0%,
      rgba(255, 72, 0, 1) 100%
    );
    box-shadow: 0.01rem 0.08rem 0.15rem 0.03rem rgba(196, 67, 47, 0.2);
    color: #fff;
    font-size: 0.3rem;
    text-align: center;
    line-height: 0.9rem;
    border-radius: 0.45rem;
  }
}
.loadingPop {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  padding: 0 1rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0.1rem;
}
.pulldow-loading {
  color: #fff;
}
.import_con {
  .wang_login {
    background-image: url("../../assets/import/christmas/wang-grade.png");
    background-size: 100% 100%;
    height: 8.41rem;
  }
  .wang_login_big {
    background-image: url("../../assets/import/christmas/wang-big.png");
    background-size: 100% 100%;
    height: 11.42rem;
  }
  .pei_login {
    background-image: url("../../assets/import/christmas/pei-grade.png");
    background-size: 100% 100%;
    height: 8.41rem;
  }
  .pei_login_small {
    background-image: url("../../assets/import/christmas/pei-small.png");
    background-size: 100% 100%;
    height: 6.81rem;
  }
  .import_login {
    border-radius: 0.2rem;
    position: relative;
    .box_grade {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      padding: 0 0.6rem;
    }
    .box_context {
      position: absolute;
      bottom: 1.3rem;
      width: 100%;
      padding: 0 0.6rem;
    }
    .title {
      display: block;
      width: 6.3rem;
      height: auto;
      margin: 0 auto;
    }
    .sub_title {
      padding: 0.5rem 0 0.3rem;
      line-height: 0.24rem;
      color: #504746;
      font-size: 0.24rem;
      text-align: center;
    }
    .sub_title_big {
      padding: 0.2rem 0;
      line-height: 0.24rem;
      color: #504746;
      font-size: 0.24rem;
      text-align: center;
    }
    .import_grades {
      padding: 0 0.15rem;
      .import_grades_item {
        display: flex;
        padding-top: 0.3rem;
        &:first-child {
          padding-top: 0;
        }
        a {
          display: block;
          flex: 1;
          margin: 0 0.15rem;
          height: 1.3rem;
          background: rgba(209, 38, 65, 0.2);
          border: 0.02rem solid #d12641;
          border-radius: 0.1rem;
          line-height: 1.26rem;
          text-align: center;
          font-size: 0.32rem;
          color: #d12641;
        }
      }
    }
    .import_login_box {
      width: 5.4rem;
      margin: 0 auto;
      .item {
        margin-top: 0.2rem;
        &:first-child {
          margin-top: 0;
        }
        &.item_btn_box {
          margin-top: 0.3rem;
        }
        &.mt {
          margin-top: 0.1rem;
        }
        &.item_input_box {
          height: 0.9rem;
          position: relative;
          border: 0.02rem solid #d2d2d2;
          box-sizing: border-box;
          border-radius: 0.45rem;
          .input {
            width: 100%;
            padding: 0 0.4rem;
            height: 0.86rem;
            line-height: 0.86rem;
            border: none;
            background: none;
            outline: none;
            font-size: 0.24rem;
            &.code {
              width: 3.1rem;
            }
          }
          .select {
            width: 100%;
            height: 0.86rem;
            padding: 0 0.4rem;
            font-size: 0.24rem;
            color: #999;
            border: none;
            background: none;
            outline: none;
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
          }
          .select_arr {
            display: block;
            width: 0.38rem;
            height: 0.2rem;
            position: absolute;
            top: 0.36rem;
            right: 0.44rem;
            z-index: 1;
          }
          .code_btn {
            display: block;
            width: 1.7rem;
            height: 0.7rem;
            position: absolute;
            top: 0.08rem;
            right: 0.08rem;
            background: linear-gradient(
              -90deg,
              rgba(255, 142, 0, 1) 0%,
              rgba(255, 72, 0, 1) 100%
            );
            border-radius: 0.35rem;
            color: #fff;
            font-size: 0.24rem;
            text-align: center;
            line-height: 0.7rem;
            &.code_btn_disabled {
              background: #bbb;
            }
          }
        }
        .import_login_btn {
          display: block;
          width: 5.4rem;
          height: 0.91rem;
          background: linear-gradient(
            -90deg,
            rgba(255, 142, 0, 1) 0%,
            rgba(255, 72, 0, 1) 100%
          );
          box-shadow: 0.01rem 0.08rem 0.15rem 0.03rem rgba(196, 67, 47, 0.2);
          color: #fff;
          font-size: 0.3rem;
          text-align: center;
          line-height: 0.9rem;
          border-radius: 0.45rem;
          animation: free_download 0.6s cubic-bezier(0.47, 0, 0.745, 0.715)
            infinite both;
        }
      }
    }
  }
  .planc_info_box {
    .planc_info_title {
      display: block;
      margin: 0 auto;
      &.t1 {
        width: 6.3rem;
        height: 0.44rem;
      }
      &.t2 {
        width: 3.84rem;
        height: 0.43rem;
      }
      &.t3 {
        width: 4.04rem;
        height: 0.43rem;
      }
      &.t4 {
        width: 4.84rem;
        height: 0.44rem;
      }
    }
    .planc_info_subtitle {
      font-size: 0.24rem;
      color: #ff7c00;
      line-height: 0.3rem;
      margin-top: 0.2rem;
      text-align: center;
    }
    .place_info_item {
      display: flex;
      padding: 0.6rem 0;
      border-bottom: 0.02rem dashed #fe763a;
      &:last-child {
        border-bottom: none;
        padding-bottom: 0.1rem;
      }
      .img_box {
        width: 3.12rem;
        height: 3.12rem;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .img_info {
        flex: 1;
        position: relative;
        .img_info_con {
          position: absolute;
          left: 0;
          right: 0.2rem;
          top: 50%;
          transform: translate(0, -50%);
          &.sp {
            left: 0.2rem;
            right: 0;
          }
          h4 {
            color: #ff4153;
            font-size: 0.36rem;
            font-weight: bold;
            line-height: 0.36rem;
            margin-bottom: 0.2rem;
          }
          p {
            font-size: 0.24rem;
            line-height: 0.32rem;
            color: #606060;
          }
        }
      }
    }
    .four_promise {
      padding-top: 0.3rem;
      display: flex;
      &.first {
        padding-top: 0.6rem;
      }
      .promise_item {
        flex: 1;
        margin-left: 0.3rem;
        height: 3.7rem;
        background: #f8f8f8;
        border-radius: 0.1rem;
        padding: 0.2rem 0.2rem 0;
        &:first-child {
          margin-left: 0;
        }
        img {
          display: block;
          width: 1.51rem;
          height: 1.51rem;
          margin: 0 auto;
        }
        h4 {
          font-weight: bold;
          color: #504746;
          line-height: 0.5rem;
          padding: 0.05rem 0 0.1rem;
          text-align: center;
        }
        p {
          color: #6c6c6c;
          font-size: 0.22rem;
          line-height: 0.36rem;
        }
      }
    }
    .certificate {
      display: block;
      width: 6.34rem;
      height: auto;
      margin: 0.5rem auto 0;
    }
    .about_vipx {
      color: #504746;
      font-size: 0.24rem;
      line-height: 0.44rem;
      margin-top: 0.44rem;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.get_title {
  padding: 0.4rem 0 0.2rem;
  line-height: 0.44rem;
  font-size: 0.24rem;
  text-align: center;
  color: #ff4b00;
  font-weight: bold;
}
.getbox {
  margin: 0 0.3rem;
  display: flex;
  .get_item {
    //flex: 1;
    text-align: center;
    width: 33.3%;
    img {
      display: block;
      width: 1.2rem;
      height: 1.26rem;
      margin: 0 auto 0.2rem;
    }
    p {
      line-height: 0.3rem;
      font-size: 0.24rem;
      &.b {
        font-weight: bold;
      }
      &.gray_color {
        color: #666;
      }
    }
  }
}
@keyframes free_download {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
