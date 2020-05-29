<template>
  <div class="complete_content">
    <img src="../../../static/imgs/quiz/complete_foot_bg_left.png" class="foot_bg left_bg">
    <img src="../../../static/imgs/quiz/complete_foot_bg_right.png" class="foot_bg right_bg">
    <div class="complete_main">
      <h4>请完善您的孩子信息</h4>
      <div class="complete_input_item">
        <input type="text" :is-type="englishName" v-model="englishName" placeholder="孩子的英文名" @focus="getErrorFlag(false)" @blur="getErrorFlag(true)" novalidate>
      </div>
      <div class="complete_input_item">
        <input type="text" :is-type="validChinese" :max="6" v-model="chineseName" placeholder="孩子的中文名" @focus="getErrorFlag(false)" @blur="getErrorFlag(true)" novalidate>
      </div>
      <div class="choice_grades">
        <div class="choice_title">孩子的年级</div>
        <div class="choice_subtitle">请选择在读年级。若遇暑假，请填写升学后所在年级</div>
        <div class="grades" v-if="grades.length > 0">
          <a href="javascript:;" v-for="(item, index) in grades" :key="index" :class="{'active':gradeId == item.id}" @click="gradeId=item.id">{{item.name}}</a>
        </div>
      </div>
      <div class="complete_btn_box">
        <p v-if="showError && !validEnglish(englishName).valid">
          {{validEnglish(englishName).msg}}
        </p>
        <p v-else-if="showError && !validChinese(chineseName).valid">
          {{validChinese(chineseName).msg}}
        </p>
        <p v-else-if="showError && errorMsg !== ''">{{errorMsg}}</p>
        <a href="javascript:;" class="complete_btn" 
          :class="{'can_submit': validEnglish(englishName).valid && validChinese(chineseName).valid && Number(gradeId) !== 0}" 
          @click="nextStep">下一步</a>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import {getAllGrades, updateStudent} from '@/api/index.js';
