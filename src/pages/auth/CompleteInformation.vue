<template>
  <div class="login-reg" style="overflow:hidden">
    <div class="loginreg-cont">
      <h2>请完善您的孩子信息</h2>
      <div>
        <group>
          <x-input
            v-model="englishName"
            placeholder="孩子的英文名字"
            :max="20"
            :is-type="validEnglish"
            @on-focus="getErrorFlag(false, 'en')"
            @on-blur="getErrorFlag(true, 'en')"
            novalidate>
          </x-input>
        </group>
        <group>
          <x-input
            v-model="chineseName"
            placeholder="孩子的中文名字"
            :max="6"
            :is-type="validChinese"
            @on-focus="getErrorFlag(false, 'cn')"
            @on-blur="getErrorFlag(true, 'cn')"
            novalidate>
          </x-input>
        </group>
        <em class="hint" style="text-align:left">
          请填写2018年9月所升年级。例如：孩子现在在读2年级下学期，则此处年级应选择“3年级”。
        </em>
        <div class="grades" v-if="valueGrade.length > 0">
          <div class="grades-item"
            :class="{'active': gradeId === item.id}"
            v-for="(item, index) in valueGrade" :key="index"
            @click="gradeId = item.id">{{item.name}}</div>
        </div>
        <!-- combutton-active 激活按钮状态 -->
        <div class="execute-button">
          <!-- <p class="wrong" v-if="showError && !validEnglish(englishName).valid">
            {{validEnglish(englishName).msg}}
          </p>
          <p class="wrong" v-else-if="showError && !validChinese(chineseName).valid">
            {{validChinese(chineseName).msg}}
          </p> -->
          <p class="wrong" v-if="showError && errorMsg !== ''">{{errorMsg}}</p>
          <x-button
            class="com-button"
            :class="{'combutton-active':
            validEnglish(englishName).valid &&
            validChinese(chineseName).valid &&
            Number(gradeId) !== 0}"
            @click.native="nextStep()">
            下一步
          </x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { isEmpty } from 'lodash';
import { XInput, Group, XButton, Cell, Selector, Popup } from 'vux';
import { goTest } from '@/utils';
import validateMixin from '@/mixins/validateMixin';
import { getAllGrades } from '@/api/index.js';

export default {
  components: {
    XInput,
    XButton,
    Group,
    Popup,
    Cell,
    Selector,
  },
  mixins: [validateMixin],
  data() {
    return {
      showPop: false,
      traitType: [],
      chineseName: '',
      englishName: '',
      errorMsg: '',
      showError: false,
      gradeId: 0,
      valueGrade: [],
      level_id: 0,
      userInfo: {},
    };
  },
  /* eslint-disable */
  methods: {
    scrollTo() {
      window.scrollTo(0, 0);
    },
    getErrorFlag(val, valType) {
      window.scrollTo(0, 0);
      if (val && valType === 'en' && !this.validEnglish(this.englishName).valid) {
        this.$vux.toast.show({
          type: 'warn',
          text: this.validEnglish(this.englishName).msg,
          position: 'middle',
          time: 2000,
          width: '15em',
        });
        this.englishName = '';
      } else if (val && valType === 'cn' && !this.validChinese(this.chineseName).valid) {
        this.$vux.toast.show({
          type: 'warn',
          text: this.validChinese(this.chineseName).msg,
          position: 'middle',
          time: 2000,
          width: '15em',
        });
        this.chineseName = '';
      }
    },
    nextStep() {
      if (!this.validChinese(this.chineseName).valid) {
        this.errorMsg = this.validEnglish(this.chineseName).msg;
        this.chineseName = '';
        this.showError = true;
        return false;
      }
      if (!this.validEnglish(this.englishName).valid) {
        this.errorMsg = this.validEnglish(this.englishName).msg;
        this.englishName = '';
        this.showError = true;
        return false;
      }
      if (Number(this.gradeId) === 0) {
        this.showError = true;
        this.errorMsg = '请选择年级';
        return false;
      }
      const data = {
        realname: this.chineseName,
        enname: this.englishName,
        grade_id: this.gradeId,
        operation_type: 1,
      };
      this.$http.put(`${this.apiConfig.host}student/students`, data).then((response) => {
        if (response.error_code !== 0) {
          this.errorMsg = response.error_msg;
          return false;
        }
        this.$vux.toast.show({
          type: 'success',
          text: '保存成功',
          position: 'middle',
          time: 2000,
          width: '15em',
        });
        setTimeout(() => {
          if (this.userInfo.level_id === 0) {
            goTest(this.gradeId, this.userInfo.level_id);
          } else {
            this.$router.replace({
              name: 'home',
            });
          }
        }, 2000);
      });
    },

    getUserInfo() {
      this.$http.get(`${this.apiConfig.host}user/users/me`).then((response) => {
        if (response.error_code !== 0) {
          this.errorMsg = response.error_msg;
          return false;
        }
        const info = response.data;
        this.userInfo = response.data;
        if (info === '' || info === null) {
          return;
        }
        this.chineseName = info.realname ? info.realname : '';
        this.englishName = info.enname ? info.enname : '';
        this.gradeId = info.grade_id;
        this.level_id = info.level_id;
        for (let i in info.teacher_teams) {
          this.traitType.push(info.teacher_teams[i]);
        }
      });
    },
    getGrades() {
      getAllGrades().then((res) => {
        if (res.error_code > 0 || res.data.length === 0) {
          return;
        }
        this.valueGrade = res.data;
      });
    }
  },
  mounted() {
    this.getUserInfo();
  },
  created() {
    this.getGrades();
  },
};
</script>
