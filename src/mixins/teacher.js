import TeacherTimeBox from '@/components/time/TeacherTimeBox';
import NoContent from '@/components/common/NoContent';
import { getCourseInfo, getPackageInfo } from '@/api/index';

export default {
  components: {
    TeacherTimeBox,
    NoContent,
  },
  data() {
    return {
      courseInfo: {},
      lists: [],
      perPage: 1,
      teacherFirst: 0,
      teacherLast: 0,
      teacherCounts: 0,
      teacherWhere: {
        attention: false,
        teacher_sex: 0,
        teams: '',
        teaching_age: 0,
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
        this.teacherWhere.teams !== '' || this.teacherWhere.teaching_age > 0));
    },
  },
  methods: {
    selectTime(obj) {
      this.selTime = obj.time;
    },
    selectWeek(obj) {
      const teachers = obj.teachers;
      const weekKey = obj.weekKey;
      this.times = [];
      if (!teachers.id) {
        return;
      }
      this.loadingTime = true;
      // 修改当前选中老师、周
      this.selTeacher = teachers;
      this.selWeek = weekKey;
      this.selTime = {};
      let url = `${this.apiConfig.host}/teacher/teacher-time/idle-time?teacher_id=${teachers.id}&week=${weekKey}&`;
      if (this.type === 'package') {
        url += `package_id=${this.packageId}`;
      } else {
        url += `course_id=${this.courseId}`;
      }
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
      if (this.teacherLast <= 0 || this.loadingData) {
        return false;
      }
      this.getList();
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
    filtrate(where) {
      this.teacherWhere = where;
      this.perPage = 1;
      this.lists = [];
      this.getList();
    },
    getList() {
      this.loadingData = true;
      if (this.perPage === 1) {
        this.teacherFlag = true;
      }
      let url = `${this.apiConfig.host}/teacher/teacher-time/order-teachers?`;
      if (this.type === 'package') {
        url += `package_id=${this.packageId}`;
      } else {
        url += `course_id=${this.courseId}`;
      }
      url += `&page=${this.perPage}&recommed_type=4&attention=${this.teacherWhere.attention || 0}&teaching_age=${this.teacherWhere.teaching_age || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        this.loadingData = false;
        this.teacherFlag = false;
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        if (res.data.data.length === 0 && !this.hasFiltrate) {
          return;
        }
        this.teacherLast = res.data.last;
        this.teacherCounts = res.data.counts;
        const list = res.data.data;
        if (this.perPage === 1) {
          this.teacherFirst = res.data.first;
          this.lists = list;
        } else {
          this.lists = this.lists.concat(list);
        }
        list.forEach((element) => {
          this.getWeek(element.id).then((weeks) => {
            // console.log(weeks);
            this.$set(element, 'weeks', weeks);
          });
        });
        if (this.teacherLast > 0) {
          this.perPage += 1;
        }
      });
    },
    getWeek(teacherId) { // 获取指定老师周列表
      let url = `${this.apiConfig.host}/teacher/teacher-time/idle-week?teacher_id=${teacherId}&`;
      if (this.type === 'package') {
        url += `package_id=${this.packageId}`;
      } else {
        url += `course_id=${this.courseId}`;
      }
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return {};
        }
        return res.data;
      });
    },
    confirm() {
      if (JSON.stringify(this.selTeacher) === '{}' || this.selWeek === '' || JSON.stringify(this.selTime) === '{}') {
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
      const name = this.courseInfo.book_id > 0 ? 'orderMaterial' : 'confirmOrder';
      this.$router.push({
        name,
        query: params,
      });
      this.orderPop = false;
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.getInfo();
    await this.getList().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
};
