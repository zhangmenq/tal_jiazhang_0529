<template>
  <div class="profile">
    <div class="profile-wrapper" v-show="!isEdit">
      <div class="item">
        <group>
          <cell title="头像"  class="noborder">
            <div class="avatar" >
              <img v-if="avatar.dataUrl != ''" :src="avatar.dataUrl" >
              <img v-else-if="!avatar.dataUrl && profileParam.avatar" :src="profileParam.avatar_url"/>
              <img v-else src="../../../assets/default-photo.png"/>
            </div>
            <a href="javascript:;" class="upload">
              <input type="file" id="upload-image">
            </a>
          </cell>
          <cell title="姓名" :value="profileParam.realname" @click.native="changeName(1)" is-link></cell>
          <cell title="英文名" :value="profileParam.enname" @click.native="changeName(2)" is-link></cell>
          <cell title="当前年级" :value="profileParam.grade_name"></cell>
          <cell
            title="当前级别" v-if="profileParam.level_name"
            :value="profileParam.grade_name_en + profileParam.level_name">
          </cell>
          <cell
            title="当前级别" v-else
            value="无级别"
            @click.native="gotoTest()">
          </cell>
        </group>
      </div>
      <div class="item">
        <group>
          <selector title="性别" :options="sexList"  v-model="profileParam.sex" class="noborder"></selector>
        </group>
        <group>
          <datetime
            v-model="birthday"
            start-date=""
            format="YYYY-MM-DD"
            end-date="2017-12-31"
            title="出生日期">
          </datetime>
        </group>
        <group class="address">
          <cell title="所在地区"
            is-link
            v-model="selectCities"
            @click.native="selectCity()"></cell>
        </group>
      </div>
      <div class="item long-title">
        <group>
          <selector
            title="孩子偏爱老师的性别"
            v-model="profileParam.prefer_sex"
            :options="preferSex">
          </selector>
        </group>
        <group>
          <cell title="孩子偏爱老师的教学特点"
            is-link
            v-model="teaching"
            @click.native="showPrefer()"></cell>
        </group>
        <popup v-model="preferPop">
          <div class="prefer-trait">
            <h2>孩子偏爱老师教学特点</h2>
            <p class="tips">可选择多个哦</p>
            <div class="trait-type">
              <span :class="{'selected': showTeaching.indexOf(index + 1) > -1}"
                v-for="(item, index) in teacherTeams"
                :key="index"
                @click="selectTeaching(index + 1)">{{item}}
              </span>
            </div>
            <button @click="saveTeaching()">保存</button>
          </div>
        </popup>
      </div>
      <x-button
        class="btn-save"
        :class="{'active': checkUpload()}"
        @click.native="save()">
        保存
      </x-button>
    </div>
    <div class="profile-child" v-show="isEdit">
      <group>
        <x-input
          v-if="nameType === 1"
          v-model="profileParam.realname"
          :is-type="validChinese"
          @on-focus="getErrorFlag(false)"
          @on-blur="getErrorFlag(true)"
          text-align="center"
          id="aa"
          :max="6"
          novalidate>
        </x-input>
      </group>
      <group>
        <x-input
          v-if="nameType === 2"
          v-model="profileParam.enname"
          :is-type="validEnglish"
          @on-focus="getErrorEnFlag(false)"
          @on-blur="getErrorEnFlag(true)"
          text-align="center"
          :max="20"
          novalidate>
        </x-input>
      </group>
      <p class="error-tips" v-if="showError && !validChinese(profileParam.realname).valid"><icon type="info"></icon>{{validChinese(profileParam.realname).msg}}</p>
      <p class="error-tips" v-if="showEnError && !validEnglish(profileParam.enname).valid"><icon type="info"></icon>{{validEnglish(profileParam.enname).msg}}</p>
      
      <x-button
        class="btn-save"
        :class="{'active': (showError || showEnError) && (validChinese(profileParam.realname).valid || validEnglish(profileParam.enname).valid)}"
        @click.native="next">
        确定
      </x-button>
    </div>
  </div>
</template>
<script>
import { Selector, Group, Cell, Datetime, XButton, XInput, Icon, Popup } from 'vux';
import validateMixin from '@/mixins/validateMixin';
import Picker from '@/utils/picker/picker.js';
import areas from '@/utils/areas.js';
import { setApilog } from '@/api';
import { goTest } from '@/utils';

