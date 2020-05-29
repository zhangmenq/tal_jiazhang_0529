<template>
    <li class="course-items" v-if="recentList">
        <div class="rencent-content" @click="goCourse">
            <div>
                <time
                    :class="{'main-time':recentList.type!==3, 'extra-time': recentList.type==3}">
                    <span v-if="recentList.type!==3">{{recentList.start_at | formatDate('MM-DD')}}&nbsp;{{recentList.start_week}}&nbsp;{{recentList.start_at | formatDate('HH:mm')}}</span>
                    <span v-else>{{recentList.start_at | formatDate('MM-DD')}}{{recentList.start_week}} ~ {{recentList.end_at | formatDate('MM-DD')}}{{recentList.end_week}}</span>
                </time>
                <span
                    class="type"
                    v-if="recentList.course.content_type"
                    :class="{'major': recentList.type !== 3,
                    'minor': recentList.type === 3}">
                    {{recentList.course.content_type_name}}
                </span>
            </div>
            <div class="name">
                <span>第{{recentList.no}}讲</span>
                <span>{{recentList.circle && recentList.circle.circles ? recentList.circle.circles.title : ''}}</span>
                <div class='label' v-if="recentList.type===2">补</div>
            </div>
            <p class="title-name">
                {{recentList.course.title}}
            </p>
            <div class="infoTeacher" v-if="recentList.teacher">
                <router-link
                    :to="{name: 'teacher',
                    params: {'id': recentList.teacher.id}}"
                    class="avatar">
                    <img v-if="recentList.teacher.avatar_url !== ''" :src="recentList.teacher.avatar_url"/>
                    <img v-else src="../../assets/default-photo-teacher.png"/>
                </router-link>
                <span class="teacher-name">
                    {{recentList.teacher.realname}}
                </span>
            </div>
            <div :class="{'btn-signup': recentList.classroom.adjusts !== 0, 'btn-un-signup': inRecent || recentList.can_change.err !== 0 || !recentList.classroom || recentList.classroom.adjusts <= 0}" v-if="recentList.type!==3 && recentList.can_change.err!==10341" @click="showAdjust">
                <span :class="{'light': recentList.classroom.adjusts !== 0, 'unlight': inRecent || recentList.can_change.err !== 0 || !recentList.classroom || recentList.classroom.adjusts <= 0}">调课</span>
            </div>
            <div class="more_time" @click.stop="moretime()" v-if="recentList.type===3">
                查看上课时间 >
            </div>
        </div>
        <div v-if="showMoreTime" type="text" class="show_more_time">
          <div class="show_more_time_con">
            <p class="nomal">上课时间：</p>
            <p class="nomal">每周一至周五 19:00-19:40  20:00-20:40</p>
            <p class="leftnomal">每周六至周日 9:00-9:40   10:00-10:40</p>
            <p class="right">14:00-14:40   15:00-15:40</p>
            <p class="right" >19:00-19:40  20:00-20:40</p>
            <a href="javascript:;" @click.stop="closeTime" class="close"></a>
          </div>
        </div>
    </li>
