<template>
  <div class="jump_style">
    正在跳转...
  </div>
</template>

<script>
export default {
  name: 'exp',
  data() {
    return {
      order_id: 0,
      jt: '1',
    };
  },
  created() {
    this.order_id = this.$route.params.order_id || 0;
    this.jt = this.$route.query.jt || '1';
    if (this.order_id !== 0) {
      let msgType = 'reorder_1904';
      if (this.jt === '2') {
        msgType = 'reorder_call_pay_1904';
      }
      this.$router.push({
        name: 'waitPay',
        query: {
          order_id: this.order_id,
          data_source: 5,
          data_origin: 4,
          msg_type: msgType,
        },
      });
    }
  },
};
</script>
<style lang="less" scoped>
  .jump_style{
    font-size: .3rem;
    text-align: center;
    padding: 1rem 0;
    color: #999;
  }
</style>
