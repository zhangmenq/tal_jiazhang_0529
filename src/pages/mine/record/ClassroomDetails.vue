<template>
  <div class="classroom-details">
    <router-link class="introduce_btn" :to="{path: '/mine/record/classroomIntroduce'}">转班说明</router-link>
    <Loading v-if="isLoading"></Loading>
    <record-details
      v-else
      :recorddetails="detailsInfo">
    </record-details>
  </div>
</template>
<script>
import RecordDetails from '@/components/record/RecordDetails';
import Loading from '@/components/loading/Index';

export default {
  components: {
    RecordDetails,
    Loading,
  },
  data() {
    return {
      detailsInfo: {},
      isLoading: true,
    };
  },
  methods: {
    classroomDetailsInfo() {
      const id = this.$route.params.change_id;
      this.$http.get(`${this.apiConfig.host}classroom/classroom-changes/${id}`).then((response) => {
        this.isLoading = false;
        if (response.error_code !== 0) {
          return false;
        }
        this.detailsInfo = response.data;
      });
    },
  },
  mounted() {
    this.classroomDetailsInfo();
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';

.classroom-details{
  min-height: 100%;
  padding: .4rem;
  position: relative;
  .introduce_btn{
    position: absolute;
    right: 0;
    top: .1rem;
    width: 1.45rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    background:linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
    border-top-left-radius: .3rem;
    border-bottom-left-radius: .3rem;
    font-size: .28rem;
    color:#fff;
  }
}
</style>
