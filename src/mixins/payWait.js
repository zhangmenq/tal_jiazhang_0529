import { isEmpty } from 'lodash';
import moment from 'moment';
import { sessionSet, sessionGet } from '@/utils/localStorage';
import { orderDetail, setPointLog } from '@/api';
import { formatMobile, format2CountDown } from '@/filters';

/* eslint-disable no-undef */
export default {
  data() {
    return {
      isDisabled: false,
      orderInfo: {},
      teacherId: 0,
      userInfo: {},
      book: {},
      address: {},
      from: 'unpay',
      title: '',
      start_at: '',
      end_at: '',
      price: 0,
      course_price: 0,
      book_price: 0,
      gift_price: 0,
      serverTime: 0,
      timer: '',
      leftTime: 0,
      dialogData: {
        show: false,
        tips: '您确认取消订单吗？',
      },
      agreement: 0,
      showProtocol: false,
      isExp: false,
      isShort: false, // 是否是短期班
      cancelBtn: false,
      addressTipsShow: false,
      addressBoxShow: false,
      timeCN: '',
      total_lessons: 0,
      teacherInfo: {},
      showLeftTime: false,
    };
  },
  created() {
    const urlDataSource = this.$route.query.data_source;
    if (urlDataSource) {
      sessionSet('dataSource', urlDataSource);
      let msgType = '';
      if (this.$route.query.msg_type) {
        msgType = this.$route.query.msg_type;
      }
      setPointLog(126, 'wx_msg', Number(urlDataSource), msgType);
    }
  },
  computed: {
    orderId() {
      return this.$route.query.order_id;
    },
    dataSource() {
      return sessionGet('dataSource') ? Number(sessionGet('dataSource')) : 0;
    },
  },
  filters: {
    formatMobile,
    format2CountDown,
  },
  methods: {
    //编辑地址
    editAddress(editType) {
      let id = 0;
      if (editType === 1) {
        id = this.address.address_id;
      }
      this.$router.push({
        name: 'addressDetails',
        query: { edit_source: this.orderId },
        params: { id },
      });
    },
    closeProtocol() {
      this.agreement = 1;
      this.showProtocol = false;
    },
    // 取消
    cancelOrder() {
      this.dialogData.show = true;
    },
    cancel() {
      this.dialogData.show = false;
    },
    async confirm() {
      if (this.isDisabled) {
        return false;
      }
      this.isDisabled = true;
      this.dialogData.show = false;
      const url = `${this.apiConfig.host}/order/orders/${this.orderId}`;
      await this.$http.delete(url).then((res) => {
        if (res.error_code === 0) {
          this.dialogData.show = false;
        }
      });
      await this.$vux.toast.show({
        time: 10000,
        type: 'cancel',
        isShowMask: true,
        position: 'middle',
        text: '正在取消订单...',
        width: '17.6em',
      });
      await this.polling(this.orderId);
    },
    polling(orderId) {
      let count = 0;
      const url = `${this.apiConfig.host}/order/orders/${orderId}/cancel-status`;
      this.timer = setInterval(() => {
        if (count >= 3) {
          clearInterval(this.timer);
          this.cancelError();
        } else {
          this.$http.get(url).then((res) => {
            if (res.error_code === 0) { //取消成功
              clearInterval(this.timer);
              this.cancelSuccess();
            } else if (res.error_code === 10402) {
              count += 1;
            } else { //取消失败
              clearInterval(this.timer);
              this.cancelError();
            }
          });
        }
      }, 3000);
    },

    cancelSuccess() {
      this.isDisabled = false;
      this.$vux.toast.hide();
      this.$router.replace({
        name: 'cancelOrder',
      });
    },

    cancelError() {
      this.isDisabled = false;
      this.$vux.toast.hide();
      this.$vux.toast.show({
        time: 2000,
        type: 'cancel',
        isShowMask: false,
        position: 'middle',
        width: '17.6em',
        text: '订单取消失败，请稍后再试',
      });
    },
    //
    courseLists() {
      this.$router.push({
        name: 'courseLists',
        query: {
          order_id: this.orderId,
          teacher_id: this.orderInfo.teacher_id,
          show_book: this.orderInfo.book ? 1 : 0,
          is_reorder: this.orderInfo.referer === 5 ? 1 : 0,
        },
      });
      if (this.orderInfo.referer === 5) {
        setPointLog(122, '/pay/wait-pay', this.dataSource);
      }
    },
    bookDetails() {
      if (isEmpty(this.book)) {
        return false;
      }
      this.$router.push({
        name: 'material',
        params: {
          bookId: this.book.id,
        },
      });
    },
    checkAgreement() {
      this.$vux.toast.show({
        text: '请阅读并同意课程购买协议',
        type: 'warn',
        width: '14em',
        time: 2000,
        onHide() {
          window.scrollTo(0, 1000);
        },
      });
      return false;
    },
    goTeacher(teacherId) {
      this.$router.push({
        name: 'teacher',
        params: {
          id: teacherId,
        },
      });
    },
    //支付
    preparePay() {
      if (this.addressBoxShow && this.address.address_id === 0) {
        this.addressTipsShow = true;
        return;
      }
      if (!this.isExp && !this.isShort && !this.agreement) {
        this.checkAgreement();
        return;
      }
      if (!this.payWay && this.origin !== 'wechat') {
        this.$vux.toast.show({
          text: '请选择支付方式',
          type: 'warn',
          time: 2000,
          width: '17.6em',
        });
        return;
      }
      this.handlePay();
      if (this.orderInfo.referer === 5) {
        let msgType = '';
        if (this.$route.query.msg_type) {
          msgType = this.$route.query.msg_type;
        }
        setPointLog(120, '/pay/wait-pay', this.dataSource, msgType);
      }
    },
    async init() {
      await orderDetail(this.orderId).then((res) => {
        if (res.error_code > 0) {
          return;
        }
        if (res.data.status === 1) {
          this.$vux.toast.show({
            text: '订单已支付',
            type: 'warn',
            width: '13.6em',
            time: 2000,
          });
          setTimeout(() => {
            this.$router.push({
              name: 'paidOrder',
            });
          }, 2000);
          return;
        }
        if (res.data.status === -1 || res.data.status === -2) {
          this.$vux.toast.show({
            text: '订单已取消',
            type: 'warn',
            width: '13.6em',
            time: 2000,
          });
          setTimeout(() => {
            this.$router.push({
              name: 'cancelOrder',
            });
          }, 2000);
          return;
        }
        if (res.data.status === -3 || res.data.status === -4) {
          this.$vux.toast.show({
            text: '订单已退款',
            type: 'warn',
            width: '13.6em',
            time: 2000,
          });
          setTimeout(() => {
            this.$router.push({
              name: 'refundOrder',
            });
          }, 2000);
          return;
        }

        this.isExp = res.data.course && res.data.course[0].type === 5;
        this.isShort = res.data.course && res.data.course[0].type === 1 && res.data.course[0].class_type === 1;
        this.serverTime = new Date(res.server_time).getTime();
        this.orderInfo = res.data;
        this.teacherInfo = res.data.course[0].content[0].teacher;
        this.timeCN = res.data.course[0].content[0].time_cn;
        this.total_lessons = res.data.course[0].total_lessons;
        this.course_price = this.orderInfo.total_fee;
        this.gift_fee = this.orderInfo.gift_fee;
        let isReorderTime = false;
        if (res.data.cancel_show) {
          const start = res.data.cancel_show.start || '2018-11-19';
          const end = res.data.cancel_show.end || '2018-11-25';
          isReorderTime = moment() >= moment(start) && moment() <= moment(end);
        }
        console.log(isReorderTime);
        // 不是续报 || 是续报不再时间段 （可以取消订单）
        // if (this.orderInfo.referer !== 5 || (this.orderInfo.referer === 5 && isReorderTime)) {
        if (this.orderInfo.referer !== 5) {
          this.cancelBtn = true;
          this.showLeftTime = true;
        }
        if (!isEmpty(res.data.book)) {
          this.book = this.orderInfo.book;
          this.course_price = this.orderInfo.total_fee - this.book.total_fee;
        }
        this.address = this.orderInfo.address;
        this.teacherId = res.data.teacher_id;
        if (!res.data.buy_book) {
          if (!isEmpty(res.data.package)) {
            this.title = this.orderInfo.package.title;
            this.start_at = this.orderInfo.package.start_at;
            this.end_at = this.orderInfo.package.end_at;
          } else {
            this.title = this.orderInfo.course[0].title;
            this.start_at = this.orderInfo.course[0].start_at;
            this.end_at = this.orderInfo.course[0].end_at;
          }
        }
        const expiredAt = this.orderInfo.expired_at.replace(/-/g, '/');
        this.leftTime = parseInt(((new Date(expiredAt).getTime()) - (this.serverTime * 1000)) / 1000, 10);
        if (this.orderInfo.referer === 5 && this.leftTime <= (12 * 3600)) {
          this.showLeftTime = true;
        }
        if (!this.isShort && (this.orderInfo.course[0].content_type !== 3 || (this.orderInfo.course[0].content_type === 3 && moment(this.orderInfo.course[0].start_at) > moment('2019-07-14 23:59:59')))) {
          this.addressBoxShow = true;
        }
      });
    },
  },
  async mounted() {
    await this.init().then(() => {
      if (this.orderInfo.status === 0) {
        this.timer = setInterval(() => {
          this.leftTime -= 1;
          if (this.leftTime <= 0) {
            this.$router.replace({
              name: 'cancelOrder',
            });
          }
        }, 1000);
      }
    });
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
  beforeRouterLeave(to, from, next) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    next();
  },
};
