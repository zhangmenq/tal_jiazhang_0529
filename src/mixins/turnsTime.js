import WeekBox from '@/components/time/WeekBox';
import TimeBox from '@/components/time/TimeBox';
import TeacherBox from '@/components/time/TeacherBox';
import NoContent from '@/components/common/NoContent';
import Loading from '@/components/loading/Index';
import LoadMore from '@/components/loadmore/Index';

export default {
  components: {
    WeekBox,
    TimeBox,
    TeacherBox,
    NoContent,
    Loading,
    LoadMore,
  },
  data() {
    return {
      weekList: {},
      timeList: [],
      selWeek: '',
      selTime: {},
      timer: '',
      selTeacher: {},
      perPage: 1,
      teacherList: [],
      teacherFirst: 0, // 原班老师标识(第一个) 0.没有原班老师 1.原班老师无空闲时间 2.原班老师有空闲时间
      teacherLast: 0, // >0 可以请求下一页 =0不用请求下一页
      error: {
        code: 0,
        msg: '',
      },
      defaultWeek: '',
      defaultTime: 0,
      teacherFlag: false,
      loadingMore: false,
      loadingTime: false,
      teacherWhere: {
        attention: false,
        teacher_sex: 0,
        teaching_age: 0,
        teams: '',
      },
      teacherCounts: 0,
      loadingData: false,
      showTime: false,
      filtTop: 0,
      filtFixed: false,
    };
  },
  computed: {
    courseId() {
      return this.$route.params.courseId;
    },
    classroomId() {
      return this.$route.params.classroomId;
    },
    hasFiltrate() {
      return (JSON.stringify(this.teacherWhere) !== '{}' && (this.teacherWhere.attention ||
        this.teacherWhere.teacher_sex > 0 ||
        this.teacherWhere.teams !== ''));
    },
  },
  methods: {
    goTeacher() {
      this.$router.push({
        name: 'turnsTeacher',
        params: {
          courseId: this.courseId,
          classroomId: this.classroomId,
        },
      });
    },
    countdown() {
      this.timer = setTimeout(() => {
        this.$router.push({ path: '/mine/course' });
      }, 3000);
    },
    filtrate(where) {
      this.teacherWhere = where;
      console.log(this.teacherWhere);
      this.perPage = 1;
      this.teacherList = [];
      this.getTeachers();
    },
    getTeachers() {
      this.loadingData = true;
      if (this.perPage === 1) {
        this.teacherFlag = true;
      }
      let url = `${this.apiConfig.host}/teacher/teacher-time/order-teachers?course_id=${this.courseId}`;
      url += `&week=${this.selWeek}&time=${this.selTime.k}&page=${this.perPage}&isturns=1`;
      url += `&recommed_type=3&attention=${this.teacherWhere.attention || 0}&teaching_age=${this.teacherWhere.teaching_age || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        this.loadingData = false;
        this.teacherFlag = false;
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
    getWeekList() {
      const params = `?course_id=${this.courseId}`;
      const url = `${this.apiConfig.host}/teacher/teacher-time/idle-week${params}`;
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          this.error.code = 1;
          this.error.msg = res.error_msg;
          this.weekList = [];
          this.countdown();
          return;
        }
        this.weekList = res.data;
        const weekKey = Object.keys(res.data);
        this.selWeek = weekKey[0];
      });
    },
    getTimeList() {
      this.loadingTime = true;
      const params = `?course_id=${this.courseId}&week=${this.selWeek}&isturns=1`;
      const url = `${this.apiConfig.host}/teacher/teacher-time/idle-time${params}`;
      return this.$http.get(url).then((res) => {
        this.loadingTime = false;
        if (res.error_code !== 0) {
          this.timeList = [];
          console.log(res.error_code);
          return;
        }
        this.timeList = res.data;
      });
    },
    getWeekTime() {
      const url = `${this.apiConfig.host}/classroom/classrooms/${this.classroomId}/time`;
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.defaultWeek = res.data.week[0];
        this.defaultTime = res.data.time[0];
      });
    },
    initTeachers() { // 默认展示原时间下的老师
      if (!this.weekList[this.defaultWeek]) {
        return;
      }
      this.timeList.forEach((element) => {
        if (element.k === this.defaultTime) {
          this.selTime = element;
        }
      });
      if (JSON.stringify(this.selTime) === '{}') {
        return;
      }
      this.selWeek = String(this.defaultWeek);
      this.getTeachers();
    },
    selectWeek(item) {
      if (item.week === this.selWeek) {
        return;
      }
      // 获取当前选中周的时间列表
      this.selWeek = item.week;
      this.timeList = [];
      this.selTime = {};
      this.teacherList = [];
      this.selTeacher = {};
      this.teacherWhere = {
        attention: false,
        teacher_sex: 0,
        teams: '',
      };
      this.getTimeList();
    },
    selectTime(item) {
      this.selTime = item;
      // 选择指定的时间点
      if (this.selWeek === '' || JSON.stringify(this.selTime) === '{}') {
        return;
      }
      // 初始化老师列表
      this.perPage = 1;
      this.selTeacher = {};
      this.teacherList = [];
      this.getTeachers();
    },
    selectTeacher(item) {
      this.selTeacher = item;
    },
    loadMore() { // 下拉加载更多
      if (this.teacherLast <= 0 || this.loadingData || this.$route.name !== 'turnsTime') {
        return false;
      }
      this.loadingMore = true;
      this.getTeachers().then(() => {
        this.loadingMore = false;
      });
    },
    confirm() { // 转班
      if (this.selWeek === '' || JSON.stringify(this.selTime) === '{}' || JSON.stringify(this.selTeacher) === '{}') {
        return;
      }
      const url = `${this.apiConfig.host}/classroom/classrooms/${this.classroomId}/change`;
      const params = {
        course_id: this.courseId,
        teacher_id: this.selTeacher.id,
        week: this.selWeek,
        time: this.selTime.k,
      };
      this.$http.put(url, params).then(() => {
        this.turnsStatus();
      });
    },
    // 转班状态
    turnsStatus() {
      const url = `${this.apiConfig.host}/classroom/classrooms/${this.classroomId}/change-status`;
      let times = 1;
      const timer = setInterval(() => {
        this.$http.get(url).then((res) => {
          if (times >= 3) {
            clearInterval(timer);
            this.turnsPop = false;
            this.hint('转班失败，请稍后再试');
            return;
          }
          if (res.error_code === 10404) { // 转班处理中
            times += 1;
          }
          if (res.error_code === 0) { // 转班成功
            clearInterval(timer);
            this.turnsPop = false;
            this.hint('转班成功，请您按时上课');
            return;
          }
          if (res.error_code !== 10404) { // 其他error错误
            clearInterval(timer);
            this.turnsPop = false;
            this.hint(res.error_msg);
          }
        });
      }, 3000);
    },
    hint(msg) { // 提示跳转
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        width: '15em',
        time: '2000',
        isShowMask: true,
      });
      setTimeout(() => {
        this.$router.push({ path: '/mine/course' });
      }, 2000);
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
      if (this.$refs.filtTurnsTime) {
        this.filtTop = this.$refs.filtTurnsTime.getBoundingClientRect().top + 60;
        if (scrollTop > this.filtTop) {
          this.filtFixed = true;
        } else {
          this.filtFixed = false;
        }
      }
    },
    async init() {
      await this.getWeekList();
      await this.getTimeList();
      await this.getWeekTime();
      await this.initTeachers();
    },
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.init();
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
