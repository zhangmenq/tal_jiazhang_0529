<template>
  <div class="home-course">
    <!-- 非注册用户头部跳转 -->
    <div class="head-box" v-if="!newUser">
      <div class="head-ul">
        <div class="head-li" @click="goAdjust">
          <div class="head-adjust"></div>
          <p>调课</p>
        </div>
        <div class="head-li" @click="goTrans">
          <div class="head-trans"></div>
          <p>转班</p>
        </div>
        <div class="head-li" @click="goMyCourse">
          <div class="head-course"></div>
          <p>我的课程</p>
        </div>
       <div class="head-li" @click="goTeachers">
          <div class="head-teacher"></div>
          <p>找老师</p>
        </div>
      </div>
    </div>
    <!-- 近期课程 -->
    <div class="recent" v-if="!newUser">
      <div>
        <p class="recent-title">近期课程</p>
        <p class="title-link" @click="goCourse">课表 ></p>
      </div>
      <ul v-if="!recentLoadingData && recentLists.length">
        <recent-item
          v-for="(item, index) in recentLists"
          :key="index"
          :recentList="item"
          @showAdjust="showAdjust">
        </recent-item>
      </ul>
      <loading v-if="recentLoadingData"></loading>
      <div v-else-if="recentLists.length === 0 && !recentLoadingData" class="no-content">
        <p class="no-content-text">最近没有要上的课程哦~</p>
        <div class="no-content-btn" @click="goMyCourse"><span>查看我的课程</span></div>
      </div>
    </div>
    <!-- 调课 -->
    <adjust-dialog
      v-if="!newUser"
      :show="dialogData.show"
      :changeNum="dialogData.changeNum"
      :tips="dialogTips"
      @onConfirm="confirmAdjust()"
      @onCancel="cancelAdjust()">
    </adjust-dialog>
    <!-- 推荐课程 -->
    <div v-if="lists.length" style="margin-top:.5rem;">
      <p class="title">推荐课程</p>
      <ul v-if="!loadingData && lists.length">
        <course-item
          v-for="(item, index) in lists"
          :key="index"
          :course="item">
        </course-item>
      </ul>
      <loading v-if="loadingData"></loading>
      <no-content
        v-else-if="lists.length === 0 && !loadingData"
        :vertical="false"></no-content>
    </div>
    <!-- 老师偏好 -->
    <prefer v-if="showPrefer" :isShowBottom = 'isShowBottom'></prefer>
  </div>
</template>

<script>
import moment from 'moment';
import courseLists from '@/mixins/courseLists';
import Loading from '@/components/loading/Index';
import RecentItem from '@/components/home/RecentItem';
import CourseItem from '@/components/home/CourseItem';
import AdjustDialog from '@/components/dialog/AdjustDialog';
import Prefer from '@/components/common/Prefer';
import { getItem } from '@/utils/localStorage';
import { setApilog } from '@/api';

