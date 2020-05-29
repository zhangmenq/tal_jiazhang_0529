<template>
  <div class="test-record">
    <div class="current-level">
      当前级别
      <h1>
        {{userInfo.level_id != 67 ? (userInfo.grade_name_en + '-' + userInfo.level_name) : '无级别'}}
        <!-- <span>?</span> -->
      </h1>
    </div>
    <div class="test-record-content">
      <h2>测试记录</h2>
      <ul class="list" v-if="recordLists.length">
        <li v-for="item in recordLists" :key="item.id">
          <span>{{ item.created_at | formatDate('YYYY-MM-DD') }}  周{{item.week}}</span>
          <span>测试级别：{{ item.gradeLevel }}</span>
          <x-button class="look-details" @click.native="testDetails(item.grade_id, item.level_id)">查看详情</x-button>
        </li>
      </ul>
      <no-content tips="还没有参加过测试哦~" :vertical='false' v-if="recordLists.length === 0 && hasRequest">
      </no-content>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';
import NoContent from '@/components/common/NoContent';
import { getUserInfo, getTestRecord } from '@/api';
import { formatDate } from '@/filters';
import { goTest } from '@/utils';

export default {
  name: 'testRecord',
  components: {
    XButton,
    NoContent,
  },
  data() {
    return {
      userInfo: {},
      recordLists: [],
      hasRequest: false,
      testId: 0,
    };
  },
  filters: { formatDate },
  methods: {
    testDetails(gradeId, levelId) {
      goTest(gradeId, levelId);
    },
  },
  async mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await getUserInfo().then(() => {
      this.userInfo = this.$store.state.userInfo;
      this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.userInfo.id}&grade_id=${this.userInfo.grade_id}&level_id=${this.userInfo.level_id}`).then((res) => {
        if (res.data.id) {
          this.testId = res.data.id;
        }
      });
    });
    await getTestRecord().then((res) => {
      this.hasRequest = true;
      if (res.error_code === 0) {
        this.recordLists = res.data;
      }
    });
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.test-level{
  background: @col-bg;
  height: 100%;
  padding: 3.2rem .87rem 0 .87rem;
  text-align: center;
  position: relative;
  p.text{
    font-size: .3rem;
    color: @col-gray;
    padding: 0 0 1.7rem 0;
  }
  .weui-btn{
    height: .9rem;
    font-size: .36rem;
    border-radius: .1rem;
    .btn-purple;
  }
  .service-tel{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
.test-record{
  min-height: 100%;
  .bg-m('@{img-path}/level-record-bg.jpg');
  background-color: @col-bg;
  background-size: 100% auto;
  .current-level{
    color: @col-white;
    text-align: center;
    font-size: .3rem;
    padding: .6rem 0;
    h1{
      font-size: .6rem;
      margin-top: .58rem;
      span{
        .wh(.3rem,.3rem);
        display: inline-block;
        background: @col-white;
        border-radius: 100%;
        vertical-align: middle;
        margin: 0 0 0 .3rem;
        color: @col-purple;
        font-size: .2rem;
      }
    }
  }
  .test-record-content{
    background: @col-white;
    margin: 0 .2rem;
    border-radius: .1rem;
    border-bottom: .1rem solid @col-purple;
    padding: .4rem;
    li{
      font-size: .26rem;
      display: flex;
      margin: 0 0 .3rem 0;
      justify-content: space-between;
      span{
        display: block;
      }
      .look-details{
        display: block;
        .wh(1.3rem,.5rem);
        border-radius: .25rem;
        font-size: .26rem;
        line-height: .45rem;
        color: @col-purple;
        padding: 0;
        margin: 0;
        border: .015rem solid @col-purple;
      }
    }
    h2{
      text-align: center;
      font-size: .36rem;
      margin-bottom: .7rem;
    }
  }
}
</style>
