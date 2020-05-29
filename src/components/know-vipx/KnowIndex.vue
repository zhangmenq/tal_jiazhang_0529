<template>
  <div>
    <sticky>
      <div class="vipx-tab">
        <ul>
          <li v-for="(tab, index) in tabList"
            :key="index"
            :class="{'active': active === index}"
            @click="toggle(index, tab.type)">
            {{tab.view}}
            <div class="tab-line"></div>
          </li>
        </ul>
      </div>
    </sticky>
    <component :is="currentView"></component>
  </div>
</template>
<script>
import { Sticky } from 'vux';
import TrainingGoal from './TrainingGoal.vue';
import ModelTeaching from './ModelTeaching.vue';
import AssuredModel from './AssuredModel.vue';
import HowClass from './HowClass.vue';
import TextbookSystem from './TextbookSystem.vue';
import TeachingTeam from './TeachingTeam.vue';

export default {
  components: {
    Sticky,
    TrainingGoal,
    ModelTeaching,
    AssuredModel,
    HowClass,
    TextbookSystem,
    TeachingTeam,
  },
  props: {
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentView: 'TrainingGoal',
      tabList: [
        { type: 'TrainingGoal', view: '培养目标' },
        { type: 'ModelTeaching', view: '教学模式' },
        { type: 'TextbookSystem', view: '教材体系' },
        { type: 'TeachingTeam', view: '师资团队' },
        { type: 'AssuredModel', view: '安心承诺' },
        { type: 'HowClass', view: '如何上课' },
      ],
    };
  },
  methods: {
    toggle(i, v) {
      this.active = i;
      this.currentView = v;
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../styles/basic.less';

.vipx-tab{
  width: 100%;
  overflow: auto;
  background: @col-white;
  box-shadow: 0 12px 20px 0 rgba(53,37,94,0.05);
  ul {
    white-space: nowrap;
    .wh(100%, 1.13rem);
    line-height: 1.13rem;
    padding-left: .2rem;
    li {
      display: inline-block;
      width: 1.44rem;
      line-height: .4rem;
      margin-left: .2rem;
      font-size: .28rem;
      color: #35255E;
      text-align: center;
      &.active{
        font-size: .36rem;
        .tab-line {
          display: block;
          .wh(.9rem, .14rem);
          background: @new-col-title-purple;
          border-radius: .07rem;
          margin: .2rem auto 0;
        }
      }
    }
  }
}
.vipx-slide{
  height: 100%;
}
</style>
