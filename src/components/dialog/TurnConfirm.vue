<template>
  <!-- 转班确认弹框 -->
  <div class="cus-dialog-box">
    <div class="dialog center">
      <div class="loading" v-if="loading">
        <p>加载中…</p>
      </div>
      <template v-else>
        <div class="dialog-header">
          <h2 class="turn-title">确认信息</h2>
        </div>
        <div class="dialog-body">
          <p class="cont-tit">待转信息</p>
          <div class="cont-txt" v-if="info.turn_schedule_no > 0">
            <p><em>转班课节：</em><span>共{{info.turn_schedule_no}}节</span></p>
            <p><em>开始时间：</em><span class="col-purple">{{info.origin_start_at}}</span></p>
            <p><em>外教老师：</em><span class="col-purple">{{info.origin_teacher.realname}}</span></p>
          </div>
            <p class="cont-tit">转入信息</p>
            <div class="cont-txt" v-if="info.turn_schedule_no > 0">
            <p><em>转班课节：</em><span>共{{info.turn_schedule_no}}节</span></p>
            <p><em>开始时间：</em><span class="col-purple">{{info.start_time}}</span></p>
            <p><em>外教老师：</em><span class="col-purple">{{info.teacher.realname}}</span></p>
            <div class="not-turn"><em>不可转入课节：</em>
              <div class="not-turn-txt" v-if="info.not_turn_schedules.length > 0">
                <div v-for="(item, index) in info.not_turn_schedules" :key="index">
                  <span class="col-purple">第{{item.no}}节</span>
                  <span class="col-red">{{item.msg}}</span>
                </div>
              </div>
              <div class="not-turn-txt" v-else><span class="col-purple">0节</span></div>
            </div>
          </div>
          <div class="cont-txt vertical-center" v-else>
            当前无可转课节
          </div>
          <p class="tips col-orange" v-if="moment() > moment(info.course_start_at)">本次将扣除1次转班机会</p>
          <div class="btn-fn" v-if="info && JSON.stringify(info) !== '{}' && info.turn_schedule_no > 0">
            <x-button class="weui-btn btn-plain-purple" :disabled="isDisabled" @click.native="cancel()">取消</x-button>
            <x-button class="weui-btn btn-purple" @click.native="confirm()">{{ !isDisabled ? '确认' : '转班中...' }}</x-button>
          </div>
          <div class="btn-fn" v-else>
            <x-button class="weui-btn btn-purple" @click.native="cancel()">我知道了</x-button>
          </div>
        </div>
      </template>
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
  props: {
    classroomId: {
      type: Number,
      default: 0,
    },
    week: {
      type: Number,
      default: 0,
    },
    time: {
      type: Number,
      default: 0,
    },
    teacherId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      info: {},
      isDisabled: false,
    };
  },
  methods: {
    cancel() {
      this.$emit('closePop');
    },
    confirm() {
      if (this.isDisabled) {
        return;
      }
      this.isDisabled = true;
      this.$emit('confirm');
    },
    moment(date) {
      return moment(date);
    },
  },
  mounted() {
    this.loading = true;
    const params = `?week=${this.week}&time=${this.time}&teacher_id=${this.teacherId}`;
    const url = `${this.apiConfig.host}/classroom/classrooms/${this.classroomId}/turn-info${params}`;
    this.$http.get(url).then((res) => {
      this.loading = false;
      if (res.error_code) {
        console.log(res.error_code);
        return;
      }
      this.info = res.data;
    });
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.cus-dialog-box{
  .cus-dialog-box;
  .cont-tit{
    margin-top: .3rem;
    color:@new-col-title-dark;
    font-weight: bold;
  }
  .cont-txt{
    margin-top: .2rem;
    padding: .1rem .24rem;
    background:rgba(248,248,248,1);
    border-radius:10px;
    color:@new-col-title-dark;
    font-size: .26rem;
    &.vertical-center{
      padding: .4rem .24rem;
    }
    .note{
      font-size: .26rem;
      line-height: .42rem;
    }
    p{
      font-size: .26rem;
      line-height: .46rem;
      display: flex;
      em{
        width: 1.36rem;
      }
      span{
        flex: 1;
        .ellipsis-b;
        &.col-purple{
          color: @new-col-purple;
        }
      }
    }
    .not-turn{
      display: flex;
      em{
        width: 2rem;
      }
      .not-turn-txt{
         flex:2rem 1;
         .col-purple{
          color: @new-col-purple;
         }
         .col-red{
            color: @new-col-red;
            font-size: .2rem;
         }
      }
    }
  }
  .dialog-header {
    .turn-title{
      font-weight: bolder;
      font-size: .36rem;
      color:@new-col-title-dark;
    }
  } 
  p{
    &.col-orange{
      text-align: center;
      color: @col-orange;
    }
  }
}
</style>
