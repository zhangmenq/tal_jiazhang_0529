<template>
<div class="record">
  <scroll-data v-if="!loadingData"
    :lists="lists"
    :busy="busy"
    :distance="100"
    :total="total"
    :currentPage="currentPage"
    listType="change"
    :tips="tips"
    courseType="changeClass"
    @loadMore="loadMore">
  </scroll-data>
  <loading v-else></loading>
</div>
</template>
<script>
import ScrollData from '@/components/common/ScrollData';
import Loading from '@/components/loading/Index';
import { setApilog } from '@/api';

export default {
  components: {
    ScrollData,
    Loading,
  },
  data() {
    return {
      lists: [],
      tips: '暂无转班记录',
      total: 0,
      loadingData: true,
      busy: false,
      isEmpty: false,
      currentPage: 0,
    };
  },
  methods: {
    loadMore() {
      //判断是否到达底部
      if (!this.isEmpty && !this.busy) {
        this.busy = true;
        this.getClassroomInfo();
      }
    },
    getClassroomInfo() {
      const page = this.currentPage + 1;
      this.$http.get(`${this.apiConfig.host}classroom/classroom-changes?page=${page}`).then((response) => {
        this.loadingData = false;
        if (response.error_code !== 0) {
          return false;
        }
        if (response.data.total === 0) {
          this.isEmpty = true;
          this.busy = true;
        } else {
          this.lists = this.lists.concat(response.data.data);
          this.total = response.data.total;
          this.currentPage = page;
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
    this.getClassroomInfo();
    setApilog({
      event_type: 70015,
      route: '/mine/record/classroom',
    });
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';
.record{
  background: @col-bg;
  min-height: 100%;
  padding: .2rem 0;
}
.course-item{
  .course-icon{
    .bg-m('@{img-path}/course-icon.png');
  }
  padding: .2rem;
  position: relative;
  background:#fff;
  margin-bottom:.2rem;
  border-radius:.1rem;
  overflow:hidden;
  .cover{
    width:2.8rem;
    height: 1.75rem;
    float:left;
    .percent{
      padding-bottom:62.5%;
      img{
        .wh-img;
        border-top-left-radius:.08rem;
        border-bottom-left-radius:.08rem;
      }
    }
  }
  .content{
    padding:.1rem .15rem 0;
    height: 1.75rem;
    margin-left:2.9rem;
    font-size:.2rem;
    color:@col-gray;
    .title{
      margin-bottom:.04rem;
      line-height:.4rem;
      font-size:.3rem;
      color:@col-darkgray;
      .ellipsis-m(2);
      vertical-align: middle;
      font-weight: bold;
      i{
        display: inline-block;
        .wh(.96rem,.42rem);
        color: @col-white;
        font-size: .24rem;
        text-align: center;
        .bg-m('@{img-path}/course-img1.png',0,0,no-repeat);
        &.major{
          background-position: 0 0;
        }
        &.trial-class{
          background-position: center -.44rem;
        }
        &.live-lesson{
          background-position: center -.91rem;
        }
      }
    }
    p{
      font-size: .24rem;
      .course-icon{
        position: relative;
        top: -.02rem;
        background-size: .2rem auto;
        .wh(.2rem,.2rem);
        margin-right: .1rem;
        display:inline-block;
        vertical-align: middle;
        .timeperiod &{
          background-position: 0 0;
        }
        .Lessons &{
          background-position: 0 -.2rem;
        }
        .name &{
          background-position: 0 -.4rem;
        }
      }
    }
  }
  .teacher-show{
    height: 1rem;
    // line-height: 1rem;
    margin: .2rem 0 0 0;
    // padding: .2rem 0 0 0;
    border-top: .01rem solid @col-gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .3rem;
    & img{
      margin: 0 .2rem 0 0;
      vertical-align: middle;
      .wh(.6rem,.6rem);
    }
    .weui-btn{
      .wh(1.5rem,.6rem);
      line-height: .6rem;
      font-size: .3rem;
      padding: 0;
      &.transfer{
        border: .02rem solid @col-blue;
        background: @col-white;
        color: @col-blue;
      }
      &.live{
        background: @col-lightred;
        box-shadow: 0 .1rem .1rem #c9d4fc;
        color: @col-white;
      }
      &.cancel{
        border: .02rem solid @col-gray;
        background: @col-white;
        color: @col-gray;
      }
    }
  }
}
</style>
