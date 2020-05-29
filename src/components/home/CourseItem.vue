<template>
  <li class="course-items" @click="selectCourse()" v-if="course">
      <div class="content">
        <div class="title">
          <i v-if="course.is_mid" class="middle-icon">{{moment(course.start_at).year()}}插班</i>
          <span>{{course.title}}</span>
        </div>
        <p class="timeperiod">
          <em class="course-icon"></em>
          {{course.start_at}} ~ {{course.end_at}}
        </p>
        <p class="lessons">
          <em class="course-icon"></em>
          共{{course.lessons_sum ? course.lessons_sum : course.lessons }}节
        </p>
        <p class="price">
          <span class="current">¥{{course.price | formatMoney}}</span>
          <span class="original" v-if="course.original_price>0">¥{{course.original_price |formatMoney}}</span>
        </p>
        <div class="btn-signup">报名</div>
      </div>
  </li>
</template>
<script>
  import { formatMoney } from '@/filters';
  import { setApilog } from '@/api';
  import moment from 'moment';

  export default {
    props: {
      course: {},
    },
    filters: {
      formatMoney,
    },
    methods: {
      async selectCourse() {
        await setApilog({
          event_type: 20003,
          route: '/index',
          ext1: this.course.id,
          ext5: 'indexcourselist',
        });
        await this.goCourse();
      },
      goCourse() {
        const routerName = this.course.is_package ? 'packageDetails' : (this.course.relation ? 'bindingDetails' : 'courseDetails');
        const queryType = this.course.is_package ? 'package' : (this.course.relation ? 'binding' : 'course');
        // location.href = routerName + '/' + this.course.id + '?type=' + queryType;
        this.$router.push({
          name: routerName,
          params: {
            id: this.course.id,
          },
          query: {
            type: queryType,
          },
        });
      },
      moment(date) {
        return moment(date);
      },
    },
  };
</script>
<style lang="less">
    @import '../../styles/basic.less';
    .course-items{
      background: @new-col-bg-white;
      box-shadow:0 .04rem .2rem 0 rgba(0,0,0,0.1);
      border-radius: 0.08rem;
      position: relative;
      margin-top: 0.2rem;
      overflow: hidden;
      .content{
        padding:0.26rem 0.35rem 0.21rem 0.36rem;
        font-size:0.2rem;
        color:@col-gray;
        .title{
          .ellipsis-m(2);
          font-size: 0.32rem;
          color: @new-col-title-dark;
          line-height: 0.45rem;
          margin-bottom:0.12rem;
          height: 0.45rem;
          vertical-align: middle;
          font-weight: bold;
          .middle-icon {
            display: inline-block;
            height: .35rem;
            padding: 0 .1rem .08rem .1rem;
            font-size: .18rem;
            line-height: 0.35rem;
            background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
            color: @new-col-white;;
            border-radius: .15rem .15rem .15rem 0px;
            vertical-align: middle;
          }
        }
        p{
          height: 0.33rem;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: @new-col-font-gray;
          line-height: 0.33rem;
          .course-icon{
            .wh(0.26rem,0.26rem);
            margin-right:0.1rem;
            display:inline-block;
            vertical-align: sub;
          }
          &.timeperiod .course-icon{
            .bg-m('@{img-path}/course-time.png');
            background-size: cover;
          }
          &.lessons .course-icon{
            .bg-m('@{img-path}/course-count.png');
            background-size: cover;
          }
        }
      }
      .price{
        display: inline-block;
        margin-top: 0.03rem;
        height: 0.5rem !important;
        .current{
          color: @new-col-orange;
          font-size: 0.36rem !important;
          font-family: PingFangSC-Medium !important;
          font-weight: 500 !important;
          line-height: 0.5rem !important;
        }
        .original{
          font-family: PingFangSC-Medium !important;
          font-weight: 500 !important;
          color: @new-col-p-gray;
          text-decoration: line-through;
          margin-left: 0.24rem;
        }
      }
      .btn-signup{
        display: inline-block;
        font-size:0.28rem;
        width:1.44rem;
        padding:0.1rem 0.23rem;
        position: absolute;
        right: 0.35rem;
        border-radius: 0.3rem;
        color: @new-col-white;
        background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
        text-align: center;
        bottom: 0.33rem;
      }
    }
</style>
