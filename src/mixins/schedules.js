import moment from 'moment';
import DateSchedule from '@/components/schedule/DateSchedule';
import PopAdjust from '@/components/common/PopAdjust';
import Loading from '@/components/loading/Index';
import { setApilog, getUserInfo } from '@/api';

export default {
  components: {
    DateSchedule,
    PopAdjust,
    Loading,
  },
  data() {
    return {
      viewData: {},
      schedules: [],
      thisDate: '',
      scheduleList: [],
      todayDate: '',
      checkDate: '',
      showPop: false,
      adjustParams: {},
      error: {
        code: 0,
        msg: '加载中...',
      },
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    getShowView(date) {
      const thisDate = moment(date).format('YYYY-MM-DD');
      const yearMonth = moment(thisDate).format('YYYY年MM月');
      const startAt = moment(thisDate).startOf('month').format('YYYY-MM-DD');
      const endAt = moment(thisDate).endOf('month').format('YYYY-MM-DD');
      const startWeek = moment(thisDate).startOf('month').startOf('week');
      const endWeek = moment(thisDate).endOf('month').endOf('week');
      const cnt = endWeek.diff(startWeek, 'd') + 1;
      const weeks = cnt / 7;
      const list = [];
      const startDate = startWeek.format('YYYY-MM-DD');
      for (let i = 0; i < weeks; i += 1) {
        const arr = [];
        for (let j = 0; j < 7; j += 1) {
          arr.push(moment(startDate).add((7 * i) + j, 'd'));
        }
        list.push(arr);
      }
      this.viewData = {
        yearMonth: yearMonth,
        startAt: startAt,
        endAt: endAt,
        list: list,
      };
      return Promise.resolve();
    },
    // 获取当月课
    getSchedule() {
      const start = this.viewData.startAt.replace(/\./g, '-');
      const end = this.viewData.endAt.replace(/\./g, '-');
      const url = `${this.apiConfig.host}/classroom/schedules/date-range?start_date=${start}&end_date=${end}`;
      return this.$http.get(url, {
        headers: {
          Accept: 'application/vnd.vipx.v2+json',
        },
      }).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.schedules = res.data;
      });
    },
    // 判断是否为空对象
    isEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
    // 上课类型
    isType(day, type) {  // 1-正式课 2-辅修课 3-结课
      let tags = false;
      if (this.isEmpty(this.schedules) ||
        this.schedules[day] === undefined ||
        this.isEmpty(this.schedules[day])) {
        return false;
      }
      if (type === 0 && (this.schedules[day]['1v1'] > 0 || this.schedules[day].tv > 0)) {
        tags = true;
      }
      if (type === 1 && this.schedules[day]['1v1'] > 0) {
        tags = true;
      }
      if (type === 2 && this.schedules[day].tv > 0) {
        tags = true;
      }
      return tags;
    },
    getList(date) {
      this.error.code = 0;
      this.error.msg = '加载中...';
      this.checkDate = date;
      const url = `${this.apiConfig.host}/classroom/schedules/date?date=${date}`;
      return this.$http.get(url).then((res) => {
        this.error.code = 1;
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.scheduleList = res.data;
      });
    },
    async moveMonth(type) {
      const date = moment(this.viewData.startAt).add(type, 'month').format('YYYY-MM-DD');
      await this.getShowView(date);
      await this.getSchedule();
    },
    getDate(type) {
      this.checkDate = this.todayDate;
      if (type === 1 && typeof this.$route.query.date !== 'undefined' && this.$route.query.date !== '') {
        this.checkDate = this.$route.query.date;
      }
      return Promise.resolve();
    },
    showAdjust(item) {
      // this.showPop = true;
      this.adjustParams = item;
      this.dialogData.changeNum = this.adjustParams.changeNum;
      this.dialogData.show = true;
    },
    goTime() {
      this.$router.push({
        name: 'adjustTeacher',
        params: {
          courseId: this.adjustParams.courseId,
          scheduleId: this.adjustParams.scheduleId,
        },
        query: {
          teacher_id: this.adjustParams.teacherId,
          date: moment(this.adjustParams.date).format('YYYY-MM-DD'),
          change_num: this.adjustParams.changeNum,
        },
      });
    },
    cancelAdjust() {
      this.dialogData.show = false;
    },
    confirmAdjust() {
      if (this.adjustParams.changeNum === 0) {
        return false;
      }
      this.dialogData.show = false;
      this.goTime();
    },
    async init(type) { // 1- 页面初始化 2- today
      this.todayDate = await moment().format('YYYY-MM-DD');
      await this.getDate(type);
      await this.getShowView(this.checkDate);
      await this.getSchedule();
      await this.getList(this.checkDate);
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.init(1).then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
    if (!this.$store.state.userInfo) {
      getUserInfo();
    }
    setApilog({
      event_type: 70000,
      route: '/index',
      ext1: 1,
      ext2: this.adjustParams.courseId,
    });
  },
  activated() {
    if (this.$route.query.date) {
      this.init(1);
    }
    if (['home', 'mine'].indexOf(this.$store.state.route.from.name) > -1) {
      this.init(0);
    }
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false;
    next();
  },
};