export default {
  name: 'normal',
  data() {
    return {
      isShowBottom: true,
      type: 1,
      dialogTips: '注：调课仅变动上课时间或老师，该课次学习内容不变',
      dialogData: {
        show: false,
        changeNum: 3,
      },
      adjustParams: {},
      newUser: true,
      showPrefer: false,
    };
  },
  components: {
    Loading,
    CourseItem,
    RecentItem,
    AdjustDialog,
    Prefer,
  },

  mixins: [courseLists],
  mounted() {
    this.isLogin();
  },
  methods: {
    isLogin() {
      if (getItem('token')) {
        this.$http.get(`${this.apiConfig.host}user/users/me`).then((res) => {
          if (res.error_code === 0) {
            if (res.data.member_level) {
              if (res.data.member_level !== 0) {
                this.newUser = false;
              } else {
                this.newUser = true;
              }
            }
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
    showAdjust(item) {
      this.adjustParams = item;
      this.dialogData.changeNum = this.adjustParams.changeNum;
      this.dialogData.show = true;
    },
    goTime() {
      this.$router.push({
        name: 'adjustTeacher',
        params: {
          courseId: this.adjustParams.courseId,
          scheduleId: this.adjustParams.scheduleId,
        },
        query: {
          teacher_id: this.adjustParams.teacherId,
          change_num: this.adjustParams.changeNum,
          date: moment(this.adjustParams.date).format('YYYY-MM-DD'),
        },
      });
    },
    cancelAdjust() {
      this.dialogData.show = false;
    },
    confirmAdjust() {
      if (this.adjustParams.changeNum === 0) {
        return false;
      }
      this.dialogData.show = false;
      this.goTime();
    },

    goCourse() {
      location.href = '/schedule';
    },
    async goMyCourse() {
      await setApilog({
        event_type: 20015,
        route: '/index',
      });
      await this.$router.push({
        path: '/mine/course',
      });
    },
    async goAdjust() {
      await setApilog({
        event_type: 20013,
        route: '/index',
      });
      await this.$router.push({
        path: '/schedule',
      });
    },
    async goTrans() {
      await setApilog({
        event_type: 20014,
        route: '/index',
      });
      await this.$router.push({
        path: '/mine/course',
      });
    },
    async goTeachers() {
      await setApilog({
        event_type: 20016,
        route: '/index',
      });
      await this.$router.push({
        path: '/teachers',
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false;
    next();
  },
};
</script>

<style lang="less">
  @import '../../styles/basic.less';
  .home-course{
    background: @new-col-white;
    padding: 0.22rem 0.4rem 0.4rem 0.4rem;
    .head-box{
      padding: 0.45rem 0.28rem;
      height: 2.1rem;
      background: @new-col-white;
      box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.1);
      border-radius: 0.12rem;
      margin-bottom: 0.52rem;
      .head-ul{
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        .head-li{
          float:left;
          p{
            text-align: center;
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba(51,51,51,1);
            line-height: 0.33rem;
            margin-top: .1rem;
          }
        }
      }
      .head-adjust{
        .wh(.88rem,.88rem);
        .bg-m('@{img-path}/head-adjus.png');
        background-size: 100% 100%;
      }
      .head-course{
        .wh(.88rem,.88rem);
        .bg-m('@{img-path}/head-course.png');
        background-size: 100% 100%;
      }
      .head-teacher{
        .wh(.88rem,.88rem);
        .bg-m('@{img-path}/head-teacher.png');
        background-size: 100% 100%;
      }
      .head-trans{
        .wh(.88rem,.88rem);
        .bg-m('@{img-path}/head-trans.png');
        background-size: 100% 100%;
      }
    }
    .title{
      height: 0.5rem;
      font-size: 0.36rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: @new-col-title-dark;
      line-height: 0.5rem;
    }
    .recent{
      .recent-title{
        display: inline-block;
        height: 0.5rem;
        font-size: 0.36rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: @new-col-title-dark;
        line-height: 0.5rem;
      }
      .title-link{
        display: inline-block;
        // width:48px;
        height:0.5rem;
        font-size:0.28rem;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color: @new-col-title-dark;
        line-height:0.5rem;
        position: absolute;
        right: 0.4rem;
      }
    }
    .no-content{
      height: 3.4rem;
      background: @new-col-bg-white;
      box-shadow: 0px 2px 4px 0px rgba(136,73,248,0.11), 0px 1px 3px 0px rgba(255,255,255,0.46);
      border-radius: 0.08rem;
      margin-top: 0.4rem;
      .no-content-text{
        padding: 1.07rem 0 0.6rem 0;
        text-align: center;
        font-size: 0.32rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #999;
        line-height: 0.45rem;
      }
      .no-content-btn{
        height: 0.6rem;
        background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
        border-radius: 0.3rem;
        width: 2.46rem;
        margin: auto;
        text-align: center;
        span{
          height: 0.6rem;
          font-size: 0.28rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: @new-col-white;
          line-height: 0.6rem;
        }
      }
    }
  }
</style>
