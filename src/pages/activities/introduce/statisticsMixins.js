import getOrigin from '@/utils/origin';

export default {
  methods: {
    toPosterpage() {
      if (getOrigin() === 'peiyou') {
        this.$http.get(`${this.apiConfig.host}student/active-count?type=peiyou_individuation_poster`);
      } else {
        this.$http.get(`${this.apiConfig.host}student/active-count?type=my_individuation_poster`);
      }
      this.$router.push({
        name: 'introduce',
      });
    },
  },
};
