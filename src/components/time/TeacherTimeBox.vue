<template>
  <div class="item-wrap">
    <div class="teacher-time-box"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="100"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500">
      <div class="teacher-time-item"
        :class="{'item-shadow': selTeacher.id == item.id}"
        v-for="(item, index) in lists"
        :key="index"
        v-if="lists.length > 0">
        <div class="teacher-item">
          <span class="avatar" @click="goTeacher(item.id)">
            <img v-if="item.avatar_url == ''" src="../../assets/default-photo-teacher.png">
            <img v-else :src="item.avatar_url">
          </span>
          <div class="item-cont">
            <h2 class="name">
              <span class="name-inner">
                <em>{{item.realname}}</em>
              </span>
              <em class="name-count" v-if="item.teaching_age_name">{{item.teaching_age_name}}教龄</em>
            </h2>
            <p class="tags"  v-if="item.tags.length > 0">
              <span class="tag"
                v-for="(tag, i) in item.tags" :key="i">
                {{tag.tag_name}}
              </span>
            </p>
            <p class="sign-box">
                <em class="tag-original" v-if="item.orginal_teacher && teacherFirst != 0">原班老师</em>
                <span class="my-focus" v-if="item.attention === 1">我关注的</span>
            </p>
          </div>
        </div>
        <div class="week-time">
          <template v-if="JSON.stringify(item.weeks) != '{}'">
            <p class="comm-tit-sub">请选择上课时间(向左滑动查看更多时间）</p>
            <div class="week-tab">
              <div class="week">
                <span class="checkbox-item"
                  :class="{'checkbox-item-selected': selTeacher.id == item.id && selWeek == i}"
                  v-for="(week, i) in item.weeks"
                  :key="i"
                  v-on:click="selectWeek(item, i)">
                  周{{week}}
                  <!-- <em class="target">约满</em>
                    :class="[{'checkbox-item-selected': selTeacher.id == item.id && selWeek == i},{
                    'checkbox-disabled': selTeacher.id == item.id
                  }]"
                   -->
                </span>
              </div>
            </div>
            <template v-if="selTeacher.id == item.id">
              <Loading v-if="loadingTime"></Loading>
              <div class="time" v-else-if="times.length > 0">
                <span class="checkbox-item"
                  :class="{'checkbox-item-selected': selTeacher.id == item.id && selTime.k == time.k}"
                  v-for="(time, i) in times" :key="i"
                  v-on:click="selectTime(time)">
                  {{time.v}}
                </span>
              </div>
              <div class="notime-tips time-box" v-else>
                抱歉，该时间被约满了，请换其他时间看看
            </div>
            </template>
          </template>
          <div class="notime-tips" v-else>
            抱歉，该老师被约满了，请换其他老师看看~
          </div>
        </div>
      </div>
      <no-content v-else :tips="'抱歉！该课程下没有可预约的老师了~ 拔打客服电话4008002211转9 '"></no-content>
      <load-more
        v-if="lists.length > 0 && teacherLast == 0"
        :show-loading="loadingData"></load-more>
    </div>
  </div>
</template>

<script>
  import infiniteScroll from 'vue-infinite-scroll';
  import Loading from '@/components/loading/Index';
  import LoadMore from '@/components/loadmore/Index';
  import NoContent from '@/components/common/NoContent';

  export default {
    directives: {
      infiniteScroll,
    },
    components: {
      Loading,
      LoadMore,
      NoContent,
    },
    props: {
      lists: {
        type: Array,
        default: [],
      },
      teacherFirst: {
        type: Number,
        default: 0,
      },
      teacherLast: {
        type: Number,
        default: 0,
      },
      times: {
        type: [Array, Object],
        default: [],
      },
      selTeacher: {
        type: Object,
        default: {},
      }, // 选择老师
      selWeek: {
        type: String,
        default: '',
      },
      selTime: {
        type: Object,
        default: {},
      },
      weeks: {
        type: Object,
        default: {},
      },
      loadingTime: {
        type: Boolean,
        default: false,
      },
      loadingData: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      busy() {
        return this.teacherLast === 0;
      },
    },
    methods: {
      selectWeek(teachers, weekKey) {
        this.$emit('selectWeek', {
          teachers: teachers,
          weekKey: weekKey,
        });
      },
      selectTime(time) {
        this.$emit('selectTime', {
          time: time,
        });
      },
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
    },
  };
</script>
<style lang="less">
@import '../../styles/basic.less';

.item-wrap{
  background: #fff;
}
.teacher-time-box{
  .teacher-time-item{
    .teacher-temp;
    overflow: hidden;
    box-shadow:0 .04rem .2rem 0 rgba(163,163,163,0.15);
  }
  .teacher-item{
    display: flex;
    padding-bottom: .2rem;
    .avatar{
      .wh(1.2rem,1.2rem);
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
        .name-inner{
          display: inline-block;
          vertical-align: middle;
          margin-bottom: .2rem;
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
          vertical-align: top;
        }
      }
      .tags{
        display: flex;
        flex-wrap: wrap;
        font-size: .26rem;
        color:@new-col-purple;
        .tag{
          margin: 0 .2rem .16rem 0;
          padding: 0 .1rem;
          line-height: .38rem;
          background:rgba(111,75,213,0.06);
          border-radius:5px;
        }
      }
      .sign-box{
            font-size: .22rem;
            line-height: .3rem;
          .tag-original{
            display: inline-block;
            vertical-align: middle;
            color:@new-col-orange;
            margin-right: .2rem;
            position: relative;
            padding-left: .22rem;
            &::before{
              position: absolute;
              left:0;
              top:.06rem;
              content: '';
              .bg-m('@{img-path}ico2/crown.png');
              .wh(.19rem,.17rem);
            }
        }
        .my-focus{
          display: inline-block;
          vertical-align: middle;
          color:@new-col-yellow;
        }
      }
    }
  }
  .week-time{
    padding: .22rem 0 .1rem;
    border-top: .01rem solid @col-border;
    .comm-tit-sub{
      .comm-tit-sub;
    }
    .week-tab{
      .week-box;
      margin-top: .2rem;
      padding-left: 0;
     
    }
    .week{
      .checkbox-item{
        color:@new-col-title-dark;
      }
    }

    .time{
      display: flex;
      flex-wrap: wrap;
      margin: 0 -1.5%;
      .checkbox-item{
        margin: .3rem 1.5% 0;
        .wh(21%,.6rem);
        line-height: .56rem;
        border: .02rem solid @new-col-purple;
        border-radius: .3rem;
        text-align: center;
        font-size: .3rem;
        color: @new-col-purple;
      }
      .checkbox-item-selected{
        border: .02rem solid @new-col-purple;
        background-color:  @new-col-purple;
        color: @new-col-white;
      }
    }
  }
  .notime-tips{
    font-size: .26rem;
    text-align: center;
    &.time-box{
      margin-top: .1rem;
    }
  }
}
</style>
