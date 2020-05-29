<template>
  <div>
    <div class="newRefund">
      <div class="comblock">
        <div class="course-name">
          <span class="tit">退款课程</span>
          <span class="content">{{ info.course_name }}</span>
        </div>
      </div>
      <div class="comblock refund-amount">
        <span class="tit">退款金额</span>
        <strong class="price">￥{{ info.refund_fee | formatMoney }}</strong>
        <em class="tipRight" @click="checkDetails">明细查看&nbsp;&gt;</em>
      </div>
      <div class="comblock" @click="showPop = true">
        <span class="tit">退款原因</span>
        <em class="tipRight">请选择&nbsp;&gt;</em>
        <hr v-if="getReasonText() !== ''">
        <p class="text" v-if="getReasonText() !== ''">
          {{getReasonText()}}
        </p>
      </div>
      <popup v-model="showPop">
        <div class="refund-cause">
          <h2>
            退款原因
            <em>请勾选退费原因，以便我们提供更好服务（可多选）。</em>
          </h2>
          <checker
            v-model="reasonIds"
            type="checkbox"
            default-item-class="checkbox-item"
            selected-item-class="checkbox-item-selected">
            <checker-item
              :value="index+1"
              v-for="(item, index) in checkboxList"
              :key="index">
              <span>{{ item }}</span>
              <em class="checkbox-icon"></em>
            </checker-item>
          </checker>
          <group>
            <x-textarea
              ref="otherReason"
              :show-counter=true
              :rows="3"
              :max='200'
              v-model="otherReason"
              placeholder="请输入说明，字数不多于200字；">
            </x-textarea>
          </group>
          <x-button @click.native="showPop = false">确定</x-button>
        </div>
      </popup>
      <div class="comblock refund-tips">
        <p>退费后，您是否愿意购买VIPX的其他教程？</p>
        <checker
          v-model="radioVal"
          default-item-class="checkbox-item"
          selected-item-class="checkbox-item-selected">
          <checker-item :value="index" v-for="(item, index) in radioList" :key="index">
            <em class="radio-icon"></em>{{ item }}
          </checker-item>
        </checker>
      </div>
      <x-button class="btn-disable" :class="{'submitBtn': !isFree}" @click.native="submitBtn">
        {{ isDisabled ? '正在处理退款...' : '提交' }}
      </x-button>
    </div>
    <transition name="fade">
      <div class="alert" v-if="errMsg !== '' || showRefundConfirmed">
        <div class="alert-mask"></div>
        <div class="box" v-if="errMsg">
          <p class="alert-body">
            {{ errMsg }}
          </p>
          <x-button class="btn-purple mini-btn" @click.native="errMsg = ''">我知道了</x-button>
        </div>
        <div class="confirm-box" v-if="showRefundConfirmed">
            <p class="confirm-title">
              退费后，课程将无法继续上课
            </p>
            <div class="confirm-body">
              <p class="tips">如有疑问请联系</p>
              <p>
                <a class="tel" href="tel:4008002211">4008002211</a>转9
              </p>
              <div class="confirm-footer">
                <x-button
                  class="confirm-btn cancel"
                  @click.native="showRefundConfirmed = false">取消
                </x-button>
                <x-button class="confirm-btn" @click.native="postRefund">确认</x-button>
              </div>
            </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Checker, CheckerItem, Group, XTextarea, Popup, XButton } from 'vux';
import { formatMoney } from '@/filters';