import { goTest } from '@/utils';
import validateMixin from '@/mixins/validateMixin';
import { getItem } from '@/utils/localStorage.js';
export default {
  name: 'quizComplete',
  mixins: [validateMixin],
  data() {
    return {
      grades: [],
      gradeId: 0,
      chineseName: '',
      englishName: '',
      errorMsg: '',
      userInfo: {},
      showError: false,
      testId: 0,
    }
  },
  created() {
    this.getGrades();
  },
  mounted() {
    this.getUserInfo();
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
    getErrorFlag(val) {
      this.showError = val;
      this.errorMsg = '';
    },
    nextStep() {
      if (
        !this.validChinese(this.chineseName).valid ||
        !this.validEnglish(this.englishName).valid
      ) {
        this.showError = true;
        return false;
      }
      if (Number(this.gradeId) === 0) {
        this.showError = true;
        this.errorMsg = '请选择年级';
      }
      if (this.errorMsg && this.showError) {
        return false;
      }
      const data = {
        realname: this.chineseName,
        enname: this.englishName,
        grade_id: this.gradeId,
        operation_type: 1,
      };
      this.$http.put(`${this.apiConfig.host}student/students`, data).then((res) => {
        if (res.error_code !== 0) {
          this.errorMsg = res.error_msg;
          return false;
        }
        this.userInfo = res.data;
        this.$vux.toast.show({
          type: 'success',
          text: '保存成功',
          position: 'middle',
          time: 2000,
          width: '15em',
        });
        this.getTestResult();
      });
    },
    //获取用户信息
    getUserInfo(){
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            this.userInfo = res.data;
            if(res.data.realname){
              this.chineseName = res.data.realname;
            }
            if(res.data.enname){
              this.englishName = res.data.enname;
            }
            this.gradeId = res.data.grade_id;
          }
        });
      }
    },
    //获取是否有测试等级
    getTestResult(){
      this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.userInfo.id}&grade_id=${this.userInfo.grade_id}&level_id=${this.userInfo.level_id}`).then((res) => {
        if (res.data.id) {
          this.testId = res.data.id;
        }
        if (this.testId === 0 || this.userInfo.level_id === 67) {
          goTest(this.userInfo.grade_id, this.userInfo.level_id);
        } else {
          this.$router.push({
            name: 'home',
          });
        }
      });
    }
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
@color-purple: #9A57C8;
@color-yellow: #FFEC17;
.complete_content{
  min-height: 100%;
  position: relative;
  .foot_bg{
    display: block;
    position: absolute;
    &.left_bg{
      width: 6.58rem;
      height: auto;
      left: 0;
      bottom: 0;
    }
    &.right_bg{
      width: 8.98rem;
      height: auto;
      right: 0;
      bottom: 0;
    }
  }
  .complete_main{
    width: 6.8rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
    h4{
      font-size: .4rem;
      line-height: 1;
      color: @color-purple;
      text-align: center;
    }
    .complete_input_item{
      margin-top: .6rem;
      input{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        border: none;
        box-shadow:0 .08rem .32rem 0 rgba(154,87,200,0.4);
        border-radius:.5rem;
        font-size: .32rem;
        font-weight: 400;
        padding: 0 .6rem;
        &::-webkit-input-placeholder{
          color: #B2B7CE;
        }
      }
    }
    .choice_grades{
      margin-top: .5rem;
      .choice_title{
        font-size: .32rem;
        color: #1C223D;
        line-height: .52rem;
      }
      .choice_subtitle{
        color: #B2B7CE;
        font-size: .28rem;
        line-height: .48rem;
      }
      .grades{
        display: flex;
        flex-wrap: wrap;
        a{
          display: block;
          width: 30%;
          margin:.3rem 5% 0 0;
          border: .02rem solid #B2B7CE;
          border-radius: .2rem;
          color: #1C223D;
          font-size: .32rem;
          text-align: center;
          line-height: .8rem;
          &:nth-child(3n){
            margin-right: 0;
          }
          &:hover{
            border-color: @color-purple;
            color: @color-purple;
          }
          &.active{
            background: @color-purple;
            border-color: @color-purple;
            color: @col-white;
          }
        }
      }
    }
    .complete_btn_box{
      margin: 1rem auto 0;
      width: 6rem;
      position: relative;
      p{
        position: absolute;
        width: 100%;
        left: 0;
        top: -.6rem;
        font-size: .28rem;
        text-align: center;
        line-height: .4rem;
        color: red;
      }
    }
    .complete_btn{
      display: block;
      line-height: 1rem;
      background: #EAEAED;
      color: #909090;
      text-align: center;
      border-radius: .5rem;
      font-size: .4rem;
      box-shadow:0 .12rem .36rem 0 rgba(154,87,200,0.6);
      &:hover{
        opacity: .8;
      }
      &.can_submit{
        background: @color-purple; 
        color: @col-white;
      }
    }
  }
}
@media (max-width: 1242PX){
  .complete_content{
    min-height: 100%;
    position: relative;
    .foot_bg{
      display: block;
      position: absolute;
      &.left_bg{
        width: 3.29rem;
        height: auto;
        left: 0;
        bottom: 0;
      }
      &.right_bg{
        width: 4.49rem;
        height: auto;
        right: 0;
        bottom: 0;
      }
    }
    .complete_main{
      width: 5.76rem;
      position: absolute;
      left: 50%;
      top: .6rem;
      transform: translate(-50%, 0);
      h4{
        font-size: .36rem;
        line-height: 1;
        font-weight: bold;
        color: @color-purple;
        text-align: center;
      }
      .complete_input_item{
        margin-top: .5rem;
        height: .9rem;
        box-shadow:0 .1rem .4rem 0 rgba(154,87,200,0.25);
        border-radius:.5rem;
        background: #fff;
        input{
          width: 100%;
          height: .9rem;
          line-height: .9rem;
          border: none;
          font-size: .32rem;
          font-weight: 400;
          padding: 0 .6rem;
          &::-webkit-input-placeholder{
            color: #B2B7CE;
          }
        }
      }
      .choice_grades{
        margin-top: .4rem;
        .choice_title{
          font-size: .32rem;
          color: #1C223D;
          line-height: .52rem;
        }
        .choice_subtitle{
          color: #B2B7CE;
          font-size: .24rem;
          line-height: .44rem;
        }
        .grades{
          display: flex;
          flex-wrap: wrap;
          a{
            display: block;
            width: 31%;
            margin:.3rem 3.5% 0 0;
            border: .02rem solid #B2B7CE;
            border-radius: .1rem;
            color: #1C223D;
            font-size: .32rem;
            text-align: center;
            line-height: .7rem;
            &:nth-child(3n){
              margin-right: 0;
            }
            &:hover{
              border-color: @color-purple;
              color: @color-purple;
            }
            &.active{
              background: @color-purple;
              border-color: @color-purple;
              color: @col-white;
            }
          }
        }
      }
      .complete_btn_box{
        margin: .8rem auto 0;
        width: 5rem;
        position: relative;
        p{
          position: absolute;
          width: 100%;
          left: 0;
          top: -.6rem;
          font-size: .28rem;
          text-align: center;
          line-height: .4rem;
          color: red;
        }
      }
      .complete_btn{
        display: block;
        line-height: .9rem;
        background: #EAEAED;
        color: #909090;
        text-align: center;
        border-radius: .45rem;
        font-size: .36rem;
        box-shadow:0 .12rem .36rem 0 rgba(154,87,200,0.6);
        &:hover{
          opacity: .8;
        }
        &.can_submit{
          background: @color-purple; 
          color: @col-white;
        }
      }
    }
  }
}
</style>
