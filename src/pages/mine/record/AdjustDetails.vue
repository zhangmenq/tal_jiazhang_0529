<template>
  <div class="classroom-details">
    <router-link class="introduce_btn" :to="{path: '/mine/record/adjustIntroduce'}">调课说明</router-link>
    <scroll-data
      v-if="!loadingData"
      :lists="lists"
      :busy="busy"
      :distance="120"
      :total="total"
      :currentPage="currentPage"
      :tips="noContentTips"
      listType="adjust"
      @loadMore="loadMore">
    </scroll-data>
    <loading v-else></loading>
  </div>
</template>
<script>
import ScrollData from '@/components/common/ScrollData';
import Loading from '@/components/loading/Index';

export default {
  name: 'adjust',
  components: {
    ScrollData,
    Loading,
  },
  data() {
    return {
      lists: [],
      total: 0,
      currentPage: 0,
      isEmpty: false,
      busy: false,
      noContentTips: '你还没有调过课！',
      loadingData: true,
    };
  },
  methods: {
    loadMore() {
      //判断是否到达底部
      if (!this.isEmpty && !this.busy) {
        this.busy = true;
        this.adjustDetails();
      }
    },
    adjustDetails() {
      const id = this.$route.params.courseId;
      const page = this.currentPage + 1;
      const url = `${this.apiConfig.host}classroom/schedule-changes/info/?course_id=${id}&page=${page}`;
      return this.$http.get(url).then((res) => {
        this.loadingData = false;
        const ret = res.data;
        if (ret.total === 0) {
          this.isEmpty = true;
          this.busy = true;
        } else {
          this.lists = this.lists.concat(ret.data);
          this.total = ret.total;
          this.currentPage = page;
          this.isEmpty = false;
          if (this.lists.length === this.total) {
            this.busy = true;
          } else {
            this.busy = false;
          }
        }
      });
    },
  },
  mounted() {
    this.adjustDetails();
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';

.classroom-details{
  min-height: 100%;
  padding: .4rem;
  position: relative;
  .introduce_btn{
    position: absolute;
    right: 0;
    top: .1rem;
    width: 1.45rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
    border-top-left-radius: .3rem;
    border-bottom-left-radius: .3rem;
    font-size: .28rem;
    color:#fff;
  }
  .record-list-cont{
    background: @col-white;
    margin-bottom: .3rem;
    border-radius: .2rem;
    padding: .1rem .1rem .3rem .1rem;
    h2{
      font-size: .26rem;
      color: @col-darkgray;
      border-bottom: .01rem solid @col-gray;
      // height: .56rem;
      padding: .2rem;
    }
    h3{
      color: @col-darkgray;
      margin: .16rem .2rem;
      font-size: .3rem;
      .blue{
        color: @col-purple;
      }
      .lightred{
        color: @col-lightred;
      }
    }
    ul{
      display: flex;
      justify-content: space-between;
      align-items:center;
      margin: 0 .2rem;
      li{
        font-size: .2rem;
        color: @col-gray;
        i{
          .wh(.2rem,.2rem);
          display: inline-block;
          vertical-align: middle;
          margin:0 .1rem 0 0;
          .bg-m('@{img-path}/course-details-icon.png');
          &.time{
            background-position: center -2.72rem;
          }
          &.figure{
            background-position: center -2.46rem;
          }
        }
        img{
          .wh(.4rem,.4rem);
          vertical-align: middle;
          margin: 0 0 0 .1rem;
        }
        p{
          img{
            border-radius: 100%;
          }
        }
      }
    }
  }
}
</style>
