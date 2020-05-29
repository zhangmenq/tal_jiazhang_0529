import WeekBox from '@/components/time/WeekBox';
import TimeBox from '@/components/time/TimeBox';
import TeacherBox from '@/components/time/TeacherBox';
import SelectBox from '@/components/time/SelectBox';
import NoContent from '@/components/common/NoContent';
import Loading from '@/components/loading/Index';
import LoadMore from '@/components/loadmore/Index';
import { getCourseInfo, getPackageInfo } from '@/api/index';

export default {
  components: {
    WeekBox,
    TimeBox,
    TeacherBox,
    SelectBox,
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
      courseInfo: {},
      timer: '',
      error: {
        code: 0,
        msg: '',
      },
      perPage: 1,
      teacherWhere: {
        attention: false,
        teacher_sex: 0,
        teams: '',
        teaching_age: 0,
      },
      teacherList: [],
      teacherFirst: 0, // 原班老师标识(第一个) 0.没有原班老师 1.原班老师无空闲时间 2.原班老师有空闲时间
      teacherLast: 0, // >0 可以请求下一页 =0不用请求下一页
      teacherCounts: 0,
      selTeacher: {},
      loadingTime: true,
      teacherFlag: false,
      loadingMore: false,
      loadingData: false,
      shortTeacher: {},
      tvClassTime: '', // TV课上课时间
    };
  },
  computed: {
    type() {
      return this.$route.query.course_id ? 'course' : 'package';
    },
    courseId() {
      return this.$route.query.course_id;
    },
    packageId() {
      return this.$route.query.package_id;
    },
    hasFiltrate() {
      return (JSON.stringify(this.teacherWhere) !== '{}' && (this.teacherWhere.attention ||
        this.teacherWhere.teacher_sex > 0 ||
        this.teacherWhere.teams !== ''));
    },
    isShortCourse() { // 是否是短期班
      return this.courseInfo.type === 1 && this.courseInfo.class_type === 1;
    },
  },
  methods: {
    goTeacher() {
      let params = {
        course_id: this.courseId,
      };
      if (this.type === 'package') {
        params = {
          package_id: this.packageId,
        };
      }
      this.$router.push({
        name: 'selTeacher',
        query: params,
      });
    },
    countdown() {
      this.timer = setTimeout(() => {
        if (this.courseInfo.content_type === 1) {
          this.$router.push({ path: '/activity/reading-course' });
        } else if (this.courseInfo.content_type === 6 || this.courseInfo.content_type === 7) {
          this.$router.push({ path: '/activity/short-course' });
        } else {
          this.$router.push({ path: '/home' });
        }
      }, 3000);
    },
    getWeekList() {
      let url = `${this.apiConfig.host}/teacher/teacher-time/idle-week?`;
      if (this.type === 'package') {
        url += `package_id=${this.packageId}`;
      } else {
        url += `course_id=${this.courseId}`;
      }
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
      let url = `${this.apiConfig.host}/teacher/teacher-time/idle-time?week=${this.selWeek}&`;
      if (this.type === 'course') {
        url += `course_id=${this.courseId}`;
      } else {
        url += `package_id=${this.packageId}`;
      }
      return this.$http.get(url).then((res) => {
        this.loadingTime = false;
        if (res.error_code !== 0) {
          this.timeList = [];
          return;
        }
        this.timeList = res.data;
      });
    },
    getInfo() {
      if (this.type === 'course') {
        return getCourseInfo(this.courseId).then(() => {
          this.courseInfo = this.$store.state.courseInfo;
        });
      }
      return getPackageInfo(this.packageId).then(() => {
        this.courseInfo = this.$store.state.packageInfo;
      });
    },
    async init() {
      await this.getInfo();
      await this.getWeekList();
      await this.getTimeList();
    },
    selectWeek(item) {
      if (item.week === this.selWeek) {
        return;
      }
      // 获取当前选中周的时间列表
      this.selWeek = item.week;
      this.teacherList = [];
      this.selTime = {};
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
      this.teacherList = [];
      this.selTeacher = {};
      if (this.isShortCourse) {
        this.getShortTeacher();
        if (this.courseInfo.course_id > 0) {
          this.recommendTime();
        }
      } else {
        this.getTeachers();
      }
    },
    selectTeacher(item) {
      this.selTeacher = item;
    },
    filtrate(where) {
      this.teacherWhere = where;
      this.perPage = 1;
      this.teacherList = [];
      this.getTeachers();
    },
    getTeachers() {
      this.loadingData = true;
      if (this.perPage === 1) {
        this.teacherFlag = true;
      }
      let url = `${this.apiConfig.host}/teacher/teacher-time/order-teachers?`;
      if (this.type === 'course') {
        url += `course_id=${this.courseId}`;
      } else {
        url += `package_id=${this.packageId}`;
      }
      url += `&week=${this.selWeek}&time=${this.selTime.k}&page=${this.perPage}`;
      url += `&recommed_type=4&attention=${this.teacherWhere.attention || 0}&teaching_age=${this.teacherWhere.teaching_age || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        // 老师列表加载
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
    loadMore() { // 下拉加载更多
      if (this.teacherLast <= 0 || this.loadingData) {
        return;
      }
      this.loadingMore = true;
      this.getTeachers().then(() => {
        this.loadingMore = false;
      });
    },
    //获取短期班老师
    getShortTeacher() {
      this.loadingData = true;
      this.shortTeacher = {};
      const url = `${this.apiConfig.host}/teacher/teacher-time/short-teacher?course_id=${this.courseId}&week=${this.selWeek}&time=${this.selTime.k}`;
      return this.$http.get(url).then((res) => {
        // 老师列表加载
        this.loadingData = false;
        if (res.error_code > 0) {
          return;
        }
        this.shortTeacher = res.data;
        this.selTeacher.id = res.data.id;
      });
    },
    confirm() {
      if (this.selWeek === '' || JSON.stringify(this.selTime) === '{}' || (JSON.stringify(this.selTeacher) === '{}')) {
        return;
      }
      let params = {
        course_id: this.courseId,
        teacher_id: this.selTeacher.id,
        type: 1,
        week: this.selWeek,
        time: this.selTime.k,
      };
      if (this.type === 'package') {
        params = {
          package_id: this.packageId,
          teacher_id: this.selTeacher.id,
          type: 2,
          week: this.selWeek,
          time: this.selTime.k,
        };
      }
      const name = this.courseInfo.book_id > 0 && !this.isShortCourse ? 'orderMaterial' : 'confirmOrder';
      this.$router.push({
        name,
        query: params,
      });
    },
    // 获取Tv课推荐时间
    recommendTime() {
      this.tvClassTime = '';
      const url = `${this.apiConfig.host}/course/recommend-time?course_id=${this.courseId}&week=${this.selWeek}&time=${this.selTime.k}`;
      this.$http.get(url).then((response) => {
        if (response.error_code === 0) {
          const data = response.data;
          if (data && data.start_at) {
            this.tvClassTime = `${data.start_at.substr(0, 10)} ${data.time_cn}`;
          }
        }
      });
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
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