export default {
  components: {
    Selector,
    Group,
    Cell,
    Datetime,
    XButton,
    XInput,
    Icon,
    Popup,
  },
  mixins: [validateMixin],
  data() {
    return {
      isEdit: false,
      showError: false,
      showEnError: false,
      nameType: '',
      sexList: [
        { key: '0', value: '未设置' },
        { key: '1', value: '男' },
        { key: '2', value: '女' },
      ],
      cityId: 3,
      profileParam: {},
      birthday: '2010-01-01',
      avatar: {
        uploadUrl: '',
        dataUrl: '',
      },
      timer: '',
      selectCities: '北京市 市辖区 东城区',
      preferSex: [
        { key: '0', value: '孩子偏爱老师的性别' },
        { key: '3', value: '不限' },
        { key: '1', value: '男' },
        { key: '2', value: '女' },
      ],
      preferPop: false, // 教师特点状态
      teacherTeams: [],
      preferTeaching: [], //提交的老师特点
      showTeaching: [], //展示的老师特点
    };
  },
  computed: {
    testRoute() {
      const userId = this.profileParam.id;
      const gradeId = this.profileParam.grade_id;
      const params = btoa(`student_id=${userId}&grade_id=${gradeId}`);
      return `${this.apiConfig.test_host}/${params}`;
    },
    teaching() {
      if (this.preferTeaching.length > 0) {
        let str = '';
        this.preferTeaching.forEach((key) => {
          if (this.teacherTeams[key - 1]) {
            str += `${this.teacherTeams[key - 1]}  `;
          }
        });
        return str;
      }
      return '请选择';
    },
  },
  /* eslint-disable */
  methods: {
    //去做入学测
    gotoTest() {
      const gradeId = this.profileParam.grade_id || 0;
      const levelId = this.profileParam.level_id || 0;
      goTest(gradeId, levelId);
    },
    showPrefer() {
      this.showTeaching = [];
      if (this.preferTeaching.length > 0) {
        this.preferTeaching.map((item) => {
          this.showTeaching.push(item);
        })
      }
      this.preferPop = true;
    },
    selectTeaching(index) {
      if (this.showTeaching.indexOf(index) > -1) {
        this.showTeaching.splice(this.showTeaching.indexOf(index), 1);
      } else {
        this.showTeaching.push(index);
      }
    },
    saveTeaching() {
      this.preferTeaching = this.showTeaching;
      this.preferPop = false;
    },
    selectCity() {
      new Picker({
        title: '',
        defaultValue: this.selectCities,
        type: 3,
        data: areas,
        keys: {
          id: 'id',
          value: 'name',
          childData: 'childData',
        },
        callBack: (item) => {
          this.selectCities = '';
          this.cityId = 3;

          if (Array.isArray(item)) {
            item.forEach((city) => {
              this.selectCities += city.name + ' ';
              this.cityId = city.id;
            });
          }
        },
      });
    },
    changeName(param) {
      this.nameType = param;
      this.isEdit = !this.isEdit;
    },
    getErrorFlag(val) {
      this.showError = val;
    },
    getErrorEnFlag(val){
       this.showEnError = val;
    },
    next() {
      if (
        !this.validChinese(this.profileParam.realname).valid ||
        !this.validEnglish(this.profileParam.enname).valid
      ) {
        return false;
      }
      this.isEdit = !this.isEdit;
    },
    save() {
      const cityArr = this.selectCities.split(' ');
      if (cityArr.length < 3) {
        this.$vux.toast.show({
          type: 'warn',
          time: 2000,
          isShowMask: true,
          position: 'middle',
          text: '【所在地区】填写有误，需要重新选择',
          width: '17.6em',
        });
        return;
      }
      if (this.avatar.dataUrl && !this.avatar.uploadUrl) {
        return false;
      }

      const data = {
        realname: this.profileParam.realname,
        enname: this.profileParam.enname,
        sex: this.profileParam.sex,
        birthday: this.birthday || '',
        area_id: String(this.cityId),
        operation_type: 2,
        prefer_sex: this.profileParam.prefer_sex,
        prefer_teaching: JSON.stringify(this.preferTeaching),
      };
      if (this.avatar.uploadUrl) {
        data.avatar = this.avatar.uploadUrl;
      }
      this.$http.put(`${this.apiConfig.host}student/students`, data).then((response) => {
        if (response.error_code !== 0) {
          this.$vux.toast.show({
          type: 'text',
          text: response.error_msg,
          time: 2000,
          width: '50%',
        });
          return false;
        }
        this.$vux.toast.show({
          type: 'text',
          text: '保存成功',
          time: 1500,
          width: '50%',
        });
        this.timer = setTimeout(() => {
          this.$router.replace({
            name: 'mine',
          });
        }, 1500);
      });
    },
    getProfile() {
      this.$http.get(`${this.apiConfig.host}user/users/me`).then((response) => {
        if (response.error_code === 0) {
          this.profileParam = response.data;
          if (this.profileParam.area_name) {
            this.selectCities = this.profileParam.area_name.replace(/,/g, ' ');
            this.cityId = this.profileParam.area_id;
          }
          if (this.profileParam.birthday) {
            this.birthday = this.profileParam.birthday;
          }
          if (this.profileParam.teacher_teams) {
            this.teacherTeams = this.profileParam.teacher_teams;
            this.teacherTeams = Object.keys(this.teacherTeams).map((k) => this.teacherTeams[k]);
          }

          if (this.profileParam.prefer_teaching) {
            this.preferTeaching = JSON.parse(this.profileParam.prefer_teaching);
          }
        }
      });
    },
    upload(evt) {
      const file = evt.target.files[0];
      //处理预览
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatar.dataUrl = reader.result;
      };

      const formData = new FormData();
      formData.append('input_name', file);
      this.$http.post(`${this.apiConfig.host}system/upload`, formData, {
        headers: { 'content-type': 'multipart/form-data' },
      }).then((res) => {
        if (res.error_code !== 0) {
          this.$vux.toast.show({
            time: 1500,
            type: 'warn',
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
          });
        } else {
          this.avatar.uploadUrl = res.data;
        }
      });
    },

    checkUpload() {
      if (this.avatar.dataUrl && !this.avatar.uploadUrl) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.getProfile();
    this.$nextTick(()=> {
       const fileChooser = document.getElementById('upload-image');
        fileChooser.addEventListener('change', this.upload, false);
    })
    setApilog({
      event_type: 70006,
      route: '/mine/set',
    });
  },
  beforeRouterLeave(to, from, next) {
    clearTimeout(this.timer);
    this.$vux.toast.hide();
    next();
  },
};
</script>
<style lang="less">
  @import '../../../styles/basic.less';

  .profile{
    min-height: 100%;
    padding: .2rem;
    background-color: @col-bg;
    .item{
      margin-bottom: .2rem;
      border-radius: .08rem;
      background: #fff;
      .avatar{
        margin: .1rem auto;
        .wh(.9rem,.9rem);
        border-radius: 100%;
        img{
          .wh-img;
          border-radius: 100%;
        }
      }
      &.long-title {
        .weui-label {
          width: 3rem;
        }
        .weui-cell__ft{
          width: 45%;
          padding-right: .35rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .prefer-trait{
          background: @col-white;
          text-align: center;
          h2{
            padding: .48rem 0 0 0;
            font-size: .34rem;
            color: #1B223F;
            margin: 0;
          }
          .tips{
            font-size: .26rem;
            color: @col-gray;
          }
          .trait-type{
            width: 6.36rem;
            margin: 0 auto;
            span{
              display: inline-block;
              .wh(1.7rem, .72rem);
              background: #F2F4F7;
              font-size: .3rem;
              color: @col-gray;
              line-height: .72rem;
              border-radius: .36rem;
              margin: .4rem .16rem 0;
              &.selected{
                background: rgba(154,87,200,0.3);
                color: @col-light-purple;
              }
            }
          }
          button{
            .wh(100%, .9rem);
            background: @col-light-purple;
            font-size: .36rem;
            color: @col-white;
            line-height: .9rem;
            margin: .89rem 0 0;
          }
        }
      }
    }
    .address .weui-cell__ft{
      width: 70%;
      padding-right: .1rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .weui-cells{
      margin: 0;
      border-radius: .08rem;
      font-size: .3rem;
      &:before,&:after{
        border: none;
      }
      .weui-cell{
        position: relative;
        padding: 0 .2rem;
        line-height: .9rem;
        &:before,&:after{
          border: none;
        }
        &:after{
          content: '';
          position: absolute;
          left: 2%;
          top: 0;
          .wh(96%,.01rem);
          background: @col-border;
        }
      }
      .noborder.weui-cell{
        &:after{
          display: none;
        }
      }
      .weui-select{
        .l-h(.9rem);
        padding-right: 0;
        text-align: right;
        font-size: .3rem;
        direction: rtl;
        color: #999;
        option{
          font-size: .22rem;
        }
      }
      .weui-cell__ft,.weui-cell_select .weui-cell__bd{
        position: relative;
        padding-right: .35rem;
      }
      .vux-x-input{
        padding: 0 .15rem;
        .weui-icon{
          font-size: .24rem;
        }
        .weui-cell__ft{
          padding-right: 0;
        }
      }
      .weui-cell_access .weui-cell__ft:after,.weui-cell_select .weui-cell__bd:after{
        right: .1rem;
        margin-top: -.08rem;
        .wh(.18rem,.18rem);
      }
    }
    .btn-save{
      margin: .8rem auto .2rem;
      width: 76.8%;
      border-radius: .08rem;
      background: @col-gray;
      font-size: .36rem;
      color: #fff;
      &.active{
        .btn-purple;
      }
      &.weui-btn_default:not(.weui-btn_disabled):active{
        color: #fff;
      }
    }
    .error-tips{
      margin-top: .2rem;
      padding: 0 .3rem;
      font-size: .24rem;
      color: @col-gray;
      .weui-icon-info{
        position: relative;
        top: -.02rem;
        font-size: .24rem;
        margin-right: .05rem;
        color: @col-gray;
      }
    }

    .upload input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
    }
  }

</style>
