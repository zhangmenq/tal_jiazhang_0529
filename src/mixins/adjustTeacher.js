import { shuffle } from 'lodash';

export default {
  data() {
    return {
      list: [],
      courseId: 0,
      scheduleId: 0,
      date: '',
      time: '',
      name: '',
      showSearch: false,
    };
  },
  methods: {
    getParams() {
      this.courseId = this.$route.params.courseId;
      this.scheduleId = this.$route.params.scheduleId;
      this.date = this.$route.query.date;
      this.time = this.$route.query.time;
      return Promise.resolve();
    },
    getList() {
      const url = `${this.apiConfig.host}/teacher/teacher-time/teachers`;
      let params = `?course_id=${this.courseId}`;
      if (this.date && this.time) {
        params = `${params}&date=${this.date}&time=${this.time}`;
      }
      if (this.name !== '') {
        params = `${params}&name=${this.name}`;
      }
      return this.$http.get(`${url}${params}`).then((res) => {
        if (res.error_code !== 0) {
          this.list = [];
          console.log(res.error_msg);
          return;
        }
        this.list = shuffle(res.data);
      });
    },
    // 确认调课
    confirm(teacherId) {
      const url = `${this.apiConfig.host}/classroom/schedules/${this.scheduleId}/adjust-schedule`;
      const postData = {
        teacher_id: teacherId,
        date: this.date,
        time: this.time,
      };
      this.$http.post(url, postData).then((res) => {
        let msg = '调课成功，请您按时上课';
        // 调课日期
        if (res.error_code !== 0) {
          msg = res.error_msg;
        }
        this.$vux.toast.show({
          type: 'text',
          text: msg,
          width: '15em',
          time: 2000,
          isShowMask: true,
        });
        this.timer = setTimeout(() => {
          if (res.error_code !== 0) {
            location.reload();
            return;
          }
          window.location.href = `/schedule?date=${this.date}`;
        }, 2000);
      });
    },
    // 根据老师选时间
    selTime(teacherId) { // teacherId === true 确认老师选时间
      let url = `/adjust/time/${this.courseId}/${this.scheduleId}`;
      if (teacherId) {
        url = `${url}?teacher_id=${teacherId}`;
      }
      this.$router.push({
        path: url,
      });
    },
    reload() { //页面重新加载
      this.$router.go();
    },
    adjustTeacher(teacherId) {
      if (this.date && this.time) { // 时间选定 确认调课
        this.confirm(teacherId);
        return;
      }
      this.selTime(teacherId);
    },
    search(item) { // 搜索老师
      this.showSearch = false;
      this.name = item.searchValue;
      this.getList();
    },
    async init() {
      await this.getParams();
      await this.getList();
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    this.init().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.$vux.toast.hide();
  },
};
