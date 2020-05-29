<template>
  <div class="refund">
    <div class="item">
      <h4><span class="tit">退款课程</span><span class="content">{{info.course_name}}</span></h4>
      <p class="price"><span class="tit">退款金额 </span>
        <i v-if="info.refund_fee >= 0">￥{{info.refund_fee | formatMoney}}</i>
      </p>
    </div>
    <div class="item">
      <h4>退款原因</h4>
      <p>请勾选您退费的原因，以便我们能够提供更好的服务。（可多选）</p>
      <div class="reason">
        <checker v-model="reasonIds" type="checkbox" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
          <checker-item :value="index+1" v-for="(item, index) in checkboxList" :key="index">
            <em class="checkbox-icon"></em>{{ item }}
          </checker-item>
        </checker>
        <group>
          <x-textarea :show-counter="false" :rows="3" v-model="otherReason"></x-textarea>
        </group>
        <p class="other">退费后，您是否仍愿意购买VIPX的其他课程？</p>
        <checker
          v-model="radioVal"
          default-item-class="checkbox-item"
          selected-item-class="checkbox-item-selected">
          <checker-item :value="index" v-for="(item, index) in radioList" :key="index">
            <em class="radio-icon"></em>{{ item }}
          </checker-item>
        </checker>
      </div>
      <p class="wrong" v-if="msgErr !== ''">{{msgErr}}</p>
      <x-button
        class="btn-submit"
        @click.native="submint()">
        {{ isDisabled ? '正在处理退款...' : '提交' }}
      </x-button>
    </div>
  </div>
</template>

<script>
import { Checker, CheckerItem, Group, XTextarea, XButton } from 'vux';
import { formatMoney } from '@/filters';

export default {
  name: 'refund',
  components: {
    Checker,
    CheckerItem,
    Group,
    XTextarea,
    XButton,
  },
  filters: { formatMoney },
  data() {
    return {
      reasonIds: [],
      radioVal: '',
      otherReason: '',
      msgErr: '',
      checkboxList: [
        '教师教课水平不够好',
        '课程内容不合适',
        '孩子学习进步不明显',
        '网络效果不理想或设备操作复杂',
        '学习环境不够友好，孩子体验较差',
        '调课、转班等流程较麻烦',
        '课程费用较高，超出承受范围',
        '打算退班重报',
        '上课时间不合适',
        '其他（请在下框予以说明）',
      ],
      radioList: [
        '愿意',
        '不愿意',
        '不好说',
      ],
      info: {},
      timer: '',
      id: 0,
      isFree: false,
      isDisabled: false,
    };
  },
  methods: {
    getInfo() {
      this.$http.get(`${this.apiConfig.host}/order/orders/${this.id}/refund`).then((res) => {
        if (res.error_code !== 0) {
          console.log('没有订单');
          return;
        }
        this.info = res.data;
        if (parseInt(res.data.refund_fee, 10) === 0) {
          this.isFree = true;
        }
      });
    },
    submint() {
      if (this.isDisabled) {
        return false;
      }

      this.msgErr = '';
      if (this.reasonIds.length === 0) {
        this.msgErr = '请选择退款原因';
        return;
      }
      if (this.reasonIds.indexOf(10) > -1 && this.otherReason === '') {
        this.msgErr = '请填写“其他”的具体说明';
        return;
      }
      if (this.radioVal === '') {
        this.msgErr = '请选择退费后的购买意向';
        return;
      }
      this.isDisabled = true;
      // 接口对应的值
      const radioVal = { 0: 1, 1: 0, 2: 2 };
      const params = {
        pay_type: 'wechat',
        order_id: this.$route.params.orderId,
        other_course: radioVal[this.radioVal],
        reason_ids: this.reasonIds,
        other_reason: this.reasonIds.indexOf(10) > -1 ? this.otherReason : '',
      };
      this.$http.post(`${this.apiConfig.host}/order/orders/${this.id}/refund`, params).then((res) => {
        if (res.error_code !== 0) {
          this.msgErr = res.error_msg;
          this.isDisabled = false;
          return;
        }
        let msg = '提交成功，预计三日后到账';
        if (this.isFree) {
          msg = '提交成功';
        }
        this.$vux.toast.show({
          type: 'success',
          text: msg,
          width: '15em',
          time: '2000',
          isShowMask: true,
        });
        setTimeout(() => {
          this.$router.push({ path: '/mine/order' });
        }, 2000);
      });
    },
  },
  async mounted() {
    this.id = await this.$route.params.orderId;
    await this.getInfo();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.$vux.toast.hide();
  },
};
</script>
<style lang="less">
@import '../../../styles/basic';

.refund{
  min-height: 100%;
  background: @col-bg;
  padding: .2rem;
  .item{
    margin-bottom: .2rem;
    padding: .2rem .3rem;
    border-radius: .08rem;
    background: #fff;
    font-size: 0.3rem;
    h4,.price{
      display: flex;
      font-size: .36rem;
      .wordbreak;
      i{
        color: @col-lightred;
      }
    }
    .tit{
      width: 1.7rem;
      color: @col-gray;
    }
    .content{
      flex: 1;
    }
    .cus-checker;
    em.checkbox-icon,em.radio-icon{
      top: .22rem;
    }
    .checkbox-item,.radio-item{
      padding: .16rem 0 .16rem .5rem;
      position: relative;
    }
    .vux-checker-box{
      .checkbox-item{
        display: block;
      }
      & ~ .vux-checker-box{
        .checkbox-item{
          display: inline-block;
          margin-right: .6rem;
        }
      }
    }
    .wrong{
      text-align: center;
      color: #ff0000;
      font-size: 0.24rem;
      padding: 0 0 0.15rem 0;
    }
  }
  // .checkbox-icon,.radio-icon{
  //   position: absolute;
  //   top: .28rem;
  //   left: 0;
  //   .wh(.3rem,.3rem);
  //   display: block;
  //   border: .02rem solid @col-border;

  // }
  // .checkbox-item-selected .checkbox-icon,.radio-item-selected .radio-icon{
  //   border-color: @col-blue;
  //   &:before{
  //     content: '';
  //     .pos-box-hc(.34rem,.34rem);
  //     .bg-m('@{img-path}/checkbox.png');
  //     background-size: .28rem .28rem;
  //   }
  // }
  // .checkbox-icon{
  //   border-radius: .04rem;
  // }
  // .radio-icon{
  //   border-radius: 100%;
  // }
  .vux-x-textarea{
    padding: .1rem .16rem;
    border: .02rem solid @col-gray;
    border-radius: .08rem;
    font-size: .3rem;
  }
  .btn-submit{
    margin: .2rem auto;
    width: 85%;
    border-radius: .08rem;
    font-size: .36rem;
    .btn-purple;
  }
  .other{
    margin-top: .2rem;
  }
}
</style>
