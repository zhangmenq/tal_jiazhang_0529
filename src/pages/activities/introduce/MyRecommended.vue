<template>
  <div style="height:100%">
    <Loading v-if="loading" loadingText="加载中"></Loading>
    <div class="my-recommended" v-else>
      <div class="rewards-cards">
        <h2>总奖励优惠券
          <strong>￥{{statisticData ? statisticData.coupon_num : 0}}</strong>
          <em @click="popUp = true">奖励说明&gt;</em>
        </h2>
      </div>
      <ul class="statistics">
        <li>
          <span>已领取诊断课</span>
          <strong>{{statisticData ? statisticData.exp_num : 0}}</strong>
        </li>
        <li>
          <span>已付费正式课</span>
          <strong>{{statisticData ? statisticData.major_num : 0}}</strong>
        </li>
        <li>
          <span>已过退费期</span>
          <strong>{{statisticData ? statisticData.refund_num : 0}}</strong>
        </li>
      </ul>
      <div v-if="!isEmpty">
        <h2 class="recommended-title">被推荐人列表</h2>
        <div class="recommended-list">
          <scroll-data
            v-if="!loadingData"
            :lists="introduceList"
            :busy="busy"
            :distance="120"
            :total="total"
            :currentPage="currentPage"
            listType="recommended"
            @loadMore="loadMore">
          </scroll-data>
          <loading v-else></loading>
        </div>
      </div>
      <div class="no-recommended" v-else>
        <span class="icon-img"></span>
        邀请好友 赢取奖励
        <!-- <x-button @click.native="toPosterpage()">立即邀请</x-button> -->
      </div>
      <pop-up v-show="popUp" popType="rewards" @close="popUp = false"></pop-up>
    </div>
  </div>
</template>
<script>

import infiniteScroll from 'vue-infinite-scroll';
import LoadMore from '@/components/loadmore/Index';
import wechatMenu from '@/mixins/wechatMenu.js';
import Loading from '@/components/loading/Index';
import ScrollData from '@/components/common/ScrollData';
import { XButton } from 'vux';
import PopUp from './PopUp';
import statisticsMixins from './statisticsMixins.js';

export default {
  components: {
    XButton,
    LoadMore,
    PopUp,
    Loading,
    ScrollData,
  },
  mixins: [wechatMenu, statisticsMixins],
  directives: {
    infiniteScroll,
  },
  data() {
    return {
      loadingData: true,
      loading: true,
      total: 0,
      currentPage: 0,
      busy: false,
      popUp: false,
      listShow: true,
      isEmpty: false,
      statisticData: {},
      introduceList: [],
    };
  },
  async mounted() {
    await this.isQualify();
    await this.getTipStatistic();
    await this.getTiplists();
    this.loading = false;
  },
  methods: {
    // 判断是否有资格
    isQualify() {
      return this.$http.get(`${this.apiConfig.host}student/introduce-qualification`).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        if (res.data !== 1) {
          window.location.href = '/mine';
        }
      });
    },
    loadMore() {
      if (this.introduceList.length < this.total && !this.isEmpty && !this.busy) {
        this.busy = true;
        this.getTiplists();
      }
    },
    getTipStatistic() {
      const getStatistic = `${this.apiConfig.host}student/introduce-statistic`;
      return this.$http.get(getStatistic).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.statisticData = res.data;
      });
    },
    getTiplists() {
      const page = this.currentPage + 1;
      const url = `${this.apiConfig.host}student/introduce-list?page=${page}`;
      return this.$http.get(url).then((res) => {
        console.log('get adata');
        if (res.error_code !== 0) {
          return false;
        }
        this.loadingData = false;
        if (res.data.total === 0) {
          this.isEmpty = true;
          this.busy = true;
        } else {
          this.introduceList = this.introduceList.concat(res.data.data);
          this.total = res.data.total;
          this.isEmpty = false;
          this.currentPage = page;
          if (this.introduceList.length === this.total) {
            this.busy = true;
          } else {
            this.busy = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';

.my-recommended {
  padding: .28rem;
  background: #F8F8F8;
  min-height: 100%;
  .rewards-cards {
    height: 2.8rem;
    border-radius: .1rem;
    color: @col-white;
    background:linear-gradient(135deg,rgba(111,35,174,1) 0%,rgba(242,103,181,1) 100%);
    box-shadow:0px 10px 20px 0px rgba(154,87,200,0.4);
    h2 {
      padding: .25rem .3rem;
      .wh(100%, 100%);
      font-size: .36rem;
      .bg-m('@{img-path}/introduce-img10.png');
      background-size: 100%;
      strong {
        display: block;
        margin-left: -.1rem;
        height: 1.1rem;
        line-height: 1rem;
        font-size: .8rem;
        font-weight: 400;
      }
      em {
        opacity: .7;
        font-size: .26rem;
      }
    }
  }
  .statistics {
    display: flex;
    justify-content: space-between;
    li {
      .wh(33.3%, 1.8rem);
      padding: .26rem 0;
      margin: .3rem .15rem;
      border-radius: .1rem;
      text-align: center;
      background:@col-white;
      box-shadow:0px 6px 10px 0px rgba(140,140,140,0.2);
      &:nth-child(1){
        margin-left: 0;
      }
      &:nth-child(3){
        margin-right: 0;
      }
      span {
        display: block;
        font-size: .26rem;
        color: #1B223F;
      }
      strong {
        font-size: .6rem;
        color: @col-purple;
      }
    }
  }
  h2.recommended-title {
    font-size: .36rem;
    margin: 0 0 .3rem .3rem;
  }
  .no-recommended {
    text-align: center;
    font-size: .36rem;
    .icon-img {
      display: block;
      margin: 1rem auto .3rem;
      .wh(3.99rem, 2.48rem);
      .bg-m('@{img-path}/introduce-img9.png');
      background-size: 3.99rem 2.48rem;
    }
    .weui-btn{
      .wh(80%, .9rem);
      margin: .5rem auto;
      font-size: .36rem;
      color: @col-white;
      background: @col-purple;
      box-shadow:5px 5px 10px 4px rgba(117,0,139,0.15);
    }
  }
}

</style>
