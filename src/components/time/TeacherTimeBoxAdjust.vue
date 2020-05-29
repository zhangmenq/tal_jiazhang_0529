<template>
  <div class="teacher-time-box"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="500"
    infinite-scroll-immediate-check="false"
    infinite-scroll-throttle-delay="500">
    <div class="teacher-time-item"
      :class="{'item-shadow': selTeachers.id == item.id}"
      v-for="(item, index) in lists"
      :key="index">
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
          <p class="tags" v-if="item.tags && item.tags.length > 0">
            <span class="tag"
              v-for="(tag, i) in item.tags" :key="i">
              {{tag.tag_name}}
            </span>
          </p>
           <p class="sign-box">
              <em class="tag-original" v-if="item.orginal_teacher" >原班老师</em>
              <span class="my-focus" v-if="item.attention===1">我关注的</span>
            </p>
        </div>
      </div>
      <div class="week-time">
        <template v-if="JSON.stringify(item.date_list) != '{}'">
          <p class="comm-tit-sub">请选择上课时间(向左滑动查看更多时间）</p>
          <!-- <div class="notime-tips" v-if="item.orginal_teacher && teacherFirst === 1">抱歉！外教没有可预约的时间~</div> -->
          <div class="week-tab mask">
            <div class="week has-date">
                <span class="checkbox-item"
                   v-for="(week, i) in item.date_list"
                   :key="i"
                  :class="[{'checkbox-item-selected': selTeachers.id == item.id && selWeek == i},{'checkbox-disabled': week.idle == 0}]"
                  v-on:click="selectWeek(item, i, week.v, week.idle)">
                  周{{week.k | formatWeek}}
                  <em class="target" v-if="week.idle == 0"></em>
                  <em class="date">{{week.v | formatDate('DD')}}</em>
                </span>
            </div>
          </div>
          <div class="time" v-if="selTeachers.id == item.id">
            <span class="checkbox-item"
            :class="{'checkbox-item-selected': selTeachers.id == item.id && selTime.k == time.k}"
              v-for="(time, i) in times" :key="i"
              v-on:click="selectTime(time)"
              v-if="!loadingTime">
              {{time.v}}
            </span>
            <div class="text-center" v-if="loadingTime">
              <Loading>loading...</Loading>
            </div>
            <div class="notime-tips" v-if="times.length === 0 && !loadingTime">
              抱歉！外教没有可预约的时间~
            </div>
          </div>
        </template>
        <div class="notime-tips" v-else-if="item.date_list">
          抱歉，该老师被约满了，请换其他老师看看~
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import infiniteScroll from 'vue-infinite-scroll';
  import Loading from '@/components/loading/Index';
  import { formatDate, formatWeek } from '@/filters';

  export default {
    directives: {
      infiniteScroll,
    },
    components: {
      Loading,
    },
    filters: {
      formatDate,
      formatWeek,
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
      busy: {
        type: Boolean,
        default: false,
      },
      times: {
        type: Array,
        default: [],
      },
      selTeachers: {
        type: Object,
        default: {},
      }, // 选择老师
      selWeek: {
        type: [String, Number],
        default: '',
      },
      selTime: {
        type: Object,
        default: {},
      },
      loading: {
        type: Number,
        default: 0,
      },
      loadingTime: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      selectWeek(teachers, weekKey, date, idle) {
        if (idle === 0) {
          return;
        }
        this.$emit('selectWeek', {
          teachers: teachers,
          weekKey: weekKey,
          date: date,
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

.teacher-time-box{
  .teacher-time-item{
    .teacher-temp;
    overflow: hidden;
    box-shadow:0 .04rem .2rem 0 rgba(163,163,163,0.15);
  }
  .teacher-item{
    display: flex;
    padding-bottom: .26rem;
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
      &.mask{
        padding-left: 0;
      }
    }
     .week{
      .checkbox-item{
        color:@new-col-title-dark;
        padding: .2rem 0 0 !important;
      }
      .checkbox-disabled{
      color:@new-col-gray-week;
      &::after{
        top:38% !important;
      }
    }
    }
    // .week-tab{
    //   // display: flex;
    //   margin: .2rem 0 0;
    //   // height: .9rem;
    //   // background: #f8f8f8;
    //   white-space: nowrap;
    //   // overflow-x: auto;
    //   .week{
    //     display: flex;
    //     flex-wrap: wrap;
    //     padding: .01rem 0;
    //   }
    //   .checkbox-item{
    //     position: relative;
    //     // display: inline-block;
    //     // margin-right: 3.6%;
    //     margin: 0 .048rem .2rem;
    //     // margin-bottom: .2rem;
    //     width: .86rem;
    //     padding: .06rem 0;
    //     line-height: .3rem;
    //     border: .01rem solid @col-gray;
    //     border-radius: .08rem;
    //     text-align: center;
    //     font-size: .2rem;
    //     span{
    //       display: block;
    //     }
    //     .date{
    //       display: block;
    //       font-size: .2rem;
    //     }
    //     &:after{
    //       // content: '';
    //       position: absolute;
    //       display: none;
    //     }
    //   }
    //   /* 选中 */
    //   .checkbox-item-selected{
    //     position: relative;
    //     background: #fff;
    //     border: .01rem solid @col-purple;
    //     color: @col-purple;
    //     font-size: .24rem;
    //     &:before, &:after{
    //       // content: '';
    //       position: absolute;
    //       left: 50%;
    //       display: block;
    //       margin-left: -.12rem;
    //       border-width: .12rem;
    //       border-color: transparent;
    //       border-style: solid;
    //       border-bottom-width: 0;
    //     }
    //     &:before{
    //       z-index: 1;
    //       bottom: -.12rem;
    //       border-top-color: @col-purple;
    //     }
    //     &:after{
    //       z-index: 2;
    //       bottom: -.11rem;
    //       border-top-color: #fff;
    //     }
    //   }
    // }
    .time{
      position: relative;
      display: flex;
      flex-wrap: wrap;
      margin: 0 -1.5% 0;
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
    .notime-tips{
      flex: 1;
      font-size: .26rem;
      text-align: center;
      padding-top: .2rem;
      color: @col-gray;
    }
  }
  .text-center{
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
</style>
