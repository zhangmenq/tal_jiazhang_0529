<template>
  <div class="introduce_con">
    <p>1、什么是调课？</p>
    <p>当学员临时有事不能上课，可以通过调课的方式来保证整体课程的正常学习，遵循调课具体规则进行操作，只可对某节课进行单次调课，允许换上课老师和上课时间点，调课后上课的课程内容是完全一致的。</p>
    <p>2、什么课可以调？</p>
    <p>Reach课程和HE课程一学年课程分为第1、2、3、4四个学段。每学段可分别调课3次。</p>
    <p>3、调课规则</p>
    <p>调课可操作距上课时间大于等于24小时，小于等于14天内（含操作当天）的课程。可调入范围为大于等于24小时，小于等于14天内（含操作当天）的时间段。操作调课后，一周内最多允许上3节课。</p>
    <p>4、如何调课？</p>
    <p>在【调课】功能中选择当前的课程，在课程中选择需要调整的课次，根据提示直接操作即可，调课成功后会有相应的短信提醒。</p>
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
