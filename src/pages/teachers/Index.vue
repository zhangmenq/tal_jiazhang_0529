<template>
  <div class="teachers">
      <!-- 筛选 -->
      <div class="teacher-position">
        <div class="teachers-filter">
          <div class="filter-title filter-all" :class="{'selected': isShowAll}" @click="showAll">全部</div>
          <div class="filter-title filter-part" @click="showSex">{{sexValue}}<span class="icon" :class="{'select': popupSex}"></span></div>
          <div class="filter-title filter-part" @click="showAge">{{ageValue}}<span class="icon" :class="{'select': popupAge}"></span></div>
          <div class="filter-title filter-character" @click="showCharacter">教学特点<span class="icon" :class="{'select': popupCharacter}"></span></div>
          <div class="filter-search" @click="openSearch"><span class="search-icon"></span></div>
        </div>
      </div>
      <!-- popup -->
      <div v-if="showSexPopup">
        <div class="teacher-mask" @click="maskClose"></div>
        <div v-show="popupSex" class="pop">
          <span
            class="pop-span"
            v-for="(item,index) in sexList"
            :class="{'pop-span-slected': index==sexIdx}"
            :key="index"
            @click="chooseSex(index)">
            <span class="pop-text" :class="{'pop-text-slected': index==sexIdx}">{{item}}</span>
          </span>
        </div>
      </div>
      <div v-if="showAgePopup">
        <div class="teacher-mask" @click="maskClose"></div>
        <div v-show="popupAge" class="pop">
          <span
            class="pop-span"
            v-for="(item,index) in ageList"
            :class="{'pop-span-slected': index==ageIdx}"
            :key="index"
            @click="chooseAge(index)">
            <span class="pop-text" :class="{'pop-text-slected': index===ageIdx}">{{item}}</span>
          </span>
        </div>
      </div>
      <div v-if="showChaPopup">
        <div class="teacher-mask" @click="maskClose"></div>
        <div v-show="popupCharacter" class="pop">
          <span
            class="pop-span"
            v-for="(item,index) in characterList"
            :class="{'pop-span-slected': teams.indexOf(index+1) > -1}"
            :key="index"
            @click="chooseCharacter(item,index+1)">
            <span class="pop-text" :class="{'pop-text-slected': teams.indexOf(index+1) > -1}">{{item}}</span>
          </span>
          <div class="pop-btn">
            <span class="cancle-btn" @click="cancle">取消</span>
            <span @click="confirm">确认</span>
          </div>
        </div>
      </div>
      <!-- 搜索页 -->
      <!-- <popup  position="right" width="100%" v-model="showSearch">
        <label for="search" class="searching-box">
            <span class="searching-icon"></span>
            <form @submit.prevent="formSubmit" action="javascript:return true">
              <input @keypress="seachingList" type="search" id="searchName" v-model="change" placeholder="请输入老师姓名查找">
              <input type="button" value="搜索" id="searchTabBtn" class="searchBtn" @click="seachingCancle">
            </form>
        </label>
        <div v-if="teachersList.length>0" class="teacherNameList">
          <teachers-list
            v-for="(item,index) in teacherNameList"
            :key="index"
            :teachersList="item">
          </teachers-list>
        </div>
        <div class="load">
          <div class="load-more" v-show="showMore" @click="getMoreName">加载更多</div>
          <load-more tip="加载中..." v-show="isLoad"></load-more>
          <div class="load-fail" v-show="isFail" @click="getAgainName">加载失败，请重试</div>
          <load-more :show-loading="false" tip="没有更多内容了" background-color="#fbf9fe" v-show="isEnd"></load-more>
        </div>
      </popup> -->
      <div class="title">共<span>{{teacherCount}}</span>位老师</div>
      <!-- 老师列表 -->
      <div v-if="teachersList.length>0" class="teacherList">
        <teachers-list
          v-for="(item,index) in teachersList"
          :key="index"
          :teachersList="item">
        </teachers-list>
      </div>
      <!-- 加载 -->
      <div class="load">
        <div class="load-more-teacher" v-show="showMore" @click="getMore">加载更多</div>
        <!-- <load-more tip="加载中..." v-show="isLoad"></load-more> -->
        <Loading v-if="isLoad"></Loading>
        <div class="load-fail" v-show="isFail" @click="getAgain">加载失败，请重试</div>
        <load-more :show-loading="false" tip="没有更多内容了" background-color="#fbf9fe" v-show="isEnd"></load-more>
      </div>
      <!-- 老师偏好 -->
      <prefer v-if="showPrefer" :isShowBottom = 'isShowBottom'></prefer>
  </div>
