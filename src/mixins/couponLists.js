import ScrollData from '@/components/common/ScrollData';

export default {
  name: 'usable',
  components: {
    ScrollData,
  },
  data() {
    return {
      lists: [],
      total: 0,
      currentPage: 0,
      isEmpty: false,
      busy: false,
      loadingData: true,
    };
  },
  methods: {
    loadMore() {
      //判断是否到达底部
      if (!this.isEmpty && !this.busy) {
        this.busy = true;
        this.getCouponInfo();
      }
    },
    getCouponInfo() {
      const status = this.status;
      const page = this.currentPage + 1;
      const url = `${this.apiConfig.host}student/coupons/?type=${status}&page=${page}`;

      this.$http.get(url).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.loadingData = false;
        const ret = res.data;
        if (ret.total === 0) {
          this.isEmpty = true;
          this.busy = true;
        } else {
          this.lists = this.lists.concat(ret.data);
          this.total = ret.total;
          this.currentPage = page;
          this.isEmpty = false;
          if (this.lists.length === this.total) {
            this.busy = true;
          } else {
            this.busy = false;
          }
        }
      });
    },
  },
  mounted() {
    this.getCouponInfo();
  },
};
