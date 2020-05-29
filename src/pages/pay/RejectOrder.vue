<template>
  <div class="reject-order">
    <img src="../../assets/reject-order-img1.png"/><br>
    <p>{{ text }}</p>
    <br>
    <p>{{ countDown }}s后会自动跳转</p>
  </div>
</template>

<script>
export default {
  name: 'rejectOrder',
  data() {
    return {
      countDown: 3,
      timer: '',
      text: '下单错误，请重试！',
      error: {
        redirect: {
          name: 'home',
        },
      },
    };
  },
  mounted() {
    this.text = this.$route.query.msg;
    const errorCode = this.$route.query.code;
    let timeRedirect = {};
    if (this.$route.query.is_exp === 0) {
      timeRedirect = {
        name: 'time',
        query: {
          [this.$route.query.course_key]: this.$route.query.id,
          type: this.$route.query.type,
        },
      };
    } else {
      timeRedirect = {
        name: 'expTime',
      };
    }

    const paidRedirect = { name: 'paidOrder' };
    const cancelRedirect = { name: 'cancelOrder' };
    const unpayRedirect = { name: 'unpayOrder' };
    const refundRedirect = { name: 'refundOrder' };
    const errLists = {
      10321: timeRedirect,
      10401: timeRedirect,
      10322: timeRedirect,
      10201: timeRedirect,
      10905: paidRedirect,
      10303: paidRedirect,
      10906: cancelRedirect,
      10907: cancelRedirect,
      10306: unpayRedirect,
      10910: unpayRedirect,
      10908: refundRedirect,
      10909: refundRedirect,
    };

    if (typeof errLists[`${errorCode}`] !== 'undefined') {
      this.error.redirect = errLists[`${errorCode}`];
    }

    this.timer = setInterval(() => {
      this.countDown -= 1;
      if (this.countDown === 0) {
        clearInterval(this.timer);
        this.$router.replace(this.error.redirect);
      }
    }, 1000);
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    next();
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.reject-order{
  background: @col-bg;
  font-size: .3rem;
  color: @col-darkgray;
  text-align: center;
  height: 100%;
  img{
    margin: 1.1rem 0 .38rem;
  }
  p{
    color: @col-purple;
    margin-top: .28rem;
  }
}
</style>
