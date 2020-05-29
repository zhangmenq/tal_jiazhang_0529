<template>
  <div class="confirm-dialog">
    <div class="dialog center">
      <div class="loading" v-if="loading">
        <p>加载中…</p>
      </div>
      <template v-else-if="type === 1">
        <div class="dialog-header">
          <h2 class="adjust-title">确认调课</h2>
        </div>
        <div class="dialog-body">
          <div class="teacher-infor">
            <span class="avatar" v-if="teacherInfo && JSON.stringify(teacherInfo) !== '{}'">
              <img :src="teacherInfo.avatar_url"
                v-if="teacherInfo.avatar_url && teacherInfo.avatar_url != ''"/>
              <img src="../../assets/default-photo-teacher.png" v-else/>
            </span>
            <div class="infor">
              <p>
                <span class="col-purple" v-if="teacherInfo && JSON.stringify(teacherInfo) !== '{}'">
                  {{teacherInfo.realname}}
                </span>
              </p>
              <p v-if="scheduleInfo && JSON.stringify(scheduleInfo) !== '{}'">
                {{moment(scheduleInfo.start_at).format('MM-DD')}}
                周 {{ weeks[moment(scheduleInfo.start_at).format('d')] }}
                {{moment(scheduleInfo.start_at).format('HH:mm')}}
              </p>
            </div>
          </div>
          <p class="adjust-tips">调课至</p>
          <div class="teacher-infor">
            <span class="avatar">
              <img :src="selTeachers.avatar_url"
                v-if="selTeachers.avatar_url && selTeachers.avatar_url != ''"/>
              <img src="../../assets/default-photo-teacher.png" v-else/>
            </span>
            <div class="infor">
              <p><span class="col-purple">{{selTeachers.realname}}</span></p>
              <p>{{moment(selDate).format('MM-DD')}} 周 {{week}} {{time}}</p>
            </div>
          </div>
          <p class="tips col-orange">本次将扣除1次调课机会</p>
          <div class="btn-fn">
            <x-button class="weui-btn btn-plain-purple" @click.native="cancel()" :disabled="isDisabled">取消</x-button>
            <x-button class="weui-btn btn-purple" @click.native="confirm()">{{ !isDisabled ? '确认' : '调课中...'}}</x-button>
          </div>
        </div>
      </template>
      <div class="dialog-body" v-else>
        <div class="text-tips">
          <p>上好一节课需要充分的课前预习和课后复习巩固。</p>
          <p>本周您已经有3节课了哦，请换个时间调课吧~</p>
        </div>
        <div class="btn-fn">
          <x-button class="weui-btn btn-purple" @click.native="cancel()">我知道了</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';
import moment from 'moment';

export default {
  components: {
    XButton,
  },
  data() {
    return {
      loading: false,
      turnsPop: false,
      scheduleInfo: {},
      teacherInfo: {},
      weeks: {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
      },
      isDisabled: false,
      type: 1, // 1-调课确认弹框 2-提示弹框
    };
  },
  props: {
    oldTeacherId: {
      type: Number,
      default: 0,
    },
    oldscheduleId: {
      type: Number,
      default: 0,
    },
    selTeachers: {
      type: Object,
      default: {},
    },
    selDate: {
      type: String,
      default: '',
    },
    week: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
  },
  methods: {
    confirm() {
      if (this.isDisabled || this.selDate === '') {
        return;
      }
      this.isDisabled = true;
      // 检查是否可以调课
      const url = `${this.apiConfig.host}/classroom/schedules/${this.oldscheduleId}/exist-more-schedules?date=${this.selDate}`;
      this.$http.get(url).then((res) => {
        if (res.error_code > 0) {
          this.isDisabled = false;
          this.type = 2;
        } else {
          this.$emit('confirm');
        }
      });
    },
    moment(date) {
      return moment(date);
    },
    cancel() {
      this.$emit('closePop');
    },
  },
  mounted() {
    this.loading = true;
    const url = `${this.apiConfig.host}/classroom/schedules/${this.oldscheduleId}`;
    this.$http.get(url).then((res) => {
      if (res.error_code) {
        return;
      }
      this.scheduleInfo = res.data;
    }).then(() => {
      const teacherUrl = `${this.apiConfig.host}/teacher/teachers/${this.oldTeacherId}`;
      this.$http.get(teacherUrl).then((res) => {
        this.loading = false;
        if (res.error_code) {
          return;
        }
        this.teacherInfo = res.data;
      });
    });
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.confirm-dialog{
  .cus-dialog-box;
  .dialog-header{
     .adjust-title{
       font-weight:bold;
       color:@new-col-title-dark;
       font-size:.36rem;
    }
  }
 
  .dialog-body{
    padding-top: .3rem;
    .tips{
      margin-top: .3rem;
    }
    .text-tips{
      margin-top: .3rem;
    }
  }
  .teacher-infor{
    display: flex;
    .avatar{
      margin-right: .2rem;
      .wh(1rem,1rem);
      border-radius: 100%;
      overflow: hidden;
      img{
        .wh-img;
      }
    }
    .infor{
      flex: 1;
      color:@new-col-title-dark;
      .ellipsis-b;
      p{
        span{
          .ellipsis-b;
          display: block;
          color: @new-col-purple;
          font-weight: bold;
        }
      }
    }
  }
  p{
    &.col-orange{
      text-align: center;
      color: @col-orange;
    }
    &.adjust-tips{
      margin: .2rem 0 .3rem;
      text-align: center;
      font-weight: bold;
    }
  }

}
</style>

