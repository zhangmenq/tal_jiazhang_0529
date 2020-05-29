import { isEmpty } from 'lodash';
import {
  getUserInfo,
  getCourseInfo,
  getPackageInfo,
  isOrdered,
} from '@/api';
import { formatMoney } from '@/filters';
import { goTest } from '@/utils';

export default {
  data() {
    return {
      classroomId: 0,
      orderId: 0,
      info: {
        book: {},
        course: [],
        course_image: [],
        price: 0,
      },
      userInfo: {},
      canBuy: true,
      discount: 0,
      course_price: 0,
      book_price: 0,
      total_price: 0,
      force_buy: 0,
      loading: true,
      contentType: 0,
      classType: 0, // 0 是长期课，1是短期班
      testId: 0,
    };
  },
  filters: {
    formatMoney,
  },
  computed: {
    //类型：课程包／主辅 ／普通课程
    type() {
      return this.$route.query.type;
    },
    //课程或课程包的id
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    getInfo() {
      if (this.type === 'package') {
        return getPackageInfo(this.id).then(() => {
          this.info = this.$store.state.packageInfo;
          this.course_price = this.info.price;
          this.force_buy = this.info.force_buy;
          this.total_price = this.course_price;
          this.contentType = this.info.course[0].content_type;
          if (!isEmpty(this.info.book)) {
            this.discount = this.info.book.price - this.info.discount_price;
            this.book_origin = this.info.book.price;
            this.book_current = this.discount > 0 ? (this.book_origin - this.discount) :
            this.book_origin;
            this.total_price = this.book_current + this.course_price;
          }
        });
      }
      return getCourseInfo(this.id).then(() => {
        this.info = this.$store.state.courseInfo;
        this.course_price = this.info.price;
        this.discount = this.info.book_discounts;
        this.force_buy = this.info.must_book;
        this.total_price = this.course_price;
        this.contentType = this.info.content_type;
        this.classType = this.info.class_type;
        /* if (!isEmpty(this.info.book)) {
          this.book_price = this.info.book.price;
          this.book_origin = this.book_price;
          this.book_current = this.discount > 0 ? (this.book_origin - this.discount) :
          this.book_origin;
          this.total_price = this.book_current + this.course_price;
        } */
      });
    },
    goDetails(course) {
      if (course.status < 1) {
        this.$vux.toast.show({
          text: '课程还未上架',
          type: 'warn',
          width: '16em',
          time: 2000,
        });
        return false;
      }
      if (this.type === 'package' && course.relation) {
        this.$router.push({
          name: 'bindingDetails',
          params: {
            id: course.id,
          },
          query: {
            type: 'binding',
          },
        });
      }
      if (this.type === 'package' && !course.relation) {
        this.$router.push({
          name: 'courseDetails',
          params: {
            id: course.id,
          },
          query: {
            type: 'course',
          },
        });
      }
    },
    bookDetails(bookId) {
      this.$router.push({
        name: 'material',
        params: {
          bookId: bookId,
        },
      });
    },
    //入学测试页面
    goTest() {
      goTest(this.userInfo.grade_id, this.userInfo.level_id);
    },
    cancelTest() {
      this.dialogData.show = false;
    },

    ordered() {
      isOrdered(this.id, this.type).then((res) => {
        if (res.data.order_status !== null) {
          this.classroomId = Number(res.data.order_status) === 1 ? res.data.classroom_id : 0;
          this.orderId = Number(res.data.order_status) === 0 ? res.data.order_id : 0;
        }
      });
    },
    bookCourse() {
      if (!this.canBuy || this.loading) {
        return false;
      }
      if (this.classroomId || this.orderId) {
        this.$router.push({
          name: this.classroomId ? 'scheduleList' : 'unpayOrder',
          params: this.classroomId ? { classroomId: this.classroomId } : {},
        });
        return;
      }
      // 是否有级别
      if (!isEmpty(this.userInfo) && (this.testId === 0 || Number(this.userInfo.level_id) === 67) && (this.classType !== 1)) {
        this.dialogData.show = true;
      } else {
        let queryData = { course_id: this.id };
        if (this.type === 'package') {
          queryData = { package_id: this.id };
        }
        this.$router.push({
          name: 'time',
          query: queryData,
        });
      }
    },
  },
  async mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.ordered();
    await this.getInfo().then(() => {
      const saltAt = this.info.sale_at.replace(/-/g, '/');
      const saleStop = this.info.sale_stop.replace(/-/g, '/');
      if ((new Date(saltAt).getTime() > (new Date().getTime()))
        || (new Date(saleStop).getTime() < (new Date().getTime()))) {
        this.canBuy = false;
      }
    });
    await getUserInfo().then(() => {
      this.userInfo = this.$store.state.userInfo;
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
      this.loading = false;
      this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.$store.state.userInfo.id}&grade_id=${this.$store.state.userInfo.grade_id}&level_id=${this.$store.state.userInfo.level_id}`).then((res) => {
        if (res.data.id) {
          this.testId = res.data.id;
        }
      });
    });
  },
  beforeLeaveRouter(to, from, next) {
    if (this.dialogData.show) {
      this.dialogData.show = false;
    }
    this.info.course_image = [];
    next();
  },
};