</template>
<script>
  import { formatDate } from '@/filters';
  import { Toast } from 'vux';
  import moment from 'moment';
  import { setApilog } from '@/api';

  export default {
    props: {
      recentList: {},
    },
    filters: {
      formatDate,
    },
    components: {
      Toast,
    },
    data() {
      return {
        showMoreTime: false,
      };
    },
    computed: {
      inRecent() {
        return moment() >= moment(this.recentList.start_at) &&
          moment() <= moment(this.recentList.end_at);
      },
    },
    methods: {
      goCourse() {
        this.$router.push({
          name: 'scheduleList',
          params: {
            classroomId: this.recentList.classroom_id,
          },
        });
      },
      moretime() {
        this.showMoreTime = true;
        setApilog({
          event_type: 20018,
          route: '/index',
          ext1: 1,
          ext2: this.recentList.course_id,
        });
      },
      closeTime() {
        this.showMoreTime = false;
      },
      async showAdjust(event) {
        event.stopPropagation();
        if (this.recentList.type === 1 || this.recentList.type === 2) {
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: '补课/临时课不支持调课哦',
            width: '14em',
          });
          return;
        }
        if (this.recentList.can_change.err === 10360) {
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: '调课时间还未到，课前14天允许调课，再等下吧~',
            width: '17.6em',
          });
          return;
        }
        if (this.recentList.can_change.err === 10352) {
          const tipsTxt = '调课需提前24小时操作';
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: tipsTxt,
            width: '17.6em',
          });
          return;
        }
        if (this.recentList.can_change.err === 10353 || this.recentList.can_change.err === 10350) {
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: this.recentList.can_change.msg,
            width: '17.6em',
          });
          return;
        }
        if (this.recentList.can_change.err === 10351 || this.recentList.can_change.err === 10355) {
          const tipsTxt = '该课节已上课';
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: tipsTxt,
            width: '17.6em',
          });
          return;
        }
        if (this.recentList.classroom.adjusts <= 0) {
          const tipsTxt = '您的调课机会已用完';
          this.$vux.toast.show({
            time: 2000,
            type: 'text',
            isShowMask: true,
            position: 'middle',
            text: tipsTxt,
            width: '17.6em',
          });
          return;
        }
        if ((this.recentList.can_change.err === 0 &&
        this.recentList.classroom && this.recentList.classroom.adjusts > 0)) {
          await setApilog({
            event_type: 20017,
            route: '/index',
            ext1: 1,
            ext2: this.recentList.course_id,
          });
          await this.$router.push({
            name: 'adjustTeacher',
            params: {
              courseId: this.recentList.course_id,
              scheduleId: this.recentList.id,
            },
            query: {
              teacher_id: this.recentList.teacher_id,
              change_num: this.recentList.classroom.adjusts,
            },
          });
        }
      },
    },
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .show_more_time{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 500;
    .show_more_time_con{
      width: 80%;
      background: #fff;
      border-radius: .2rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: .28rem;
      padding: .4rem;
      .nomal{
        text-align: left;
        margin-bottom: 0.5rem;
      }
      .leftnomal{
        text-align: left;
      }
      .right{
        padding-left: 1.68rem;
      }
      .close{
        display: block;
        width: .64rem;
        height: .64rem;
        .bg-m('@{img-path}dialog-close-big.png');
        background-size: 100%;
        position: absolute;
        left: 50%;
        bottom: -.8rem;
        margin-left: -.32rem;
      }
    }
  }
  .course-items{
      background: @new-col-bg-white;
      box-shadow:0 .04rem .2rem 0 rgba(0,0,0,0.1);
      border-radius: 0.08rem;
      position: relative;
      margin-top: 0.2rem;
      overflow: hidden;
      .rencent-content{
        padding:0.26rem 0.35rem 0.4rem 0.36rem;
        time{
            height: 0.5rem;
            font-size: 0.36rem;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            line-height: 0.5rem;
        }
        .main-time{
            color: @new-col-title-purple;
        }
        .extra-time{
            color: @new-col-orange;
        }
        .type{
            height: 0.4rem;
            position: absolute;
            right: 0;
            top: 0;
            padding-left: .18rem;
            padding-right: .1rem;
            height: .4rem;
            font-size: .2rem;
            text-align: center;
            line-height: .4rem;
            border-radius: 0.2rem 0 0 0.2rem;
            margin-top: .32rem;
            font-weight: 500;
            &.minor{
            background: @new-col-bg-orange;
            color: @new-col-orange;
            }
            &.major{
            color: @new-col-purple;
            background: @new-col-bg-purple;
            }
            &.he{
            color: @new-col-purple;
            background: @new-col-bg-purple;
            }
        }
        .name{
            margin: .16rem 0 0.04rem 0;
            font-family:PingFangSC-Medium;
            font-size: .32rem;
            color: @new-col-title-dark;
            line-height: .45rem;
            font-weight: 500;
            width: 75%;
            .label{
                display: inline-block;
                height: .30rem;
                border-radius: 15px 15px 15px 0px;
                font-size: .2rem;
                color: @new-col-white;
                line-height: .3rem;
                text-align: center;
                vertical-align: middle;
                margin: 0 .01rem .1rem;
                width: .53rem;
                background: linear-gradient(270deg,rgba(255,204,88,1) 0%,rgba(255,166,85,1) 100%);
            }
        }
        .title-name {
            height:0.4rem;
            font-size:0.28rem;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color: @new-col-font-gray;
            line-height:0.40rem;
        }
        .infoTeacher {
            width: 75%;
            height: .6rem;
            margin-top: 0.28rem;
            .avatar{
                width: .6rem;
                height: .6rem;
                overflow: hidden;
                display: inline-block;
                img{
                    width: .6rem;
                    height: .6rem;
                    border-radius: 50%;
                }
            }
            .teacher-name{
                color: @new-col-font-gray;
                display: inline-block;
                height: .6rem;
                vertical-align: bottom;
                padding-left: .2rem;
                font-size:0.24rem;
                font-family:PingFangSC-Regular;
                font-weight:400;
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
            text-align: center;
            bottom: 0.44rem;
            background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
            .light{
                color: @new-col-white;
                background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
            }
        }
        .btn-un-signup{
            display: inline-block;
            width:1.44rem;
            padding:0.1rem 0.23rem;
            position: absolute;
            right: 0.35rem;
            border-radius: 0.3rem;
            text-align: center;
            bottom: 0.44rem;
            background: @new-col-bg-gray;
            .unlight{
                background: @new-col-bg-gray;
                color: @new-col-font-gray;
            }
        }
        .more_time{
            display: inline-block;
            position: absolute;
            right: 0.35rem;
            height:0.40rem;
            font-size:0.28rem;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color: @new-col-orange;
            line-height:0.40rem;
            bottom: 0.4rem;
        }
      }
  }
</style>
