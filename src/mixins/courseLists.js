import NoContent from '@/components/common/NoContent.vue';
import RecentItem from '@/components/home/RecentItem';
import { isMidCourse } from '@/utils';
import moment from 'moment';

export default {
  data() {
    return {
      lists: [],
      type: 1,
      noContentTips: '暂无课程，敬请期待~',
      loadingData: true,
      // 近期课程
      recentLoadingData: true,
      recentLists: [],
      mainList: [],
      extraList: [],
      adjustParams: {},
    };
  },
  components: {
    NoContent,
    RecentItem,
  },
  mounted() {
    this.init();
  },
  methods: {
    /* eslint-disable */
    getLists() {
      const type = this.type
      const url = `${this.apiConfig.host}/course/courses?type=${type}`
      return this.$http.get(url).then(res => {
        const ret = res.data
        if (ret.packages && ret.packages.length > 0) {
          const packages = ret.packages
          packages.map(item => {
            item.is_package = true
            item.is_mid = isMidCourse(item.start_at, res.server_time)
          })
          this.lists = this.lists.concat(packages)
        }
        if (ret.courses.length) {
          const courses = ret.courses
          courses.map(item => {
            item.is_mid = isMidCourse(item.start_at, res.server_time)
          })
          this.lists = this.lists.concat(courses)
        }
        this.getShortLists()
      })
    },
    // 近期课程
    getRecentLists() {
      const url = `${this.apiConfig.host}/classroom/schedules/recent-schedules`;
      return this.$http.get(url).then(res => {
        this.recentLoadingData = false;
        for (let i = 0; i < res.data.length; i += 1) {
          if (res.data[i].type !== 3) {
            this.mainList.push(res.data[i]);
          } else {
            this.extraList.push(res.data[i]);
          }
        }
        this.recentLists = [...this.mainList, ...this.extraList];
      });
    },
    getShortLists() {
      const url = `${this.apiConfig.host}/course/short-courses`
      this.$http.get(url).then(response => {
        this.loadingData = false
        const ret = response.data
        if (response.error_code !== 0) {
          return false
        }
        if (ret.packages && ret.packages.length > 0) {
          const packages =  this.sortFun(ret.packages)
          this.lists = this.lists.concat(packages)
        }
        if (ret.courses.length) {
          const courses = this.sortFun(ret.courses);
           this.lists = this.lists.concat(courses)
        }
      })
    },
    //  短期班按售卖时间排序
    sortFun(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
          if (moment(arr[j].start_at) > moment(arr[j+1].start_at) ) {
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    init() {
      this.getLists();
      this.getRecentLists();    
    }
  }
}
