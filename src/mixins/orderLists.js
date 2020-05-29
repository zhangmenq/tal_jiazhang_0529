import moment from 'moment';
import ScrollData from '@/components/common/ScrollData';

export default {
  data() {
    return {
      status: 0,
      lists: [],
      total: 0,
      currentPage: 0,
      isEmpty: false,
      busy: false,
      noContentTips: '暂无订单~',
      loadingData: true,
      isReorderTime: false,
    };
  },
  components: {
    ScrollData,
  },
  methods: {
    loadMore() {
      //判断是否到达底部
      if (!this.isEmpty && !this.busy) {
        this.busy = true;
        this.getLists();
      }
    },
    getLists() {
      const status = this.status;
      const page = this.currentPage + 1;
      const url = `${this.apiConfig.host}/order/orders?status=${status}&page=${page}`;

      return this.$http.get(url).then((res) => {
        this.loadingData = false;
        if (res.data.total === 0) {
          this.isEmpty = true;
          this.busy = true;
          this.total = 0;
        } else {
          this.lists = this.timeCount(this.lists.concat(res.data.data), res.server_time);
          this.total = res.data.total;
          this.currentPage = page;
          if (res.data.cancel_show) {
            const start = res.data.cancel_show.start || '2018-11-19';
            const end = res.data.cancel_show.end || '2018-11-25';
            this.isReorderTime = moment() >= moment(start) && moment() <= moment(end);
          }
          if (this.lists.length === this.total) {
            this.busy = true;
          } else {
            this.busy = false;
          }
        }
      });
    },
    /* eslint-disable */
    timeCount(lists, server_time) {
      if (this.status === 0 && lists.length) {
        lists.map(item => {
          let expired_at = item.expired_at;
          expired_at = expired_at.replace(/\-/g, '/');
          item.left_time = parseInt(((new Date(expired_at).getTime()) - (server_time* 1000))/1000, 10);
        });
      }
      return lists;
    },

    init() {
      this.getLists();
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    //待支付订单，需要倒计时
    await this.getLists().then(() => {
      if (this.status === 0) {
        const timer = setInterval(() => {
          this.lists.map(item => {
            item.left_time -= 1;
          });
          this.lists = this.lists.filter(item => {
            return item.left_time > 0;
          });

          if (this.lists.length === 0) {
            clearInterval(timer);
            this.init();
          }
        }, 1000);
      }
    });
    await await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
};
