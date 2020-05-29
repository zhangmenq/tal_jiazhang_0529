<template>
  <div class="report">
    <loading v-if="loading"></loading>
    <div v-else>
      <ul class="report-list" v-if="reportList.length > 0">
        <li v-for="(item,idx) in reportList" :key="idx" @click="goReport(item)">
          <div class="content">
            <h4>{{item.title}}</h4>
            <p>
              <time>{{item.finish_at}}</time>
              <span>{{item.weed}}</span>
            </p>
          </div>
          <x-button class="btn-report">
            报告详情
          </x-button>
        </li>
      </ul>
      <no-content :tips="'抱歉，没有找到您的报告'" :defaultImg="'nofiltrateteacher'" v-else-if="reportList.length <= 0">
      </no-content>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';
import { getUserInfo, getReport, getMyReport, setApilog } from '@/api';
import { Base64 } from 'js-base64';
import Loading from '@/components/loading/Index';
import NoContent from '@/components/common/NoContent';

export default {
  name: 'report',
  data() {
    return {
      loading: false,
      resData: '',
      private: 0, // 个人报告
      composite: 0, // 综合报告
      reportList: {},
      courseId: 0,
      activity: 0,
      type: 0,
    };
  },
  components: {
    XButton,
    Loading,
    NoContent,
  },
  mounted() {
    this.init();
    setApilog({
      event_type: 70013,
      route: '/mine/report',
    });
  },
  methods: {
    goReport(item) {
      this.type = item.type;
      this.courseId = item.course_id ? item.course_id : 0;
      this.activity = item.activity ? item.activity : 0;
      // 1为star测评，2为阶段测试
      if (this.type === 2) {
        // terminal为1指向旧版报告，3指向新版阶段测试报告
        location.href = `/stage/test-report?private=1&student_id=${Base64.encode(this.resData.id)}&terminal=1&course_id=${this.courseId}&activity=${this.activity}`;
      } else if (this.type === 1) {
        location.href = `/mine/star-test?student_id=${Base64.encode(this.resData.id)}`;
      }
    },
    async init() {
      await this.getUserInfor();
      await this.getMyReport();
      await this.checkReport();
    },
    getUserInfor() {
      return getUserInfo().then(() => {
        this.resData = this.$store.state.userInfo;
      });
    },
    // 阶段测-查看是否有报告，个人报告和综合报告
    checkReport() {
      const res = getReport(this.resData.id, 1);
      const ret = getReport(this.resData.id, 2);
      if (res.error_code === 0) {
        this.private = 1;
      }
      if (ret.error_code === 0) {
        this.composite = 1;
      }
    },
    // 查看我的报告（star报告&阶段测报告）
    getMyReport() {
      this.loading = true;
      getMyReport().then((res) => {
        if (res.error_code !== 0) {
          return;
        }
        this.loading = false;
        this.reportList = res.data;
      });
    },
  },
};
</script>

<style lang="less">
  @import "../../../styles/basic.less";
  .report {
    min-height: 100%;
    background: @col-bg;
    .report-list {
      padding: 0.2rem 0.3rem;
      li {
        display: flex;
        justify-content: space-between;
        border-radius: 0.1rem;
        margin-bottom: 0.2rem;
        padding: 0.4rem 0.3rem;
        background: #fff;
        box-shadow: 0 0.02rem 0.04rem 0 rgba(209, 209, 209, 0.5);
        h4 {
          font-size: 0.36rem;
          line-height: 0.5rem;
        }
        p {
          display: flex;
          font-size: 0.3rem;
          line-height: 0.42rem;
          color: @col-gray;
          &:before {
            content: "";
            margin: 0.06rem 0.1rem 0 0;
            .wh(0.3rem, 0.3rem);
            .bg-m("@{img-path}/time-icon.png");
            background-size: 100% 100%;
          }
          time {
            margin-right: 0.1rem;
          }
        }
        .btn-report {
          border-radius: 0.1rem;
          margin: 0.1rem 0 0;
          .wh(1.8rem, 0.7rem);
          line-height: 0.66rem;
          font-size: 0.3rem;
          .btn-plain(@col-light-purple);
          // border-width: 0.02rem;
        }
      }
    }
  }
</style>