</template>

<script>
import { getTeachers } from '@/api';
import TeachersList from '@/components/common/TeachersList';
import { LoadMore, Popup } from 'vux';
import Prefer from '@/components/common/Prefer';
import { getItem } from '@/utils/localStorage';
import Loading from '@/components/loading/Index';

export default {
  components: {
    TeachersList,
    LoadMore,
    Popup,
    Prefer,
    Loading,
  },
  data() {
    return {
      isShowBottom: false,
      teacherCount: '',
      teachersList: [],
      teacherNameList: [],
      // 请求参数
      page: 1,
      sex: '',
      teachingAge: '',
      teams: [],
      name: '',
      // 加载
      showMore: false,
      isLoad: true,
      isFail: false,
      isEnd: false,
      // popup
      showSexPopup: false,
      showAgePopup: false,
      showChaPopup: false,
      // 搜索
      showSearch: false,
      // 全部
      isShowAll: false,
      popupSex: false,
      popupAge: false,
      popupCharacter: false,
      // 偏好
      characterList: ['耐心亲和', '活泼开朗', '经验丰富', '善于引导', '善于纠错', '善于拓展'],
      ageList: ['不限', '3年以下', '3年及以上', '5年及以上', '8年及以上', '10年及以上'],
      ageNameList: ['不限', '3年以下', '3年以上', '5年以上', '8年以上', '10年以上'],
      sexList: ['不限', '男', '女'],
      sexIdx: -1,
      ageIdx: -1,
      // 搜索框变化
      change: '',
      // 偏好显示
      showPrefer: false,
    };
  },
  computed: {
    sexValue() {
      if (this.sexIdx > 0) {
        return this.sexList[this.sexIdx];
      }
      return '性别';
    },
    ageValue() {
      if (this.ageIdx > 0) {
        return this.ageNameList[this.ageIdx];
      }
      return '教龄';
    },
  },
  watch: {
    change: function () {
      document.getElementById('searchTabBtn').value = '取消';
    },
  },
  methods: {
    initDefault() {
      this.sex = '';
      this.teachingAge = '';
      this.sexIdx = -1;
      this.ageIdx = -1;
      this.teams = [];
      this.page = 1;
    },
    initPop() {
      this.showSexPopup = false;
      this.showAgePopup = false;
      this.showChaPopup = false;
      this.popupSex = false;
      this.popupAge = false;
      this.popupCharacter = false;
    },
    getTeachers() {
      return getTeachers(this.page, this.sex, this.teachingAge, this.teams, this.name).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.teacherCount = res.data.total;
        if (res.data.data.length < 10) {
          this.isEnd = true;
          this.showMore = false;
        } else {
          this.showMore = true;
          this.isEnd = false;
        }
        this.teachersList = [...this.teachersList, ...res.data.data];
        this.isLoad = false;
      }).catch(() => {
        this.isLoad = false;
        this.isFail = true;
      });
    },
    // 按名字查询
    getNameTeacher() {
      return getTeachers(this.page, this.sex, this.teachingAge, this.teams, this.name).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        if (res.data.data.length < 10) {
          this.isEnd = true;
          this.showMore = false;
        } else {
          this.showMore = true;
          this.isEnd = false;
        }
        this.teacherNameList = [...this.teacherNameList, ...res.data.data];
        this.isLoad = false;
      }).catch(() => {
        this.isLoad = false;
        this.isFail = true;
      });
    },
    getMoreName() {
      this.page += 1;
      this.isLoad = true;
      this.showMore = false;
      this.getNameTeacher();
    },
    getAgainName() {
      this.isLoad = true;
      this.isFail = false;
      this.getNameTeacher();
    },
    getMore() {
      this.page += 1;
      this.isLoad = true;
      this.showMore = false;
      this.getTeachers();
    },
    getAgain() {
      this.isLoad = true;
      this.isFail = false;
      this.getTeachers();
    },
    showAll() {
      this.isShowAll = true;
      // 清楚筛选数据
      this.teachersList = [];
      this.initDefault();
      this.initPop();
      this.getTeachers();
    },
    showSex() {
      this.showSexPopup = !this.showSexPopup;
      this.popupSex = !this.popupSex;
      this.popupAge = false;
      this.popupCharacter = false;
      this.showAgePopup = false;
      this.showChaPopup = false;
      this.isShowAll = false;
    },
    showAge() {
      this.showAgePopup = !this.showAgePopup;
      this.popupAge = !this.popupAge;
      this.popupCharacter = false;
      this.popupSex = false;
      this.showSexPopup = false;
      this.showChaPopup = false;
      this.isShowAll = false;
    },
    showCharacter() {
      this.showChaPopup = !this.showChaPopup;
      this.popupCharacter = !this.popupCharacter;
      this.popupSex = false;
      this.popupAge = false;
      this.showSexPopup = false;
      this.showAgePopup = false;
      this.isShowAll = false;
    },
    maskClose() {
      this.initPop();
      this.isShowAll = false;
    },
    openSearch() {
      // this.showSearch = true;
      this.showMore = false;
      this.$router.push({
        name: 'teachersSearch',
      });
    },
    seachingCancle() {
      const value = document.getElementById('searchTabBtn').value;
      if (value === '搜索') {
        document.getElementById('searchName').focus();
      } else {
        location.reload();
      }
    },
    formSubmit() {
      return false;
    },
    seachingList(event) {
      if (event.keyCode === 13) {
        this.teacherNameList = [];
        event.preventDefault();
        const searchVal = event.target.value;
        if (searchVal === '' || searchVal === null) {
          // eslint-disable-next-line
          alert('搜索内容不能为空');
        } else {
          this.name = document.getElementById('searchName').value;
          this.sex = '';
          this.teachingAge = '';
          this.teams = [];
          this.page = 1;
          this.getNameTeacher();
        }
      }
    },
    chooseSex(index) {
      this.sexIdx = index;
      this.sex = index;
      this.maskClose();
      this.teachersList = [];
      this.page = 1;
      this.getTeachers();
    },
    chooseAge(index) {
      this.teachingAge = index;
      this.ageIdx = index;
      this.maskClose();
      this.teachersList = [];
      this.page = 1;
      this.getTeachers();
    },
    chooseCharacter(item, index) {
      if (this.teams.indexOf(index) > -1) {
        this.teams.splice(this.teams.indexOf(index), 1);
      } else {
        this.teams.push(index);
      }
    },
    confirm() {
      this.maskClose();
      this.teachersList = [];
      this.page = 1;
      this.getTeachers();
    },
    cancle() {
      this.maskClose();
      this.teams = [];
    },
    newPrefer() {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            if (res.data.prefer_teaching === null) {
              this.showPrefer = true;
            } else {
              this.showPrefer = false;
            }
          } else {
            console.log('请求失败');
          }
        });
      } else {
        console.log('no token');
      }
    },
  },
  mounted() {
    this.getTeachers();
    this.newPrefer();
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.teachers{
  .teacher-position{
    position: fixed;
    width: 100%;
    background: @new-col-white;
    z-index: 500;
  }
  .teachers-filter {
    display: flex;
    padding: 0.12rem 0.32rem 0.3rem 0.32rem;
    box-shadow: 0px 0px 5px 0px rgba(193,193,193,0.15);
    height: 0.9rem;
    .filter-title{
      font-size:0.34rem;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color: @new-col-title-dark;
      line-height:0.48rem;
      .icon{
        display: inline-block;
        width: 0.1rem;
        height: 0.2rem;
        .bg-m('@{img-path}edit_address_ico.png');
        background-size: 100% 100%;
        transform: rotate(90deg);
        margin-left: 0.11rem;
      }
      .select{
        transform: rotate(-90deg);
      }
    }
    .filter-all{
      width: 0.68rem;
      margin-right: 0.39rem;
    }
    .filter-part{
      // width: 0.89rem;
      margin-right: 0.39rem;
    }
    .filter-character{
      width: 1.6rem;
    }
    .selected{
      color: @new-col-purple;
    }
    .filter-search{
      margin-top: 0.11rem;
      width: 0.27rem;
      height: 0.27rem;
      .search-icon{
        .bg-m('@{img-path}sousuo.png');
        background-size: 100% 100%;
        display: inline-block;
        width: 0.27rem;
        height: 0.27rem;
        position: absolute;
        right: 0.32rem;
      }
    }
  }
  .title{
    margin: 0 0.4rem;
    padding: 1.22rem 0 0.14rem 0rem;
    font-size: 0.32rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: @new-col-black;
    line-height: 0.45rem;
    span{
      color: @new-col-purple;
    }
  }
  .teacherList{
    margin-bottom: 0.05rem;
  }
  .load{
    color: #b2b7ce;
    padding-bottom: 1rem;
    text-align: center;
  }
  .teacher-mask{
    position: fixed;
    z-index: 500;
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    top: 0.9rem;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .pop{
    position: fixed;
    z-index: 500;
    width:100%;
    background:@new-col-white;
    top:0.9rem;
    padding: 0.3rem 0.1rem 0 0.4rem;
    min-height: 1.38rem;
    .pop-span{
      margin: 0 0.21rem 0.3rem 0;
      min-width: 1.5rem;
      padding: 0.2rem 0.45rem;
      height: 0.79rem;
      background: @new-col-bg-gray;
      border-radius: 0.1rem;
      display: inline-block;
      text-align: center;
      .pop-text{
        height: 0.42rem;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: @new-col-title-dark;
        line-height: 0.42rem;
      }
    }
    .pop-span-slected{
      background: @new-col-purple;
      .pop-text-slected{
        color: @new-col-white;
      }
    }
    .pop-btn{
      border-top: 1px solid @new-col-line-gray;
      display: flex;
      span{
        display: inline-block;
        flex: 1;
        text-align: center;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: @new-col-purple;
        line-height: 0.45rem;
        padding: 0.19rem 0 0.24rem 0;
      }
      .cancle-btn{
        border-right: 1px solid @new-col-line-gray;
      }
    }
  }
  .vux-popup-dialog{
    background: @new-col-white;
  }
  .searching-box{
    width: 100%;
    height: 0.9rem;
    display: inline-block;
    box-shadow: 0px 0px 5px 0px rgba(193,193,193,0.15);
    #searchName{
      margin: 0.15rem 0.4rem;
      width: 5.79rem;
      height: 0.6rem;
      background: @new-col-line-gray;
      border-radius: 0.3rem;
      border: 2px solid @new-col-line-gray;
      padding-left: 0.63rem;
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @new-col-gray;
      line-height: 0.4rem;
    }
    .searchBtn{
      height: 0.4rem;
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @new-col-purple;
      line-height: 0.4rem;
    }
    .searching-icon{
      .bg-m('@{img-path}sousuo.png');
      background-size: 100% 100%;
      display: inline-block;
      width: 0.27rem;
      height: 0.27rem;
      position: absolute;
      top: 0.3rem;
      left: 0.6rem;
    }
  }
  input[type=search]{
    border: 0px solid #EFEEF2;
    outline: none;
  }
  input[type=search]::-webkit-search-cancel-button{
    -webkit-appearance: none;
  }
}
.load-more-teacher{
  margin: .4rem auto 0;
  width: 1.7rem;
  line-height: .6rem;
  border: .02rem solid @new-col-purple;
  color: @new-col-purple;
  border-radius: .3rem;
  text-align: center;
  background: #fff;
  font-size: .28rem;
}
</style>


