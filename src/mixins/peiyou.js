import { getItem } from '@/utils/localStorage';

export default {
  methods: {
    checkPeiyouLogin() {
      if (this.$route.query.uid && this.$route.query.cityCode) {
        const peiyouUid = this.$route.query.uid.replace(/\s/g, '+');
        const cityCode = this.$route.query.cityCode;
        // 培优用户已经登录
        if (getItem('peiyou-uid') && getItem('peiyou-cityCode')) {
          if ((getItem('peiyou-uid') !== peiyouUid)
          || (getItem('peiyou-cityCode') !== cityCode)
          || (!getItem('token'))) {
            window.localStorage.clear();
            this.$router.replace({
              name: 'peiyouIndex',
              query: {
                uid: peiyouUid,
                cityCode: cityCode,
              },
            });
          }
        }
        this.$router.replace({
          name: 'peiyouIndex',
          query: {
            uid: peiyouUid,
            cityCode: cityCode,
          },
        });
      }
    },
  },
};
