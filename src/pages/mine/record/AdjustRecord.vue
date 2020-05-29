<template>
  <div class="record">
    <loading v-if="isLoading"></loading>
    <no-content tips="暂无任何操作" v-if="this.adjustInfor.length === 0"></no-content>
    <ul v-else>
      <li class="course-item" v-for="(item, index) in adjustInfor" :key="index">
        <div class="item-top">
          <div class="cover" @click="selectSection(item.id)">
            <div class="cus-responsive percent">
              <span class="cus-responsive-item">
                <img :src="item.cover_url" v-if="item.cover">
                <img src="../../../assets/cover-default.jpg" v-else>
              </span>
            </div>
          </div>
          <div class="content">
            <div class="title" @click="selectSection(item.id)">
              {{item.title}}
            </div>
            <p class="timeperiod">
              <em class="course-icon"></em>
              {{item.start_at | formatDate}}-{{item.end_at | formatDate}}
            </p>
            <p>
              <em class="course-icon lessons"></em>
              共{{item.lessons}}节
            </p>
          </div>
        </div>
        <ul class="course-type">
          <li v-if="item.content_type === 1">
            <p class="title">{{item.content_type_name}}</p>
            <p class="intro">
              <span><em class="course-icon lessons"></em>共{{item.lessons}}节</span>
            </p>
          </li>
          <li v-if="item.relation && item.relation.content_type === 2">
            <p class="title">{{item.relation.content_type_name}}</p>
            <p class="intro">
              <span><em class="course-icon lessons"></em>共{{item.relation.lessons}}节</span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import { XButton } from 'vux';
import { formatDate } from '@/filters';
import Loading from '@/components/loading/Index';
import NoContent from '@/components/common/NoContent';
import { setApilog } from '@/api';

export default {
  components: {
    XButton,
    Loading,
    NoContent,
  },
  data() {
    return {
      isLoading: true,
      adjustInfor: {},
    };
  },
  filters: { formatDate },
  methods: {
    selectSection(id) {
      this.$router.push({
        name: 'adjustDetails',
        params: {
          courseId: id,
        },
      });
    },
    teacherDetail(id) {
      this.$router.push({
        name: 'teacher',
        params: {
          id: id,
        },
      });
    },
    getAdjustInfor() {
      this.$http.get(`${this.apiConfig.host}classroom/schedule-changes`).then((response) => {
        this.isLoading = false;
        if (response.error_code !== 0) {
          return false;
        }
        this.adjustInfor = response.data;
      });
    },
  },
  mounted() {
    this.getAdjustInfor();
    setApilog({
      event_type: 70014,
      route: '/mine/record/adjust',
    });
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';
.record{
  background: @col-bg;
  min-height: 100%;
  padding: .2rem .3rem;
}
.course-item{
  padding: .3rem .2rem .2rem;
  position: relative;
  background:#fff;
  margin: 0 0 .2rem;
  border-radius:.08rem;
  overflow:hidden;
  .course-icon{
    position: relative;
    top: -.02rem;
    .wh(.28rem,.27rem);
    margin-right: .1rem;
    display:inline-block;
    vertical-align: middle;
    .bg-m('@{img-path}/course-details-icon.png',center,0);
    background-size: .4rem auto;
    &.timeperiod{
      background-position: center 0;
    }
    &.lessons{
      height: .25rem;
      background-position: center -.27rem;
    }
  }
  .item-top{
    position: relative;
    .btn-fn{
      position: absolute;
      right: 0;
      bottom: 0;
      border: none;
    }
  }
  .weui-btn{
    .weui-btn(1.44rem);
    .l-h(.6rem);
  }
  .cover{
    width:2.8rem;
    height: 1.75rem;
    float:left;
    .percent{
      padding-bottom:62.5%;
      img{
        .wh-img;
        border-radius: .08rem;
      }
    }
  }
  .content{
    padding:.1rem .15rem 0;
    height: 1.75rem;
    margin-left:2.9rem;
    font-size:.24rem;
    color:@col-gray;
    .title{
      margin-bottom:.04rem;
      line-height:0.34rem;
      font-size:.3rem;
      color:@col-darkgray;
      .ellipsis-m(2);
      vertical-align: middle;
    }
  }
  .course-type{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: .2rem;
    padding-top: .2rem;
    border-top: .01rem solid @col-border;
    color: @col-gray;
    .title{
      position: relative;
      top: .04rem;
      padding-right: .2rem;
      font-size: .26rem;
      color: @col-darkgray;
    }
    li{
      position: relative;
      width: 49%;
      display: flex;
      justify-content: center;
      margin-bottom: .1rem;
      padding: .13rem .16rem;
      background-color: @col-bg;
    }
    p{
      line-height: .44rem;
    }
    .intro{
      span{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