export default {
  components: {
    Checker,
    CheckerItem,
    Group,
    XTextarea,
    Popup,
    XButton,
  },
  filters: { formatMoney },
  data() {
    return {
      showPop: false,
      showRefundPop: false,
      reasonIds: [],
      radioVal: '',
      otherReason: '',
      checkboxList: Array(10).fill('').concat([
        '美国语文课网络效果不理想',
        '文学通识课网络效果不理想',
        '设备操作复杂，体验较差',
        '支持设备过少，孩子体验较差',
        '教师教课水评不够好',
        '课程内容不合适',
        '孩子学习进步不明显',
        '上课时间不合适',
        '课程费用较高，超出承受范围',
        '调课、转班等流程较麻烦',
        '打算退班重报',
        '其他（请在下框予以说明）',
      ]),
      radioList: [
        '愿意',
        '不愿意',
        '不好说',
      ],
      info: {
        refund_fee: 0,
        course_name: '',
      },
      isFree: true,
      isDisabled: false,
      errMsg: '',
      showRefundConfirmed: false,
    };
  },
  computed: {
    orderId() {
      return this.$route.params.orderId || 0;
    },
  },
  watch: {
    reasonIds(newVal) {
      if (newVal.length) {
        this.errMsg = '';
      }
      if (newVal.indexOf(22) > -1) {
        document.getElementsByClassName('weui-textarea')[0].disabled = false;
        this.$refs.otherReason.focus();
      } else {
        document.getElementsByClassName('weui-textarea')[0].disabled = true;
        this.otherReason = '';
      }
    },
    otherReason(newVal) {
      if (newVal !== '') {
        this.errMsg = '';
      }
    },
    radioVal(newVal) {
      if (newVal !== '') {
        this.errMsg = '';
      }
    },
  },
  methods: {
    checkDetails() {
      this.$router.push({
        name: 'refundList',
        query: {
          order_id: this.orderId,
        },
      });
    },
    getRefundInfo() {
      this.$http.get(`${this.apiConfig.host}/order/orders/${this.orderId}/refund`).then((res) => {
        if (res.error_code === 0) {
          this.info = res.data;
          if (parseInt(res.data.refund_fee, 10) > 0) {
            this.isFree = false;
          }
        }
      });
    },
    getReasonText() {
      if (this.reasonIds.length === 0) {
        return '';
      }
      let text = '';
      this.reasonIds.forEach((item) => {
        if (item === 22) {
          if (this.otherReason === '') {
            text += '其他；';
          } else {
            text += `其他（${this.otherReason}）；`;
          }
        } else {
          text += `${this.checkboxList[item - 1]}；`;
        }
      });
      return text;
    },
    checkForm() {
      if (this.reasonIds.length === 0) {
        this.errMsg = '请选择退款原因';
      }
      if (this.reasonIds.indexOf(22) > -1 && this.otherReason === '') {
        this.errMsg = '请填写“其他”的具体说明';
      }
      if (this.radioVal === '') {
        this.errMsg = '请选择“您是否愿意购买VIPX 的其他课程”';
        this.showPop = false;
      }
    },
    submitBtn() {
      if (this.isDisabled || this.isFree) {
        return false;
      }
      this.checkForm();
      if (this.errMsg !== '') {
        return false;
      }
      this.showRefundConfirmed = true;
    },
    postRefund() {
      this.showRefundConfirmed = false; //关闭确认弹窗
      this.isDisabled = true;
      const radioVal = { 0: 1, 1: 0, 2: 2 };
      const params = {
        pay_type: 'wechat',
        order_id: this.orderId,
        other_course: radioVal[this.radioVal],
        reason_ids: this.reasonIds,
        other_reason: this.otherReason,
      };
      this.$http.post(`${this.apiConfig.host}/order/orders/${this.orderId}/refund`, params).then((res) => {
        if (res.error_code !== 0) {
          this.errMsg = res.error_msg;
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
        const timer = setTimeout(() => {
          clearTimeout(timer);
          this.$router.push({ path: '/mine/order' });
        }, 2000);
      });
    },
  },
  async mounted() {
    document.getElementsByClassName('weui-textarea')[0].disabled = true;
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.getRefundInfo();
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
};
</script>

<style lang="less">
@import '../../../styles/basic';
.alert {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .alert-mask {
    background: #878787;
    opacity: .6;
    width: 100%;
    height: 100%;
  }
  .box {
    position: absolute;
    top: 5rem;
    left: 15%;
    width: 70%;
    height: 3.05rem;
    background-color: rgba(255, 255, 255, 1);
    border-radius: .1rem;
    padding: .5rem .3rem;
    .alert-body {
      color: #1b223f;
      font-size: .3rem;
      line-height: .5rem;
      text-align: center;
    }
    .hotline{
      margin-top: .3rem;
      text-align: center;
      color: @col-subgray;
      span{
        display: block;
        font-size: .3rem;
        a{
          padding-right: .1rem;
          color: @col-light-purple;
        }
      }
    }
    .mini-btn {
      // background: @col-purple;
      // color: @col-white;
      .wh(1.8rem ,.7rem);
      font-size: .3rem;
      border-radius: .1rem;
      margin: .5rem auto .2rem;
      &.btn-purple{
        .btn-purple;
      }
      &.btn-plain-purple{
        .btn-plain(@col-purple);
      }
    }
    .btn-fn{
      margin-top: .3rem;
      text-align: center;
      .mini-btn{
        display: inline-block;
        margin: 0 .4rem;
        .wh(1.4rem,.7rem);
      }
    }
  }
  .confirm-box {
    position: absolute;
    top: 5rem;
    left: 15%;
    width: 70%;
    height: 4.1rem;
    background-color: rgba(255, 255, 255, 1);
    border-radius: .1rem;
    text-align: center;
    .confirm-title {
      margin: .5rem auto .46rem;
      font-size: .3rem;
      color: #1b223f;
      line-height: .5rem;
    }
    .confirm-body {
      margin-bottom: .42rem;
      color: #b0b7d1;
      font-size: .3rem;
      .tips {
        font-size: .24rem;
        line-height: .46rem;
      }
      .tel {
        color: #9157c8;
      }
      .confirm-footer {
        display: flex;
        justify-content: space-around;
        margin-top: .42rem;
      }
      .confirm-btn {
        margin-top: 0;
        background: @col-purple;
        color: @col-white;
        .wh(1.4rem, .7rem);
        font-size: .3rem;
        border-radius: .1rem;
      }
      .cancel {
        background: @col-white;
        color: @col-purple;
        border: .02rem solid @col-purple;
      }
    }
  }
}
.newRefund{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: @col-bg;
  padding: .2rem;
  font-size: .36rem;
  .comblock{
    background: @col-white;
    padding: 0 .2rem;
    .clearfix();
    min-height: 1.04rem;
    line-height: 1.04rem;
    margin-bottom: .2rem;
    border-radius: .1rem;
    span{
      font-size: .36rem;
      color: @col-darkgray;
      font-family: 'PingFangSC';
      &.tit{
        font-weight: bold;
        padding-right: .2rem;
      }
    }
    .text {
      height: .88rem;
      padding: .23rem 0;
      font-size: .3rem;
      line-height: .42rem;
      color: #b2b7ce;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tipRight{
      float: right;
      font-size: .3rem;
    }
  }
  .course-name{
    .l-h(.5rem);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: .25rem 0 0 0;
  }
  .refund-amount{
    strong{
      color: @col-orange;
      font-size: .36rem;
      font-weight: normal;
    }
  }
  .refund-tips{
    line-height: .42rem;
    padding-bottom: .2rem;
    p{
      font-size: .3rem;
      line-height: .5rem;
      padding: .1rem 0;
    }
    .checkbox-item{
      width: 33.3%;
    }
    em.checkbox-icon, em.radio-icon{
      top: .04rem!important;
    }
  }
  .refund-cause{
    padding: .3rem .3rem 1.1rem .3rem;
    background: @col-white;
    position: relative;
    h2{
      font-size: .36rem;
      text-align: center;
      em{
        display: block;
        font-size: .24rem;
        font-weight: normal;
        color: #666;
      }
      border-bottom: 1px solid @col-gray;
      padding-bottom: .2rem;
      margin: 0 .2rem .2rem;
    }
    .checkbox-item{
      position: relative;
      display: block!important;
      padding: 0 .3rem 0 .05rem!important;
      margin-bottom: .3rem;
    }
    .vux-x-textarea{
      padding: .1rem .16rem;
      border: .02rem solid #e8e8e8;
      border-radius: .08rem;
      font-size: .3rem;
    }
    .weui-btn {
      .wh(100%,.9rem);
      line-height: .9rem;
      background: @col-purple;
      color: @col-white;
      font-size: .36rem;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 0;
    }
  }
  .btn-disable{
    .wh(80%,.9rem);
    line-height: .9rem;
    font-size: .36rem;
    border-radius: .1rem;
    margin: 4.07rem auto .2rem;
    .btn-disable;
  }
  .submitBtn{
    background: @col-purple;
    color: @col-white;
  }
  .cus-checker();
  .checkbox-item{
    padding: 0 .3rem 0 .5rem;
  }
  em.checkbox-icon{
    left: auto!important;
    right: 0!important;
  }
  em.checkbox-icon, em.radio-icon{
    top: .06rem!important;
  }
}
</style>
