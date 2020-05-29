import ExpTimeBox from '@/components/time/ExpTimeBox';
import ExpWeekBox from '@/components/time/ExpWeekBox';
import ExpSelectBox from '@/components/time/ExpSelectBox';
import NoContent from '@/components/common/NoContent';
import ExpOrderConfirm from '@/components/dialog/ExpOrderConfirm';

export default {
  components: {
    ExpTimeBox,
    ExpWeekBox,
    ExpSelectBox,
    NoContent,
    ExpOrderConfirm,
  },
  data() {
    return {
      selNum: 1,
      dateList: [],
      dateLoading: true,
      timeList: [],
      timeLoading: true,
      selWeek: '',
      sleDate: '1990-03-01',
      dateTimes: [],
      delDate: '',
      timer: '',
      weekData: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日',
      },
      courseId: 0,
      dialogStatus: false,
      isDisabled: false,
      noTimeType: 0, // 0-有时间 1-正常日期没有时间 2-假期没有时间
    };
  },
  methods: {
    countdown() {
      this.timer = setTimeout(() => {
        this.$router.push({ path: '/home' });
      }, 3000);
    },
    getDateList() {
      const url = `${this.apiConfig.host}teacher/teacher-time/temp-date`;
      return this.$http.get(url).then((res) => {
        this.handleDateLists(res.data);
        this.dateLoading = false;
        const weekKey = Object.values(res.data);
        this.selWeek = String(weekKey[0]);
        const dateKey = Object.keys(res.data);
        this.selDate = dateKey[0];
      });
    },
    handleDateLists(data) {
      /* eslint-disable no-restricted-syntax */
      for (const item in data) {
        if (item !== '') {
          this.dateList.push({
            date: item,
            k: data[`${item}`],
            v: this.weekData[data[`${item}`]],
          });
        }
      }
    },
    getTimeList(date, week) {
      this.timeLoading = true;
      this.timeList = [];
      const url = `${this.apiConfig.host}teacher/teacher-time/temp-idle-time?date=${date}&week=${week}`;
      return this.$http.get(url).then((res) => {
        this.timeLoading = false;
        if (Number(res.error_code) === 0) {
          this.timeList = res.data;
          return;
        }
        if (Number(res.error_code) === 10324) {
          this.noTimeType = 2;
          return;
        }
        this.noTimeType = 1;
      });
    },
    getInfo(date) {
      const url = `${this.apiConfig.host}course/courses/temp?date=${date}`;
      return this.$http.get(url);
    },
    async init() {
      await this.getDateList();
      await this.getTimeList(this.selDate, this.selWeek);
    },
    selectDate(item) {
      if (item.date === this.selDate) {
        return;
      }
      // 获取当前选中周的时间列表
      this.selDate = item.date;
      this.selWeek = item.k;
      this.getTimeList(this.selDate, this.selWeek);
    },
    selectTime(item) {
      // 超出选中数 删除
      if (this.dateTimes.length > this.selNum - 1) {
        this.dateTimes.shift();
      }
      this.dateTimes.push({
        date: this.selDate,
        week: this.weekData[this.selWeek],
        timeK: item.k,
        timeV: item.v,
      });
    },
    delDateTimes(index) {
      this.dateTimes.splice(index, 1);
    },
    handleError() {
      this.dateTimes.length = 0;
      this.$vux.toast.show({
        text: '您所选时间的老师已被占用，请选择其他时间～',
        width: '17.6rem',
        time: 2000,
      });
    },
    pay() {
      this.$router.push({
        name: 'confirmOrder',
        query: {
          course_id: this.courseId,
          type: 1,
          time: this.dateTimes[0].timeK,
          week: this.selWeek,
          date: this.selDate,
          exp: 1,
        },
      });
    },
    showDialog() {
      if (this.selNum !== 0 && this.dateTimes.length !== this.selNum) {
        return;
      }
      this.dialogStatus = true;
    },
    closeDialog() {
      this.dialogStatus = false;
    },
    confirm() {
      if (this.selNum !== 0 && this.dateTimes.length !== this.selNum) {
        return;
      }
      this.isDisabled = true;
      this.getInfo(this.selDate).then((res) => {
        if (res.error_code !== 0) {
          // 关闭下单确认弹框 && 修改按钮状态
          this.dialogStatus = false;
          this.isDisabled = false;
          this.handleError();
        } else {
          this.courseId = res.data.id;
          this.pay();
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
