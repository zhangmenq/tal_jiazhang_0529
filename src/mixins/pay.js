import getOrigin from '@/utils/origin';
import { formatMoney, formatDate, formatMobile } from '@/filters';
import { getWxPayParams, wxpayH5 } from '@/api';
import apiConfig from '@/config';

/* eslint-disable no-undef */
export default {
  data() {
    return {
      isDisabled: false,
      payWay: 1,
      timer: '',
    };
  },
  filters: { formatMoney, formatDate, formatMobile },
  computed: {
    //所在平台
    origin() {
      return getOrigin();
    },
    isShortCourse() { // 是否是短期班
      let typeFlag = false;
      if (this.courseInfo) {
        typeFlag = this.courseInfo.type === 1 && this.courseInfo.class_type === 1;
      }
      return typeFlag;
    },
  },
  methods: {
    canpay() {
      if (!this.isExp && !this.isShortCourse && !this.isShort && !this.agreement && (this.from === 'time' || this.from === 'unpay')) {
        return false;
      }
      if (this.from === 'time' && this.addressBoxShow && !this.bookAddress) {
        return false;
      }
      if (this.origin !== 'wechat' && Number(this.payWay) === 0) {
        return false;
      }
      return true;
    },
    //课程清单列表
    courseList() {
      if (this.from === 'time') {
        this.$router.push({
          name: 'courseLists',
          query: {
            id: this.infoId,
            week: this.week,
            time: this.time,
            type: this.type,
            teacher_id: this.teacherId,
            show_book: this.isBook,
            date: this.date,
          },
        });
      } else {
        this.$router.push({
          name: 'courseLists',
          query: {
            order_id: this.orderId,
            teacher_id: this.orderInfo.teacher_id,
            show_book: this.orderInfo.book ? 1 : 0,
          },
        });
      }
    },
    handlePay() {
      if (Number(this.finalFee) === 0) {
        this.success(this.orderId);
        return;
      }
      // if (this.origin === 'wechat') {
      //   this.handleWePay(this.orderId);
      // }
      if (Number(this.payWay) === 1 && this.origin !== 'wechat') { // 支付宝
        this.handleAliPay(this.orderId);
      }
      if (Number(this.payWay) === 2 && this.origin === 'wechat') { // 微信
        this.handleWePay(this.orderId);
      }

      // if (Number(this.payWay) === 2 && this.origin !== 'wechat') { // h5微信
      //   this.handleWxpayH5(this.orderId);
      // }

      if (Number(this.payWay) === 3) { // 银联支付
        this.handleUnionpay(this.orderId);
      }
    },
    /**
     * wechat pay
     */
    handleWePay(orderId) {
      return getWxPayParams(orderId).then((res) => {
        if (res.error_code === 0) {
          this.onBridgeReady(res.data);
        } else {
          this.handleError(res.error_code, res.error_msg);
        }
      });
    },
    //调起微信支付
    onBridgeReady(data) {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
      },
      (res) => {
        this.isDisabled = false;
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          this.success(this.orderId);
        } else {
          this.$vux.toast.show({
            time: 2000,
            type: 'warn',
            isShowMask: true,
            position: 'middle',
            text: '尊敬的客户，官方账户还未收到该订单款项，请重新支付完成报名。',
            width: '17.6em',
          });
          setTimeout(() => {
            this.redirectUnpay();
          }, 2000);
        }
      });
    },
    //处理支付宝
    handleAliPay(orderId) {
      // this.polling(orderId);
      const url = `${apiConfig.host}orders/${orderId}/alipay-h5`;
      location.href = url;
    },
    //银联支付
    handleUnionpay(orderId) {
      const url = `${apiConfig.host}orders/${orderId}/unionpay`;
      location.href = url;
    },
    // 微信H5 支付
    handleWxpayH5(orderId) {
      wxpayH5(orderId).then((res) => {
        if (res.error_code !== 0) {
          this.handleError(res.error_code, res.error_msg);
          return;
        }
        if (res.data.mweb_url === '') {
          this.handleError(res.error_code, '跳转支付地址为空');
          return;
        }
        location.href = res.data.mweb_url;
      });
    },
    //支付成功，跳到支付成功页面
    success(orderId) {
      this.isDisabled = false;
      const name = this.isShortCourse || this.isShort ? 'paySuccess' : 'successOrder';
      this.$router.replace({
        name,
        query: {
          order_id: orderId,
        },
      });
    },
    //跳往未支付列表
    redirectUnpay() {
      this.isDisabled = false;
      this.$router.replace({
        name: 'unpayOrder',
      });
    },
    // 跳往到已支付列表
    redirectPaid() {
      this.isDisabled = false;
      this.$router.replace({
        name: 'paidOrder',
      });
    },
    // 处理错误码
    handleError(errorCode, errorMsg) {
      this.isDisabled = false;
      let isExp = 0;
      if (this.from !== 'unpay' && this.courseInfo) {
        isExp = [3, 5].indexOf(this.courseInfo.type) > -1 ? 1 : 0;
      }
      this.$router.replace({
        name: 'rejectOrder',
        query: {
          id: this.infoId,
          type: this.type,
          code: errorCode,
          msg: errorMsg,
          course_key: this.courseTypeKey,
          is_exp: isExp,
        },
      });
    },
  },
  mounted() {
    if (this.origin === 'wechat') {
      this.payWay = 2;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isDisabled) {
      next();
    } else {
      console.log('cant redirect...');
    }
  },
};
