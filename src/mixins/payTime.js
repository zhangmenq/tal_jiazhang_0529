import { isEmpty } from 'lodash';
import { second2time } from '@/utils/index.js';
import { getCourseInfo,
    getPackageInfo,
    getSuggestTeacher,
    getUserInfo,
    getCourseLists,
    getAddress,
    getTeacherInfo,
} from '@/api';
import apiConfig from '@/config';
import moment from 'moment';

/* eslint-disable no-undef */
export default {
  data() {
    return {
      from: 'time',
      orderId: 0,
      teacherId: 0,
      userInfo: {},
      courseInfo: {},
      book: {},
      forceBuy: 0,
      // isChecked: [],
      payWay: 1,
      // 插班报信息
      title: '',
      course_price: 0,
      course_discount: 1,
      discount_price: 0,
      book_discount: 0,
      book_price: 0,
      start_at: '1970-01-01',
      end_at: '1970-01-01',
      showCoupon: false,
      couponLists: [],
      selectedCoupon: 0,
      selectedCouponIds: '',
      selectedIndex: [],
      //员工折扣
      discountRate: 0,
      // 订单生成中
      ordering: false,
      //学生的邮寄地址
      bookAddress: null,
      teacherInfo: {
        id: 0,
      },
      timeCN: '',
      beginTimes: '',
      agreement: 0,
      showProtocol: false,
      addressTipsShow: false,
      addressBoxShow: false,
      total_lessons: 0,
    };
  },

  filters: {
    formatDiscount(discount) {
      return discount.toFixed(1);
    },
    formatAddress(address) {
      return `${address.area.tree_path}${address.address}`;
    },
  },

  computed: {
    isBook() {
      return Number(this.$route.query.is_book) || 0;
    },
    isExp() {
      return Boolean(this.$route.query.exp);
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
        return this.$route.query.type;
      }
    },
    date() {
      if (this.$route.query.date && this.isExp) {
        return this.$route.query.date;
      }
    },
    courseTypeKey() {
      if (Number(this.$route.query.type) === 2) {
        return 'package_id';
      }
      return 'course_id';
    },
    infoId() {
      return Number(this.type) === 2
        ? this.$route.query.package_id
        : this.$route.query.course_id;
    },
    coursePrice() { // 课程折扣后的金额
      if (this.course_discount < 1) {
        return this.course_price * this.course_discount;
      }
      return this.course_price;
    },
    couponFee() {
      return this.selectedCoupon;
    },
    employeeDiscount() {
      //体验课不参与员工折扣
      if (Number(this.type) === 1 && [3, 5].indexOf(this.courseInfo.type) > -1) {
        return 0;
      }
      //优惠券价格大于课程总价，不用计算员工折扣
      if (this.couponFee > this.course_price) {
        return 0;
      }
      if (this.discountRate === 1) {
        return 0;
      }
      /* if (this.selectedCoupon.money) {
        return (this.coursePrice - this.selectedCoupon.money) * (1 - this.discountRate);
      } */
      return this.coursePrice * (1 - this.discountRate);
    },
    finalFee() {
      // 课程*折扣 - 员工折扣优惠的金额 - 优惠券
      const coursePay = this.coursePrice - this.employeeDiscount - this.couponFee;
      const bookPayFee = this.isBook && this.book.payFee > 0 ? this.book.payFee : 0;
      // 课程优惠后的金额 小于等于0 只支付教材费用
      if (coursePay <= 0) {
        return bookPayFee;
      }
      return coursePay + bookPayFee;
    },
  },
  methods: {
    cancelTips(bool) {
      this.addressTipsShow = bool;
    },
    closeProtocol() {
      this.agreement = 1;
      this.showProtocol = false;
    },
    goTeacher(teacherId) {
      this.$router.push({
        name: 'teacher',
        params: {
          id: teacherId,
        },
      });
    },
    //选择优惠券
    showCouponPage() {
      if (this.couponLists.length) {
        this.showCoupon = true;
      }
    },
    selectCoupon(data) {
      if (data.index.length > 0) {
        this.showCoupon = false;
        this.selectedCoupon = data.totalCouponMoney;
        this.selectedIndex = data.index;
        this.selectedCouponIds = data.ids;
      } else {
        this.showCoupon = false;
        this.selectedCoupon = 0;
        this.selectedCouponIds = '';
        this.selectedIndex = [];
      }
    },
    //购买课程
    // buyBook(bookId) {
    //   this.$router.push({
    //     name: 'buyMaterial',
    //     params: {
    //       bookId: bookId,
    //     },
    //   });
    // },
    //
    getBookAddress() {
      // if (this.isBook) {
      getAddress().then((res) => {
        if (res.data !== null) {
          this.bookAddress = res.data;
        } else {
          this.bookAddress = null;
        }
      });
      // }
    },
    //计算要显示的上课时间
    computeTimes(week, time) {
      const weekCN = ['天', '一', '二', '三', '四', '五', '六', '日'];
      const rateText = this.courseInfo.type === 1 ? '每周' : '周';
      if (week.indexOf(',') > -1) {
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
      if (Number(this.type) === 1) {
        return getCourseInfo(this.infoId).then(() => {
          this.courseInfo = this.$store.state.courseInfo;
          this.title = this.courseInfo.title;
          this.book.id = this.courseInfo.book_id;
          // if (this.courseInfo.must_book) {
          //   this.forceBuy = 1;
          //   this.isChecked = ['1'];
          // }
        });
      }
      return getPackageInfo(this.infoId).then(() => {
        this.courseInfo = this.$store.state.packageInfo;
        this.title = this.courseInfo.title;
        this.book = this.courseInfo.book;
        // if (this.courseInfo.force_buy) {
        //   this.forceBuy = 1;
        //   this.isChecked = ['1'];
        // }
      });
    },
    //获取推荐老师
    getSuggestTeacher() {
      if (this.isExp) {
        getSuggestTeacher(this.infoId, this.type, this.week, this.time).then((res) => {
          if (res.error_code === 0) {
            this.teacherId = res.data.id;
            this.teacherInfo = res.data;
          } else {
            this.handleError(res.error_code, res.error_msg);
          }
        });
      } else {
        this.teacherId = this.$route.query.teacher_id;
        getTeacherInfo(this.teacherId).then(() => {
          this.teacherInfo = this.$store.state.teacherInfo;
          // this.teacherId = this.teacherInfo.id;
        });
      }
    },
    checkAddress() {
      if (!this.bookAddress) {
        this.addressTipsShow = true;
        return false;
      }
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
    },
    preparePay() {
      if (this.isDisabled) {
        return false;
      }
      // 短期班不勾选协议
      const isShortCourse = this.courseInfo.type === 1 && this.courseInfo.class_type === 1;
      //判断是否完善邮寄信息
      if (this.from === 'time' && this.addressBoxShow) {
        if (!this.bookAddress) {
          this.addressTipsShow = true;
          return;
        }
      }
      //判断是否勾选协议
      if (!this.isExp && !isShortCourse && !this.agreement && this.from === 'time') {
        this.checkAgreement();
        return;
      }
      if (!this.canpay()) {
        return false;
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
        is_book: this.isBook,
        refer: this.origin === 'wechat' ? 3 : 2,
        coupon_id: isEmpty(this.selectedCouponIds) ? '' : this.selectedCouponIds,
      };
      if (this.isExp) {
        data.date = this.date;
      }
      return this.$http.post(url, data).then((res) => {
        if (res.error_code === 0) {
          this.ordering = true;
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
            this.ordering = false;
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
          //轮询成功
          if (res.error_code === 0) {
            this.ordering = false;
            this.orderId = res.data;
            clearInterval(this.timer);
            this.handlePay();
          } else {
            this.ordering = false;
            clearInterval(this.timer);
            this.handleError(res.error_code, res.error_msg);
          }
        });
      }, 2000);
    },
    async init() {
      this.agreement = 0;
      await getUserInfo().then(() => {
        this.userInfo = this.$store.state.userInfo;
      });
      await this.getBookAddress();
      await this.getInfo();
      await this.getSuggestTeacher();
      // 请求课程具体信息，插班报
      const data = {
        id: this.infoId,
        week: this.week,
        time: this.time,
        type: this.type,
        teacher_id: this.teacherId,
      };
      if (this.isExp) {
        data.date = this.date;
      }
      await getCourseLists(data).then((res) => {
        if (res.error_code === 0) {
          this.course_price = res.data.total_fee;
          this.course_discount = res.data.course_discount;
          this.discount_price = res.data.gift_fee || 0;
          this.couponLists = res.data.coupons;
          this.discountRate = res.data.discount;
          this.total_lessons = res.data.total_lessons;

          if (!isEmpty(res.data.book)) {
            this.book.title = res.data.book.title;
            this.book.payFee = res.data.book.pay_fee;
            this.book.isFree = res.data.book.is_free;
            this.book_price = res.data.book.total_fee;
            this.book_discount = res.data.book.book_discount;
          }
          if (!isEmpty(this.couponLists)) {
            this.selectedCoupon = this.couponLists[0].money;
            this.selectedCouponIds = this.couponLists[0].id.toString();
            if (this.selectedIndex.length === 0) {
              this.selectedIndex.push(0);
            }
          }
          this.start_at = res.data.start_at;
          this.end_at = res.data.end_at;
          if (Number(this.type) === 2) {
            this.timeCN = res.data.course[0].content[0].time_cn;
            this.beginTimes = res.data.course[0].content[0].begin_times;
          } else {
            this.timeCN = res.data.content[0].time_cn;
            this.beginTimes = res.data.content[0].begin_times;
          }
        } else {
          this.handleError(res.error_code, res.error_msg);
        }
      });
      // 短期班
      const short = this.courseInfo.type === 1 && this.courseInfo.class_type === 1;
      //判断是否完善邮寄信息
      if (!short && (this.courseInfo.content_type !== 3 || (this.courseInfo.content_type === 3 && moment(this.courseInfo.start_at) > moment('2019-07-14 23:59:59')))) {
        this.addressBoxShow = true;
      }
    },
  },
  mounted() {
    this.init().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
  // beforeRouteEnter(to, from, next) {
  //   if (from.name === 'buyMaterial') {
  //     next((vm) => {
  //       vm.isChecked = ['1'];
  //     });
  //   } else {
  //     next();
  //   }
  // },
  activated() {
    if (this.$store.state.route.from.name === 'buyMaterial') {
      const host = apiConfig.host;
      const url = `${host}/user/users/me`;
      this.$http.get(url).then((res) => {
        this.userInfo = res.data;
      }).then(() => {
        this.getBookAddress();
      });
    }
    const needInit = ['expTime', 'time', 'selTeacher', 'teacher', 'courseLists', 'orderMaterial'];
    if (needInit.indexOf(this.$store.state.route.from.name) > -1) {
      this.init();
    }
  },
};
