import getOrigin from '@/utils/origin';
import { second2time } from '@/utils/index.js';
import { formatMoney } from '@/filters';
import { getCourseInfo,
    getPackageInfo,
    getSuggestTeacher,
    getUserInfo,
    getCourseLists,
    orderDetail,
    getPayParams,
} from '@/api';

/* eslint-disable no-undef */
export default {
  data() {
    return {
      isDisabled: false,
      orderId: 0,
      isBookSelected: false,
      teacherId: 0,
      userInfo: {},
      courseInfo: {},
      book: {},
      forceBuy: 1,
      isChecked: [],
      isRadio: '',
      orderInfo: {},
      // 插班报信息
      title: '',
      price: 0,
      discount_price: 0,
      start_at: '',
      end_at: '',
    };
  },
  filters: { formatMoney },
  computed: {
    //从未支付／选时间页面跳转而来
    from() {
      if (this.$route.query.order_id) {
        return 'unpay';
      }
      return 'time';
    },
    //所在平台
    origin() {
      if (getOrigin.startsWith('wechat')) {
        return 'wechat';
      } else if (getOrigin.startsWith('peiyou')) {
        return 'peiyou';
      } else if (getOrigin.startsWith('mobile')) {
        return 'mobile';
      }
      return 'pc';
    },
    week() {
      if (this.$route.query.week) {
        return this.$route.query.week;
      }
    },
    time() {
      if (this.$route.query.time) {
        return this.$route.query.time;
      }
    },
    times() {
      if (this.$route.query.week) {
        return this.computeTimes(this.week, this.time);
      }
    },
    type() {
      if (this.$route.query.type) {
        return this.$route.query.type === 'course' ? 1 : 2;
      }
    },
    courseTypeKey() {
      if (Number(this.$route.query.type) === 2) {
        return 'package_id';
      }
      return 'course_id';
    },
    infoId() {
      return this.type === 2
        ? this.$route.query.package_id
        : this.$route.query.course_id;
    },
    totalFee() {
      if (this.book && this.isChecked.length) {
        return (this.price + this.book.price) - this.discount_price;
      }
      return this.price - this.discount_price;
    },
  },
  methods: {
    //计算要显示的上课时间
    computeTimes(week, time) {
      const weekCN = ['天', '一', '二', '三', '四', '五', '六', '日'];
      const rateText = this.courseInfo.type === 1 ? '每周' : '周';
      if (week.includes(',')) {
        const weeks = week.split(',');
        const times = time.split(',');
        return `${rateText}${weekCN[weeks[0]]} ${second2time(times[0])} 和 ${rateText}${weekCN[weeks[1]]} ${second2time(times[1])}`;
      }
      if (week > 0) {
        return `${rateText}${weekCN[week]} ${second2time(time)}`;
      }
      return `每天 ${second2time(time)}`;
    },
    getInfo() {
      if (this.type === 'course') {
        return getCourseInfo(this.infoId).then(() => {
          this.courseInfo = this.$store.state.courseInfo;
          this.title = this.courseInfo.title;
          this.book = this.courseInfo.book;
          if (this.courseInfo.must_book) {
            this.forceBuy = 1;
            this.isChecked = ['1'];
          }
        });
      }
      return getPackageInfo(this.infoId).then(() => {
        this.courseInfo = this.$store.state.packageInfo;
        this.title = this.courseInfo.title;
        this.book = this.courseInfo.book;
        if (this.courseInfo.force_buy) {
          this.forceBuy = 1;
          this.isChecked = ['1'];
        }
      });
    },
    //获取推荐老师
    getSuggestTeacher() {
      getSuggestTeacher(this.infoId, this.type, this.week, this.time).then((res) => {
        if (res.error_code === 0) {
          // this.teacherInfo = res.data;
          this.teacherId = res.data.id;
        } else {
          this.handleError(res.error_code, res.error_msg);
        }
      });
    },
    courseList() {
      if (this.from === 'time') {
        this.$router.push({
          name: 'courseLists',
          query: {
            id: this.infoId,
            week: this.week,
            time: this.time,
            type: this.type === 'course' ? 1 : 2,
            teacher_id: this.teacherId,
          },
        });
      } else {
        this.$router.push({
          name: 'courseLists',
          query: {
            order_id: this.orderId,
            teacher_id: this.orderInfo.teacher_id,
          },
        });
      }
    },
    checkAddress() {
      if (!this.userInfo.has_book_address) {
        this.$vux.toast.show({
          text: '请填写教材邮寄信息',
          type: 'warn',
          time: 2000,
        });
        return false;
      }
    },
    preparePay() {
      //判断是否完善邮寄信息
      if (this.isChecked.length && this.from === 'time') {
        this.checkAddress();
      }
      this.isDisabled = true;
      if (this.from === 'time') {
        this.postOrder();
      } else {
        this.handlePay();
      }
    },
    //下单，生成订单
    postOrder() {
      const url = `${this.apiConfig.host}/order/orders`;
      const data = {
        week: this.week,
        time: this.time,
        [this.courseTypeKey]: this.infoId,
        teacher_id: this.teacherId,
        is_book: this.isChecked.length,
      };
      return this.$http.post(url, data).then((res) => {
        if (res.error_code === 0) {
          this.pollOrderStatus();
        } else {
          this.isDisabled = false;
          this.handleError(res.error_code, res.error_msg);
        }
      });
    },
    pollOrderStatus() {
      const url = `${this.apiConfig.host}/order/orders/status?${this.courseTypeKey}=${this.infoId}`;
      let times = 1;
      this.timer = setInterval(() => {
        this.$http.get(url).then((res) => {
          if (times >= 3) {
            clearInterval(this.timer);
            this.$vux.toast.show({
              time: 2000,
              type: 'warn',
              isShowMask: true,
              position: 'middle',
              text: '支付失败，请重试！',
              width: '17.6em',
            });
            setTimeout(() => {
              this.isDisabled = false;
            }, 2000);
          }
          //创建订单正在处理中...
          if (Number(res.error_code) === 10402) {
            times += 1;
          }
          console.log(res);
          //轮询成功
          if (res.error_code === 0) {
            clearInterval(this.timer);
            this.handlePay();
          } else {
            clearInterval(this.timer);
            this.handleError(res.error_code, res.error_msg);
          }
        });
      }, 3000);
    },
    handlePay() {
      if (this.totalFee === 0) {
        this.success(this.orderId);
      }
      if (this.origin === 'wechat') {
        this.handleWePay(this.orderId);
      } else {
        console.log(this.orderId);
      }
    },
    /**
     * wechat pay
     */
    handleWePay(orderId, type = 'WECHAT_PUBLIC') {
      return getPayParams(orderId, type).then((res) => {
        if (res.error_code === 0) {
          this.onBridgeReady(res.data);
        } else {
          this.fail(res.error_code, res.error_msg);
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
            text: '下单失败，请重试',
            width: '17.6em',
          });
          setTimeout(() => {
            this.redirectUnpay();
          }, 2000);
        }
      });
    },
    //支付成功，跳到支付成功页面
    success(orderId) {
      this.isDisabled = false;
      this.$router.replace({
        name: 'successOrder',
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
      this.$router.replace({
        name: 'rejectOrder',
        query: {
          id: this.infoId,
          type: this.type,
          code: errorCode,
          msg: errorMsg,
          course_key: this.courseTypeKey,
        },
      });
    },
    async init4time() {
      await getUserInfo().then(() => {
        this.userInfo = this.$store.state.userInfo;
      });
      await this.getInfo();
      await this.getSuggestTeacher();
      // 请求课程具体信息，插班报
      const data = {
        id: this.infoId,
        week: this.week,
        time: this.time,
        type: this.type,
      };
      await getCourseLists(data).then((res) => {
        if (res.error_code === 0) {
          this.price = res.data.total_fee;
          this.discount_price = res.data.gift_fee;
          if (res.data.book) {
            this.discount_price += res.data.book.book_discount;
          }
          this.start_at = res.data.start_at;
          this.end_at = res.data.end_at;
        } else {
          this.handleError(res.error_code, res.error_msg);
        }
      });
    },
    async init4unpay() {
      const data = {
        id: -1,
        order_id: this.orderId,
      };
      await orderDetail(this.orderId).then((res) => {
        this.orderInfo = res.data;
        this.teacherId = res.data.teacher_id;
      });
      await getCourseLists(data).then((res) => {
        this.title = res.data.title;
        this.book = res.data.book;
        this.price = res.data.total_fee;
        this.discount_price = res.data.gift_fee;
        if (res.data.book) {
          this.discount_price += res.data.book.book_discount;
        }
        this.start_at = res.data.start_at;
        this.end_at = res.data.end_at;
        //未支付订单如果含有教材信息，必须购买
        if (this.book) {
          this.forceBuy = 1;
          this.isChecked = ['1'];
        }
      });
    },
  },
  mounted() {
    if (this.from === 'unpay') {
      this.orderId = this.$route.query.order_id;
      this.init4unpay();
    }
    if (this.from === 'time') {
      this.init4time();
    }
  },
};
