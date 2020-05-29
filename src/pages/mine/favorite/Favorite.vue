<template>
  <div class="favorite">
    <loading v-show="isLoading"></loading>
    <ul v-show="teachers.length > 0 && !isLoading"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="100"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500">
      <li v-for="(item, idx) in teachers" :key="idx" :class="{'disabled': item.isAsh === 1}" @click="goTeacher(item.id, item.isAsh)">
        <a class="avatar">
          <img :src="`${apiConfig.oss_host}${item.avatar}`" v-if="item.avatar"/>
          <img src="../../../assets/default-photo-teacher.png" v-else>
        </a>
        <div class="content">
          <p class="name">{{item.realname}}</p>
          <p class="tags"><span v-for="(tag, index) in item.tags" :key="index">{{tag}}</span></p>
        </div>
      </li>
      <load-more
        :show-loading="last > 0"
        v-if="!isLoading">
      </load-more>
    </ul>
    <no-content
      :defaultImg="'noteacher'"
      :tips="'暂无关注的老师'"
      v-show="teachers.length === 0 && !isLoading">
    </no-content>
  </div>
</template>
<script>
// import { getFavorite } from '@/api';
import infiniteScroll from 'vue-infinite-scroll';
import LoadMore from '@/components/loadmore/Index';
import Loading from '@/components/loading/Index';
import NoContent from '@/components/common/NoContent';
import { setApilog } from '@/api/index';

export default {
  components: {
    NoContent,
    LoadMore,
    Loading,
  },
  data() {
    return {
      isLoading: true,
      teachers: [],
      currentPage: 1,
      busy: false,
      last: 0,
    };
  },
  directives: {
    infiniteScroll,
  },
  methods: {
    loadMore() {
      //判断是否到达底部
      if (this.busy || this.last === 0) {
        return false;
      }
      this.getFavorite();
    },
    goTeacher(teacherId, isAsh) {
      if (isAsh === 1) {
        return false;
      }
      this.$router.push({
        name: 'teacher',
        params: {
          id: teacherId,
        },
      });
    },
    getFavorite() {
      const url = `${this.apiConfig.host}student/attention-teachers?page=${this.currentPage}`;
      this.busy = true;
      return this.$http.get(url).then((res) => {
        this.isLoading = false;
        if (res.error_code !== 0) {
          return false;
        }
        const teachers = res.data.data;
        this.teachers = this.teachers.concat(teachers);
        this.last = res.data.last;
        if (this.last > 0) {
          this.currentPage += 1;
          this.busy = false;
        }
      });
    },
  },
  mounted() {
    this.getFavorite();
    setApilog({
      event_type: 70012,
      route: '/mine/favorite',
    });
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';

.favorite{
  padding: .3rem;
  li{
    display: flex;
    margin-bottom: .2rem;
    padding: .3rem;
    background: #fff;
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);
    border-radius: .1rem;
    overflow: hidden;
    &.disabled{
      box-shadow: none;
      background: #f2f2f4;
      .avatar{
        &:before{
          content: '已约满';
          .pos-box(100%,100%);
          background: rgba(0,0,0,.5);
          line-height: 1rem;
          color: #fff;
          text-align: center;
        }
      }
      p{
        color: @col-gray;;
      }
    }
    .avatar{
      position: relative;
      margin-right: .3rem;
      flex: 0 0 1rem;
      height: 1rem;
      border-radius: 100%;
      overflow: hidden;
      img{
        .wh-img;
      }
    }
    .content{
      flex: 1;
      overflow: hidden;
      p{
        .ellipsis-b;
      }
    }
    .name{
      font-size: .3rem;
    }
    .tags{
      margin-top: .1rem;
      color: @col-gray;
      span{
        margin-right: .25rem;
      }
    }
  }
}
</style>


