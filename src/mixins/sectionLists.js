import ScrollData from '@/components/common/ScrollData';

export default {
  name: 'Notyet',
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
      showBuy: 1,
    };
  },
  methods: {
    loadMore() {
      //判断是否到达底部
      if (!this.isEmpty && !this.busy) {
        this.busy = true;
        this.getSectionLists();
      }
    },
    getSectionLists() {
      const status = this.status;
      const page = this.currentPage + 1;
      const url = `${this.apiConfig.host}classroom/classrooms?status=${status}&page=${page}`;
      this.$http.get(url).then((response) => {
        this.loadingData = false;
        if (response.error_code !== 0) {
          return false;
        }
        if (response.data.total === 0) {
          this.isEmpty = true;
          this.busy = true;
        } else {
          this.lists = this.lists.concat(response.data.data);
          this.total = response.data.total;
          this.currentPage = page;
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
    this.getSectionLists();
  },
};
