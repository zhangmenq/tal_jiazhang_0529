import WeekBox from '@/components/time/AdjustWeekBox';
import TimeBox from '@/components/time/AdjustTimeBox';
import SelectBox from '@/components/time/SelectBox';

export default {
  components: {
    WeekBox,
    TimeBox,
    SelectBox,
  },
  data() {
    return {
      courseId: 0,
      scheduleId: 0,
      teacherId: 0,
      weekList: {},
      weeks: ['一', '二', '三', '四', '五', '六', '日'],
      weekTimes: [],
      selDate: '',
      timeList: [],
      timer: '',
    };
  },
  methods: {
    getDate() {
      const params = `?teacher_id=${this.teacherId}`;
      let url = `${this.apiConfig.host}/classroom/schedules/${this.scheduleId}/adjust-date`;
      if (this.teacherId) {
        url = `${url}${params}`;
      }
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        if (res.data.length === 0) {
          console.log('没有时间');
          return;
        }
        this.selDate = res.data[0].v;
        res.data.forEach((element) => {
          this.$set(this.weekList, element.v, this.weeks[element.k - 1]);
        });
      });
    },
    getTime() {
      let params = `?date=${this.selDate}&course_id=${this.courseId}`;
      if (this.teacherId) {
        params = `${params}&teacher_id=${this.teacherId}`;
      }
      const url = `${this.apiConfig.host}/classroom/schedules/${this.scheduleId}/adjust-time${params}`;
      return this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          this.timeList = [];
          console.log(res.error_msg);
          return;
        }
        this.timeList = res.data;
      });
    },
    getParams() {
      this.courseId = this.$route.params.courseId;
      this.scheduleId = this.$route.params.scheduleId;
      // teacherId 为空 按时间选老师
      this.teacherId = this.$route.query.teacher_id;
      return Promise.resolve();
    },
    selectWeek(item) {
      if (item.week === this.selDate) {
        return;
      }
      this.selDate = item.week;
      this.getTime();
    },
    selectTime(item) {
      if (item.k === '') {
        return;
      }
      if (this.weekTimes.length > 0) {
        this.weekTimes.shift();
      }
      this.weekTimes.push({
        week: this.selDate,
        timeK: item.k,
        timeV: item.v,
      });
    },
    delWeekTimes(item) {
      this.weekTimes.splice(item.key, 1);
    },
    confirm() {
      const url = `${this.apiConfig.host}/classroom/schedules/${this.scheduleId}/adjust-schedule`;
      const postData = {
        teacher_id: this.teacherId,
        date: this.weekTimes[0].week,
        time: this.weekTimes[0].timeK,
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
          time: '2000',
          isShowMask: true,
        });
        this.timer = setTimeout(() => {
          if (res.error_code !== 0) {
            location.reload();
            return;
          }
          window.location.href = `/schedule?date=${this.weekTimes[0].week}`;
        }, 2000);
      });
    },
    selTeacher(type) { // type 0-换老师 1-确定时间选老师
      let url = `/adjust/teacher/${this.courseId}/${this.scheduleId}`;
      if (type) {
        url = `${url}?date=${this.weekTimes[0].week}&time=${this.weekTimes[0].timeK}`;
      }
      this.$router.push({
        path: url,
      });
    },
    adjustTime() {
      if (this.teacherId) { // 已选老师确认调课
        this.confirm();
        return;
      }
      this.selTeacher(1);
    },
    async init() {
      await this.getParams();
      await this.getDate();
      await this.getTime();
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.init().then(() => {
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
