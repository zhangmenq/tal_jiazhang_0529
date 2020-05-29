<template>
  <div class="appoint-succeed">
    <div class="succeed-bg"></div>
    <h2>预约成功！</h2>
    <p v-if="moment() >= moment('2019-02-02') && moment() <= moment('2019-02-11')">
      感谢您选择VIPX，春节期间课程暂停，我们将于年初八（2月12日）后与您联系安排上课时间，请保持手机畅通。
    </p>
    <p v-else>感谢您选择VIPX，我们会在3-7个工作日内与您联系安排上课时间，请保持手机畅通。</p>
    <router-link class="go-back" to="/home">返回首页</router-link>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'appointSucceed',
  methods: {
    moment(date) {
      return moment(date);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.appoint-succeed{
  padding: 0 .9rem;
  font-size: .3rem;
  color: #fff;
  text-align: center;
  .succeed-bg{
    width: 3.46rem;
    height: 3.46rem;
    border-radius: 50%;
    .bg-m('../assets/succeed-bg.png', 0, 0, no-repeat);
    background-size: 3.46rem 3.46rem;
    margin: 1rem auto .52rem;
  }
  h2{
    font-size: .36rem;
    color: #1B223F;
  }
  p{
    color: #B2B7CE;
    padding-top: .24rem;
  }
  .go-back{
    display: block;
    width: 1.8rem;
    height: .7rem;
    background: #9A57C8;
    border-radius: .1rem;
    line-height: .7rem;
    margin: 1.12rem auto;
    color: #fff;
  }
}
</style>
