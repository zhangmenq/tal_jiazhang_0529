import TeacherTimeBox from '@/components/time/TeacherTimeBox';
import NoContent from '@/components/common/NoContent';

export default {
  components: {
    TeacherTimeBox,
    NoContent,
  },
  data() {
    return {
      lists: [],
      perPage: 1,
      teacherFirst: 0,
      teacherLast: 0,
      teacherCounts: 0,
      teacherWhere: {
        attention: false,
        teacher_sex: 0,
        teams: '',
      },
      times: [],
      selTeacher: {}, // 选择老师
      selWeek: '',
      selTime: {},
      weeks: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日',
      },
      loadingData: false,
      loadingTime: false,
      teacherFlag: false,
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
    countdown() {
      this.timer = setTimeout(() => {
        this.$router.push({ path: '/mine/course' });
      }, 3000);
    },
    selectTime(obj) {
      this.selTime = obj.time;
    },
    selectWeek(obj) {
      const teachers = obj.teachers;
      const weekKey = obj.weekKey;
      if (!teachers.id) {
        return;
      }
      this.loadingTime = true;
      // 修改当前选中老师、周
      this.selTeacher = teachers;
      this.selWeek = weekKey;
      this.selTime = {};
      this.times = {};
      const params = `teacher_id=${teachers.id}&week=${weekKey}&course_id=${this.courseId}&isturns=1`;
      const url = `${this.apiConfig.host}/teacher/teacher-time/idle-time?${params}`;
      this.$http.get(url).then((res) => {
        this.loadingTime = false;
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.times = res.data;
      });
    },
    loadMore() {
      if (this.teacherLast <= 0 || this.loadingData || this.$route.name !== 'turnsTeacher') {
        return false;
      }
      this.getList();
    },
    filtrate(where) {
      this.teacherWhere = where;
      this.perPage = 1;
      this.lists = [];
      this.getList();
    },
    getList() {
      if (this.perPage === 1) {
        this.teacherFlag = true;
      }
      this.loadingData = true;
      let url = `${this.apiConfig.host}/teacher/teacher-time/order-teachers?course_id=${this.courseId}&page=${this.perPage}&isturns=1`;
      url += `&recommed_type=3&attention=${this.teacherWhere.attention || 0}&teaching_age=${this.teacherWhere.teaching_age || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        this.teacherFlag = false;
        this.loadingData = false;
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        if (res.data.data.length === 0 && !this.hasFiltrate) {
          return;
        }
        this.teacherCounts = res.data.counts;
        this.teacherLast = res.data.last;
        const list = res.data.data;
        if (this.perPage === 1) {
          this.teacherFirst = res.data.first;
          this.lists = list;
        } else {
          this.lists = this.lists.concat(list);
        }
        list.forEach((element) => {
          this.getWeek(element.id).then((weeks) => {
            this.$set(element, 'weeks', weeks);
          });
        });
        if (this.teacherLast > 0) {
          this.perPage += 1;
        }
      });
    },
    getWeek(teacherId) { // 获取指定老师周列表
      const url = `${this.apiConfig.host}/teacher/teacher-time/idle-week?teacher_id=${teacherId}&course_id=${this.courseId}`;
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return {};
        }
        return res.data;
      });
    },
    confirm() {
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
      this.isDisabled = true;
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
      if (this.$refs.filtTurnsTeacher) {
        this.filtTop = this.$refs.filtTurnsTeacher.getBoundingClientRect().top + 60;
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
    await this.getList().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
