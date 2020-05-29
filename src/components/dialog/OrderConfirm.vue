<template>
  <div class="order-confirm">
    <div class="dialog center">
      <div class="loading" v-if="loading">
        <p>加载中…</p>
      </div>
      <template v-else>
        <div class="dialog-header">
          <h2>确认预约</h2>
        </div>
        <div class="dialog-body">
          <div class="teacher-infor">
            <span class="avatar">
              <img :src="selTeacher.avatar_url"
                v-if="selTeacher.avatar_url && selTeacher.avatar_url != ''"/>
              <img src="../../assets/default-photo-teacher.png" v-else/>
            </span>
            <div class="infor">
              <p><span class="col-purple">{{selTeacher.realname}}</span></p>
              <p>{{startTime}} 周{{weeks[selWeek]}} {{selTime.v}}</p>
            </div>
          </div>
          <div class="btn-fn">
            <x-button class="weui-btn btn-purple" @click.native="confirm()">{{ !isDisabled ? '确认' : '下单中...'}}</x-button>
            <x-button class="weui-btn btn-plain-purple" @click.native="closePop()" :disabled="isDisabled">取消</x-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';

export default {
  components: {
    XButton,
  },
  data() {
    return {
      isDisabled: false,
      loading: false,
      weeks: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日',
      },
      startTime: '',
    };
  },
  props: {
    selTime: {
      type: Object,
      default: () => {},
    },
    selWeek: {
      type: Number,
      default: 0,
    },
    selTeacher: {
      type: Object,
      default: () => {},
    },
    id: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    confirm() {
      if (this.isDisabled) {
        return false;
      }
      this.isDisabled = true;
      this.$emit('confirm');
    },
    closePop() {
      this.$emit('closePop');
    },
  },
  mounted() {
    // 获取开始时间
    this.loading = true;
    const params = `id=${this.id}&teacher_id=${this.selTeacher.id}&week=${this.selWeek}&time=${this.selTime.k}&type=${this.type}`;
    const url = `${this.apiConfig.host}/classroom/schedule/student-datatimes?${params}`;
    this.$http.get(url).then((res) => {
      this.loading = false;
      if (res.data.time) {
        this.startTime = res.data.time;
      }
    });
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.order-confirm{
  .cus-dialog-box;
  .dialog-body{
    padding-top: .3rem;
    .tips{
      margin-top: .3rem;
    }
    .btn-fn{
      margin-top: .4rem;
    }
  }
  .teacher-infor{
    .avatar{
      display: block;
      margin: 0 auto;
      .wh(1rem,1rem);
      border-radius: 100%;
      overflow: hidden;
      img{
        .wh-img;
      }
    }
    .infor{
      p{
        margin-top: .2rem;
        text-align: center;
        font-size: .26rem;
        span{
          display: block;
          .ellipsis-b;
          font-size: .3rem;
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
    }
  }
  .col-purple{
    color: @col-purple;
  }
}
</style>

