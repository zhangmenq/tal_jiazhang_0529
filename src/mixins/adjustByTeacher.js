import moment from 'moment';
import { mapState } from 'vuex';
import TeacherTimeBoxAdjust from '@/components/time/TeacherTimeBoxAdjust';
import NoContent from '@/components/common/NoContent';
import { getUserInfo } from '@/api';

export default {
  components: {
    NoContent,
    TeacherTimeBoxAdjust,
  },
  data() {
    return {
      lists: [],
      page: 1,
      teacherFirst: 0,
      isShowMore: true,
      teacherLast: 0,
      times: [],
      selTeachers: {}, // 选择老师
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
      selDate: '',
      selectedWeek: 0,
      teacherWhere: {
        attention: false,
        teacher_sex: 0,
        teams: '',
        teaching_age: 0,
      },
      teacherCounts: 0,
      teacherFlag: 0, //0 加载中  1加载完成
      oldTeacher: [], //原班老师
      showPrefer: false, //是否显示设置老师偏好提醒
      filtTop: 0,
      filtFixed: false,
    };
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
    teacherId() {
      return this.$route.query.teacher_id || 0;
    },
    courseId() {
      return this.$route.params.courseId || 0;
    },
    scheduleId() {
      return this.$route.params.scheduleId || 0;
    },
    startAt() {
      return this.$route.query.startAt || '';
    },
    hasFiltrate() {
      return (JSON.stringify(this.teacherWhere) !== '{}' && (this.teacherWhere.attention ||
        this.teacherWhere.teacher_sex > 0 ||
        this.teacherWhere.teams !== '' || this.teacherWhere.teaching_age));
    },
  },
  methods: {
    selectTime(obj) {
      this.selTime = obj.time;
    },
    selectWeek(obj) {
      const teachers = obj.teachers;
      const weekKey = obj.weekKey;
      this.selDate = obj.date;
      this.selectedWeek = moment(obj.date).format('d') >= 1 ? moment(obj.date).format('d') : 7;
      this.times = [];
      if (!teachers.id) {
        return;
      }
      // 修改当前选中老师、周
      this.selTeachers = teachers;
      this.selWeek = weekKey;
      this.selTime = {};
      let url = `${this.apiConfig.host}classroom/schedules/${this.scheduleId}/adjust-time?teacher_id=${teachers.id}&`;
      url += `course_id=${this.courseId}&date=${this.selDate}`;
      this.loadingTime = true;
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
      if (this.teacherLast <= 0 || this.loadingData || this.$route.name !== 'adjustTeacher') {
        return false;
      }
      this.page += 1;
      this.getAllList();
    },
    showMoreTeacher() {
      this.isShowMore = false;
      this.lists = [];
      this.page = 1;
      this.getAllList();
    },
    filtrate(where) {
      this.teacherWhere = where;
      this.page = 1;
      this.teacherFlag = 0;
      this.oldTeacher = [];
      this.getAllList();
    },
    getAllList() {
      this.loadingData = true;
      if (this.page === 1) {
        this.teacherFlag = 0;
      }
      let url = `${this.apiConfig.host}teacher/teacher-time/adjust-teacher-infos?`;
      url += `&page=${this.page}&schedule_id=${this.scheduleId}&course_id=${this.courseId}`;
      url += `&teacher_id=${this.$route.query.teacher_id}&recommed_type=4&attention=${this.teacherWhere.attention || 0}&teaching_age=${this.teacherWhere.teaching_age || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        this.teacherFlag = 1;
        this.loadingData = false;
        if (res.error_code !== 0) {
          this.$vux.toast.show({
            time: 2000,
            type: 'success',
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
          });
          return;
        }
        this.teacherCounts = res.data.counts;
        this.teacherLast = res.data.last;
        this.teacherFirst = res.data.first;
        const list = res.data.data;
        if (this.page === 1 && !this.hasFiltrate) {
          this.oldTeacher = list.splice(0, 1);
          this.lists = list;
        } else if (this.page === 1 && this.teacherLast === 0) {
          this.lists = list;
        } else {
          this.lists = this.lists.concat(list);
        }
      });

    },
    getList() {
      this.loadingData = true;
      if (this.page === 1) {
        this.teacherFlag = 0;
      }
      let url = `${this.apiConfig.host}teacher/teacher-time/adjust-teachers?`;
      url += `&page=${this.page}&schedule_id=${this.scheduleId}&course_id=${this.courseId}`;
      url += `&teacher_id=${this.$route.query.teacher_id}&recommed_type=4&attention=${this.teacherWhere.attention || 0}`;
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teacher_sex > -1) {
        url += `&teacher_sex=${this.teacherWhere.teacher_sex}`;
      }
      if (JSON.stringify(this.teacherWhere) !== '{}' && this.teacherWhere.teams !== '') {
        url += `&teams=${this.teacherWhere.teams}`;
      }
      return this.$http.get(url).then((res) => {
        this.teacherFlag = 1;
        this.loadingData = false;
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.teacherCounts = res.data.counts;
        this.teacherLast = res.data.last;
        this.teacherFirst = res.data.first;
        const list = res.data.data;
        if (this.isShowMore && this.page === 1 && !this.hasFiltrate) {
          this.lists = list.splice(0, 1);
          this.lists.forEach((element) => {
            this.getWeek(element.id).then((weeks) => {
              this.$set(element, 'weeks', weeks);
            });
          });
          return;
        } else if (this.page === 1) {
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
          this.page += 1;
        }
      });
    },
    getWeek(teacherId) { // 获取指定老师周列表
      let url = `${this.apiConfig.host}/classroom/schedules/${this.scheduleId}/adjust-date`;
      url += `?teacher_id=${teacherId}`;
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          return {};
        }
        return res.data;
      });
    },
    timeMode() {
      this.$router.push({
        name: 'adjustTime',
        params: {
          courseId: this.courseId,
          scheduleId: this.scheduleId,
        },
        query: {
          teacherId: this.teacherId,
        },
      });
    },
    confirm() {
      if (JSON.stringify(this.selTeachers) === '{}' || this.selWeek === '' || JSON.stringify(this.selTime) === '{}') {
        console.log('参数错误');
        return;
      }
      const postData = {
        teacher_id: this.selTeachers.id,
        date: this.selDate,
        time: this.selTime.k,
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
          // setTimeout(() => {
          //   this.getList();
          // }, 2000);
        }
      });
    },
    //判断是否显示设置老师偏好提示框
    showPreferTips() {
      getUserInfo().then(() => {
        const userInfo = this.$store.state.userInfo;
        if (userInfo.prefer_teaching === null) {
          this.showPrefer = true;
        } else {
          this.showPrefer = false;
        }
      });
    },
    handleScroll() {
      // 页面滚动距顶部距离
      if (this.$refs.filtPosition) {
        this.filtTop = this.$refs.filtPosition.getBoundingClientRect().top + 60;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
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
    await this.getAllList().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
    await this.showPreferTips();
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
