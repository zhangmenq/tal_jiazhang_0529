<template>
  <div class="introduce_con">
    <p>1、什么是转班？</p>
    <p>当学员因为上课时间或老师不合适，需要把整体的上课时间或老师进行调整，可以通过转班的方式来保证整体课程的正常学习。遵循转班具体规则进行操作，可对剩下未开课的所有课节进行整体转班，允许换上课老师和上课时间点，转班后上课的课程内容是完全一致的。</p>
    <p>2、什么课可以转班？</p>
    <p>Reach课程和HE课程一学年课程分为第1、2、3、4四个学段。每学段课程开课前，可以随时转班，不消耗转班机会；每学段课程开课后，学员有2次转班机会，当学段内使用。</p>
    <p>3、转班规则</p>
    <p>操作转班时，如距离最近一次课大于等于24h，剩余课节可进行转班，即时生效（以老师实际可授课时间为准）;如距离最近一次课小于24h，最近一次课无法变更。</p>
    <p>*备注：若转班前操作了某节课的调课，不可对调过的课节进行转班，该课节以调课的老师和时间为准；</p>
    <p>4、如何转班？</p>
    <p>在【转班】功能中选择要转班的课程，根据提示直接操作即可，转班成功后会有相应的短信提醒。</p>
  </div>
</template>
<script>
export default {
  name: 'adjustIntroduce',
  data() {
    return {
    };
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';
.introduce_con{
  padding: .4rem;
  p{
    color: #524670;
    font-size: .28rem;
    line-height: .4rem;
    margin-bottom: .2rem;
  }
}

</style>
