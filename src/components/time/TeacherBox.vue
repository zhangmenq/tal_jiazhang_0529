<template>
  <div class="teacher">
    <div v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="100"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500">
      <div class="teacher-item" v-for="(item, index) in teacherList" :key="index">
        <span class="status_btn status_btn_active" v-if="selTeacher.id && item.id == selTeacher.id"><em></em></span>
        <span class="status_btn status_btn_disable" v-else-if="item.orginal_teacher && teacherFirst == 1"><em>不可选</em><p>该时段已被约</p></span>
        <span class="status_btn" @click="selectTeacher(item)" v-else><em>可选</em></span>
        <span class="avatar" @click="goTeacher(item.id)">
          <img v-if="item.avatar_url == ''" src="../../assets/default-photo-teacher.png">
          <img v-else :src="item.avatar_url">
        </span>
        <div class="item-cont" @click="selectTeacher(item)">
          <h2 class="name">
            <span class="name-inner">
              <em>{{item.realname}}</em>
            </span>
            <span class="age" v-if="item.teaching_age_name">{{item.teaching_age_name}}教龄</span>
          </h2>
          <p class="tags"   v-if="item.tags && item.tags.length > 0">
            <span class="tag"
              v-for="(tag, i) in item.tags" :key="i">
              {{tag.tag_name}}
            </span>
          </p>
          <p class="tag-original">
            <span v-if="item.orginal_teacher" class="old_teacher">原班老师</span>
            <span v-if="item.attention===1" class="my_follow">我关注的</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll';

export default {
  directives: {
    infiniteScroll,
  },
  props: {
    teacherList: {
      type: Array,
      default: [],
    },
    busy: {
      type: Boolean,
      default: false,
    },
    teacherFirst: {
      type: Number,
      default: 0,
    },
    selTeacher: {
      type: Object,
      default: {},
    },
  },
  methods: {
    loadMore() {
      this.$emit('loadMore');
    },
    goTeacher(teacherId) {
      this.$router.push({
        name: 'teacher',
        params: {
          id: teacherId,
        },
      });
    },
    selectTeacher(teacherInfo) {
      if (teacherInfo.orginal_teacher && this.teacherFirst === 1) {
        return;
      }
      this.$emit('selectTeacher', teacherInfo);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

.teacher{
  margin-top: .1rem;
  .nav-next{
    .nav-next;
  }
  .teacher-item{
    display: flex;
    .teacher-temp;
    overflow: hidden;
    box-shadow:0px 4px 20px 0px rgba(163,163,163,0.15);
    padding: .3rem 1.5rem .2rem .2rem;
    margin: 0 0 .2rem;
    .status_btn{
      display: block;
      width: 1.15rem;
      height: .54rem;
      line-height: .5rem;
      border: .02rem solid @new-col-purple;
      text-align: center;
      font-size: .28rem;
      border-radius: .27rem;
      position: absolute;
      right: .2rem;
      top: 50%;
      transform: translate(0, -50%);
      color: @new-col-purple;
      &.status_btn_active{
        background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
        border: none;
        em{
          display: block;
          width: 100%;
          height: 100%;
          .bg-m('@{img-path}ico2/status_btn_active.png');
          background-position: center;
          background-size: .39rem .3rem;
        }
      }
      &.status_btn_disable{
        background: #EFEEF2;
        border: none;
        color: #93909A;
        p{
          position: absolute;
          width: 1.54rem;
          line-height: .4rem;
          font-size: .24rem;
          bottom: -.4rem;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
    }

    // .status{
    //   .pos-box-r(.7rem,.7rem);
    //   color: @col-purple;
    //   .icon{
    //     position: absolute;
    //     right: .1rem;
    //     top: .1rem;
    //     .wh(.24rem,.24rem);
    //     .bg-m('@{img-path}/seltime-status-bg.png');
    //     background-size: .24rem .48rem;
    //   }
    //   i{
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //     .l-h(.7rem);
    //     font-size: .2rem;
    //   }
    //   em{
    //     position: absolute;
    //     right: .36rem;
    //     top: 0;
    //     display: block;
    //     width: 1.4rem;
    //     line-height: .7rem;
    //     font-size: .2rem;
    //   }
    //   &:before{
    //     content: '';
    //     .pos-box-r(0,0);
    //     border-top: .7rem solid @col-lightpurple;
    //     border-left: .7rem solid transparent;
    //   }
    //   &.status-selected{
    //     &:before{
    //       border-top: .7rem solid @col-purple;
    //     }
    //     .icon{
    //       background-position: 0 -.24rem;
    //     }
    //   }
    //   &.status-disable{
    //     &:before{
    //       border-top: .7rem solid @col-gray;
    //     }
    //     .icon{
    //       background-position: 0 0;
    //     }
    //   }
    //   &.status-choosable{
    //     em{
    //       top: .1rem;
    //       right: -.1rem;
    //       width: .7rem;
    //       line-height: .3rem;
    //       text-align: center;
    //       transform: rotate(45deg);
    //     }
    //   }
    // }
    .avatar{
      .wh(1.3rem,1.3rem);
      border-radius: 100%;
      overflow: hidden;
      img{
        .wh-img;
      }
    }
    .item-cont{
      flex: 1;
      padding-left: .2rem;
      &.selected{
        .item-shadow;
      }
      .name{
        line-height: .5rem;
        font-size: .3rem;
        margin-top: -.1rem;
        .name-inner{
          display: inline-block;
          vertical-align: middle;
          em{
            display: block;
            max-width: 2.4rem;
            .ellipsis-b;
          }
        }
        .name-count{
            margin-left: .2rem;
            font-weight:400;
            color:@new-col-title-dark;
            font-size: .24rem;
          }

        .age{
          margin-left: 0.2rem;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #4a4a4a;
        }
      }
      .tag-original{
        font-size: .2rem;
        line-height: .28rem;
        margin-top: .1rem;
        span{
          display: inline-block;
          padding-right: .2rem;
          &.my_follow{
            color: #E1B106;
          }
          &.old_teacher{
            color: #FE763A;
            padding-left: .24rem;
            .bg-m('@{img-path}ico2/crown.png');
            background-position: left center;
            background-size: .19rem .17rem;
          }
        }
      }
      .tags{
        display: flex;
        flex-wrap: wrap;
        font-size: .22rem;
        color: @col-gray;
        .tag{
          margin: .15rem .1rem 0 0;
          padding: 0 .1rem;
          background:rgba(111,75,213,0.06);
          line-height: .38rem;
          border-radius: .05rem;
          color: @new-col-purple;
        }
      }
    }
  }
}
</style>
