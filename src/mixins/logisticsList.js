export default {
  name: 'shipped',
  components: {},
  data() {
    return {
      lists: [],
      isEmpty: false,
      loadingData: true,
    };
  },
  methods: {
    getLogsticsLists() {
      const status = this.status;
      const url = `${this.apiConfig.host}logistics/lists?status=${status}`;
      this.$http.get(url).then((response) => {
        this.loadingData = false;
        if (response.error_code !== 0) {
          return false;
        }
        this.lists = response.data;

      });
    },
  },
  mounted() {
    this.getLogsticsLists();
  },
};
