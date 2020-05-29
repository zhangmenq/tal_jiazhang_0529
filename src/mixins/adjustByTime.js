import WeekBox from '@/components/time/WeekBox';
import TimeBox from '@/components/time/TimeBox';
import TeacherBox from '@/components/time/TeacherBox';
import SelectBox from '@/components/time/SelectBox';
import NoContent from '@/components/common/NoContent';
import Loading from '@/components/loading/Index';

export default {
  components: {
    WeekBox,
    TimeBox,
    TeacherBox,
    SelectBox,
    NoContent,
    Loading,
  },
  data() {
    return {
      weekList: {},
      timeList: [],
      selWeek: '',
      selWeek_cn: {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日',
      },
      selDate: '',
      selTimes: {},
      courseInfo: {},
      timer: '',
      error: {
        code: 0,
        msg: '',
      },
      perPage: 1,
      teacherList: [],
      teacherFirst: 0, // 原班老师标识(第一个) 0.没有原班老师 1.原班老师无空闲时间 2.原班老师有空闲时间
      teacherLast: 0, // >0 可以请求下一页 =0不用请求下一页
      selTeachers: {},
      teacherFlag: 0, // 0-初始值 1-加载中。。 2-加载成功
      loadingTime: false,
      loadingData: false,
      teacherWhere: {
        attention: false,
        teacher_sex: 0,
        teams: '',
        teaching_age: 0,
      },
      teacherCounts: 0,
      realList: [], //有效的日期数组
      showTime: false,
      filtTop: 0,
      filtFixed: false,
      timeLoading: true,
    };
  },
  computed: {
    courseId() {
      return this.$route.params.courseId;
    },
    scheduleId() {
      return this.$route.params.scheduleId;
    },
    teacherId() {
      return this.$route.query.teacher_id;
    },
    hasFiltrate() {
      return (JSON.stringify(this.teacherWhere) !== '{}' && (this.teacherWhere.attention ||
        this.teacherWhere.teacher_sex > 0 ||
        this.teacherWhere.teams !== '' || this.teacherWhere.teaching_age));
    },
  },
  methods: {
    getWeekList() {
      const url = `${this.apiConfig.host}classroom/schedules/${this.scheduleId}/adjust-date-infos?course_id=${this.courseId}`;
      return this.$http.get(url).then((res) => {
        this.timeLoading = false;
        if (res.error_code !== 0) {
          this.error.code = 1;
          this.error.msg = res.error_msg;
          this.weekList = [];
          this.countdown();
          return;
        }
        this.weekList = res.data;
        res.data.forEach((item) => {
          if (item.time.length > 0) {
            this.realList.push(item);
          }
        });
        this.selWeek = this.realList[0].k;
        this.selDate = this.realList[0].v;
        this.timeList = this.realList[0].time;
      });
    },
    getTimeList() {
      let selItem = {};
      this.weekList.map((week) => {
        if (week.v === this.selDate) {
          selItem = week;
        }
        return week;
      });
      if (selItem.time.length === 0) {
        return;
      }
      this.timeList = selItem.time;
      // this.loadingTime = true;
      // let url = `${this.apiConfig.host}classroom/schedules/${this.scheduleId}/adjust-time?date=${this.selDate}&`;
      // url += `&course_id=${this.courseId}`;
      // return this.$http.get(url).then((res) => {
      //   this.loadingTime = false;
      //   if (res.error_code !== 0) {
      //     this.timeList = [];
      //     return;
      //   }
      //   this.timeList = res.data;
      // });
    },
    async init() {
      await this.getWeekList();
      await this.getTimeList();
    },
    selectWeek(item) {
      if (item.time.length === 0) {
        return;
      }
      if (item.week === this.selWeek && item.date === this.selDate) {
        return;
      }
      // 获取当前选中周的时间列表
      this.selWeek = item.week;
      this.selDate = item.date;
      this.teacherFlag = 0;
      this.teacherList = [];
      this.selTimes = {};
      this.selTeachers = {};
      this.teacherWhere = {
        attention: false,
        teacher_sex: 0,
        teaching_age: 0,
        teams: '',
      };
      this.getTimeList();
    },
    selectTime(item) {
      this.selTimes = item;
      // 选择指定的时间点
      if (this.selWeek === '' || JSON.stringify(this.selTimes) === '{}') {
        return;
      }
      // 老师列表加载
      this.teacherFlag = 1;
      // 初始化老师列表
      this.perPage = 1;
      this.teacherList = [];
      this.selTeachers = {};
      this.getTeachers();
    },
    selectTeacher(item) {
      this.selTeachers = item;
    },
    filtrate(where) {
      this.teacherWhere = where;
      this.perPage = 1;
      this.teacherFlag = 1;
      this.getTeachers();
    },
    getTeachers() {
      this.loadingData = true;
      let url = `${this.apiConfig.host}/teacher/teacher-time/adjust-teachers?`;
      url += `&schedule_id=${this.scheduleId}&course_id=${this.courseId}&teacher_id=${this.teacherId}&page=${this.perPage}`;
      url += `&date=${this.selDate}&time=${this.selTimes.k}&recommed_type=4&attention=${this.teacherWhere.attention || 0}&teaching_age=${this.teacherWhere.teaching_age || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        // 老师列表加载
        this.loadingData = false;
        this.teacherFlag = 2;
        if (res.error_code > 0) {
          console.log(res.error_msg);
          return;
        }
        this.teacherCounts = res.data.counts;
        this.teacherLast = res.data.last;
        if (this.perPage === 1) {
          this.teacherFirst = res.data.first;
          this.teacherList = res.data.data;
        } else {
          this.teacherList = this.teacherList.concat(res.data.data);
        }
        if (this.teacherLast > 0) {
          this.perPage += 1;
        }
      });
    },
    loadMore() { // 下拉加载更多
      if (this.teacherLast <= 0 || this.loadingData || this.$route.name !== 'adjustTime') {
        return false;
      }
      this.getTeachers();
    },
    confirm() {
      if (this.selWeek === '' || JSON.stringify(this.selTimes) === '{}' || JSON.stringify(this.selTeachers) === '{}') {
        return false;
      }
      const postData = {
        teacher_id: this.selTeachers.id,
        date: this.selDate,
        time: this.selTimes.k,
      };
      const url = `${this.apiConfig.host}/classroom/schedules/${this.scheduleId}/adjust-schedule`;
      this.$http.post(url, postData).then((res) => {
        this.adjustPop = false;
        if (res.error_code === 0) {
          this.$vux.toast.show({
            time: 2000,
            type: 'success',
            isShowMask: true,
            position: 'middle',
            text: '调课成功，请您按时上课',
            width: '17.6em',
          });
          setTimeout(() => {
            this.$router.go(-1);
            // this.$router.replace({
            //   name: 'schedule',
            //   query: {
            //     date: this.selDate,
            //   },
            // });
          }, 2000);
        } else {
          this.$vux.toast.show({
            time: 2000,
            type: 'warn',
            isShowMask: true,
            position: 'middle',
            text: '调课需提前24小时操作，下次可以提前哦~',
            width: '17.6em',
          });
          setTimeout(() => {
            this.init();
          }, 2000);
        }
      });
    },
    handleScroll() {
      // 页面滚动距顶部距离
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const scroll = scrollTop - this.scrollHeight;
      this.scrollHeight = scrollTop;
      if (scrollTop > 180) {
        if (scroll < 0) {
          this.showTime = false;
        } else {
          this.showTime = true;
        }
      }
      if (this.$refs.filtPositionTime) {
        this.filtTop = this.$refs.filtPositionTime.getBoundingClientRect().top + 60;
        if (scrollTop > this.filtTop) {
          this.filtFixed = true;
        } else {
          this.filtFixed = false;
        }
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.init();
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
    window.addEventListener('scroll', this.handleScroll, true);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
